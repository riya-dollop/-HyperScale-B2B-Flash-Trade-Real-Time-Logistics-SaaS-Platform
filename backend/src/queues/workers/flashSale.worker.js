const { Worker } = require('bullmq');
const { connection } = require('../queue');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { getIO } = require('../../config/socket');
const { publishEvent } = require('../../events/rabbitProducer');

const startFlashSaleWorker = () => {
  try {
    const worker = new Worker(
      'flash-sale-orders',
      async (job) => {
        const { orderData } = job.data;
        console.log(`[BullMQ Worker: FlashSale] Persisting flash sale order: ${orderData.orderNumber}`);

        // 1. Create order record in MongoDB
        const newOrder = await Order.create(orderData);

        // 2. Decrement permanent database inventory
        for (const item of newOrder.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { 'flashSale.stock': -item.quantity, stock: -item.quantity },
          });
        }

        // 3. Emit real-time inventory and order confirmation via Socket.io
        const io = getIO();
        io.emit('flash_sale_order_confirmed', {
          orderNumber: newOrder.orderNumber,
          productId: newOrder.items[0]?.product,
        });

        // 4. Publish inter-service event via RabbitMQ
        await publishEvent('order.created', {
          orderId: newOrder._id,
          orderNumber: newOrder.orderNumber,
          totalAmount: newOrder.totalAmount,
          customer: newOrder.customer,
        });

        return { success: true, orderId: newOrder._id };
      },
      { connection, concurrency: 10 }
    );

    worker.on('error', () => {
      // Graceful offline handler
    });

    return worker;
  } catch (err) {
    console.warn(`[FlashSale Worker Notice]: ${err.message}`);
    return null;
  }
};

module.exports = startFlashSaleWorker;
