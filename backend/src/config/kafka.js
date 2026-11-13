const { Kafka, LogLevel } = require('kafkajs');

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID || 'hyperscale-saas-core';

let kafka = null;
let producer = null;
let consumer = null;
let isConnected = false;

try {
  kafka = new Kafka({
    clientId,
    brokers,
    logLevel: LogLevel.NOTHING,
    retry: {
      initialRetryTime: 300,
      retries: 2
    }
  });

  producer = kafka.producer();
} catch (err) {
  console.warn('[Kafka Notice] Client initialization skipped.');
}

const connectKafka = async () => {
  try {
    if (!producer) return;
    await producer.connect();
    isConnected = true;
    console.log('[Kafka] Producer connected successfully to brokers:', brokers);

    consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'hyperscale-analytics-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'hyperscale.analytics.events', fromBeginning: false });
    console.log('[Kafka] Consumer subscribed to topic: hyperscale.analytics.events');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          console.log(`[Kafka Stream Streamed] [${topic} - Part:${partition}]: ${payload.eventType}`);
        } catch (e) {
          // parse error
        }
      }
    });
  } catch (error) {
    console.warn(`[Kafka Notice] Broker not reachable (${error.message}). Mock stream active.`);
    isConnected = false;
  }
};

const getKafkaProducer = () => ({
  send: async ({ topic, messages }) => {
    if (isConnected && producer) {
      return await producer.send({ topic, messages });
    }
    // Resilient local simulation
    messages.forEach((m) => {
      console.log(`[Kafka Sim Producer] [Topic: ${topic}]: ${m.value}`);
    });
    return [{ topicName: topic, partition: 0, errorCode: 0 }];
  }
});

module.exports = {
  connectKafka,
  getKafkaProducer,
  isKafkaConnected: () => isConnected
};

