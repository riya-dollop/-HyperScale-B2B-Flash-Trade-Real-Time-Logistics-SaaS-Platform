const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const EXCHANGE_NAME = 'hyperscale_direct_exchange';
const INVENTORY_QUEUE = 'inventory_sync_queue';
const ORDER_QUEUE = 'order_created_queue';

let channel = null;
let connection = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Setup durable exchange
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

    // Setup queues with DLQ configuration
    await channel.assertQueue(INVENTORY_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'hyperscale_dlx',
        'x-dead-letter-routing-key': 'dlq.inventory'
      }
    });

    await channel.assertQueue(ORDER_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'hyperscale_dlx',
        'x-dead-letter-routing-key': 'dlq.orders'
      }
    });

    await channel.bindQueue(INVENTORY_QUEUE, EXCHANGE_NAME, 'inventory.sync');
    await channel.bindQueue(ORDER_QUEUE, EXCHANGE_NAME, 'order.created');

    console.log('[RabbitMQ] Connected successfully & exchanges/queues asserted.');

    connection.on('error', (err) => {
      console.warn(`[RabbitMQ Error]: ${err.message}`);
    });

    connection.on('close', () => {
      console.warn('[RabbitMQ] Connection closed.');
    });

    return { connection, channel };
  } catch (error) {
    console.warn(`[RabbitMQ Notice] Could not connect (${error.message}). Mocking event channel.`);
    return null;
  }
};

const getChannel = () => channel;

module.exports = {
  connectRabbitMQ,
  getChannel,
  EXCHANGE_NAME,
  INVENTORY_QUEUE,
  ORDER_QUEUE
};

