const { getChannel, EXCHANGE_NAME } = require('../config/rabbitmq');

/**
 * Publishes durable messages to RabbitMQ Direct Exchange
 * @param {string} routingKey - e.g. 'order.created', 'inventory.sync'
 * @param {object} payload - message data object
 */
const publishEvent = async (routingKey, payload) => {
  const channel = getChannel();
  const messageBuffer = Buffer.from(JSON.stringify(payload));

  if (!channel) {
    console.log(`[RabbitMQ Mock Dispatch] RoutingKey: [${routingKey}] Payload:`, payload);
    return true;
  }

  try {
    const published = channel.publish(EXCHANGE_NAME, routingKey, messageBuffer, {
      persistent: true, // Survive RabbitMQ restart
      timestamp: Date.now(),
      contentType: 'application/json',
    });

    console.log(`[RabbitMQ Published] Key: ${routingKey}`);
    return published;
  } catch (error) {
    console.error(`[RabbitMQ Publish Error] Key: ${routingKey}`, error.message);
    return false;
  }
};

module.exports = {
  publishEvent,
};

