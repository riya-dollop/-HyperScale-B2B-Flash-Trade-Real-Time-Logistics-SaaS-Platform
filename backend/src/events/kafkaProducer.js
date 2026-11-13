const { getKafkaProducer } = require('../config/kafka');

const KAFKA_TOPIC = 'hyperscale.analytics.events';

/**
 * High-throughput event emitter into Apache Kafka
 * @param {string} eventType - e.g. 'USER_ACTION', 'FLASH_TRADE_ATTEMPT', 'PAYMENT_COMPLETED'
 * @param {object} payload - arbitrary analytics metadata
 */
const emitKafkaEvent = async (eventType, payload) => {
  const producer = getKafkaProducer();

  const message = {
    key: String(payload.userId || payload.orderId || 'system-event'),
    value: JSON.stringify({
      eventType,
      timestamp: new Date().toISOString(),
      ...payload,
    }),
  };

  try {
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [message],
    });
  } catch (error) {
    console.error(`[Kafka Producer Error] ${error.message}`);
  }
};

module.exports = {
  emitKafkaEvent,
  KAFKA_TOPIC,
};

