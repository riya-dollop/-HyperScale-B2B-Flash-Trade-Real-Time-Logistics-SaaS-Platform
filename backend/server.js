require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRabbitMQ } = require('./src/config/rabbitmq');
const { connectKafka } = require('./src/config/kafka');
const { initSocket } = require('./src/config/socket');
const { startRabbitConsumers } = require('./src/events/rabbitConsumer');
const startInvoiceWorker = require('./src/queues/workers/invoice.worker');
const startNotificationWorker = require('./src/queues/workers/notification.worker');
const startFlashSaleWorker = require('./src/queues/workers/flashSale.worker');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Create HTTP server from Express app
  const server = http.createServer(app);

  // 2. Initialize Real-Time Engine (Socket.io)
  const io = initSocket(server);
  console.log('[Socket.io] Real-time engine initialized.');

  // 3. Connect MongoDB
  await connectDB();

  // 4. Connect Message Broker (RabbitMQ) & Start Consumers
  const rabbitConn = await connectRabbitMQ();
  if (rabbitConn) {
    await startRabbitConsumers();
  }

  // 5. Connect Event Streaming (Kafka)
  await connectKafka();

  // 6. Start BullMQ Asynchronous Background Workers
  startInvoiceWorker();
  startNotificationWorker();
  startFlashSaleWorker();
  console.log('[BullMQ] Background processing workers started.');

  // 7. Start listening on network port
  server.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 HyperScale B2B SaaS Backend Engine Running on Port: ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`================================================================`);
  });

  // Graceful Shutdown on termination signals
  const shutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Commencing graceful shutdown...`);
    server.close(() => {
      console.log('[Server] HTTP and Socket.io server closed.');
      process.exit(0);
    });

    // Force shutdown after 10s timeout
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[Server Fatal Startup Error]:', err);
});

