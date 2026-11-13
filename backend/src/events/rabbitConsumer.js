const { getChannel, INVENTORY_QUEUE, ORDER_QUEUE } = require('../config/rabbitmq');
const Product = require('../models/Product');
const { getIO } = require('../config/socket');

const startRabbitConsumers = async () => {
  const channel = getChannel();
  if (!channel) {
    console.log('[RabbitMQ Consumer Notice] Channel not available, consumer skipped.');
    return;
  }

  try {
    // 1. Inventory Sync Consumer
    await channel.consume(
      INVENTORY_QUEUE,
      async (msg) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString());
          console.log('[RabbitMQ Consumer: InventorySync] Processing:', content);

          // Sync database inventory if needed
          if (content.productId && content.quantity) {
            await Product.findByIdAndUpdate(content.productId, {
              $inc: { stock: -content.quantity },
            });

            // Broadcast real-time stock sync via Socket.io
            getIO().emit('inventory_synced', {
              productId: content.productId,
              remainingStock: content.remainingStock,
            });
          }

          // Acknowledge message upon successful processing
          channel.ack(msg);
        } catch (err) {
          console.error('[RabbitMQ Consumer Error: InventorySync]:', err.message);
          // Nack and route to DLQ (requeue: false)
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );

    // 2. Order Created Consumer
    await channel.consume(
      ORDER_QUEUE,
      async (msg) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString());
          console.log('[RabbitMQ Consumer: OrderCreated] Processing inter-service routing:', content.orderNumber);

          channel.ack(msg);
        } catch (err) {
          console.error('[RabbitMQ Consumer Error: OrderCreated]:', err.message);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );

    console.log('[RabbitMQ Consumer] Listeners active on inventory and order queues.');
  } catch (error) {
    console.warn(`[RabbitMQ Consumer Start Error]: ${error.message}`);
  }
};

module.exports = {
  startRabbitConsumers,
};

