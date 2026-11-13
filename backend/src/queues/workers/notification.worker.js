const { Worker } = require('bullmq');
const { connection } = require('../queue');

const startNotificationWorker = () => {
  try {
    const worker = new Worker(
      'notifications',
      async (job) => {
        const { type, recipient, payload } = job.data;
        console.log(`[BullMQ Worker: Notification] Dispatching [${type}] to ${recipient}`);

        if (type === 'FCM_PUSH') {
          console.log(`[Firebase FCM Simulation] Title: "${payload.title}", Body: "${payload.body}" sent to token: ${recipient}`);
        } else if (type === 'EMAIL_INVOICE') {
          console.log(`[Email Service Simulation] Sent invoice email to ${recipient}`);
        } else if (type === 'SMS_TRACKING') {
          console.log(`[SMS Gateway Simulation] Delivery update sent to ${recipient}: ${payload.message}`);
        }

        return { delivered: true, timestamp: new Date() };
      },
      { connection, concurrency: 10 }
    );

    worker.on('error', () => {
      // Graceful offline handler
    });

    return worker;
  } catch (err) {
    console.warn(`[Notification Worker Notice]: ${err.message}`);
    return null;
  }
};

module.exports = startNotificationWorker;
