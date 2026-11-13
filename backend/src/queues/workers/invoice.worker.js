const { Worker } = require('bullmq');
const { connection } = require('../queue');
const { generateInvoicePDF } = require('../../services/invoice.service');
const { uploadToS3 } = require('../../config/s3');
const Order = require('../../models/Order');

const startInvoiceWorker = () => {
  try {
    const worker = new Worker(
      'invoice-generation',
      async (job) => {
        const { orderId } = job.data;
        console.log(`[BullMQ Worker: Invoice] Processing Job #${job.id} for Order: ${orderId}`);

        const order = await Order.findById(orderId);
        if (!order) {
          throw new Error(`Order ${orderId} not found`);
        }

        // 1. Generate PDF document in memory
        const pdfBuffer = await generateInvoicePDF(order);

        // 2. Upload to S3 / Local storage
        const fileName = `invoices/invoice-${order.orderNumber}.pdf`;
        const uploadResult = await uploadToS3(pdfBuffer, fileName, 'application/pdf');

        // 3. Update order record with generated invoice URL
        order.invoiceUrl = uploadResult.url;
        await order.save();

        console.log(`[BullMQ Worker: Invoice] Invoice created and linked: ${uploadResult.url}`);
        return { success: true, invoiceUrl: uploadResult.url };
      },
      { connection, concurrency: 5 }
    );

    worker.on('error', () => {
      // Graceful offline handler when Redis is in memory fallback
    });

    worker.on('completed', (job) => {
      console.log(`[BullMQ Worker: Invoice] Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[BullMQ Worker: Invoice] Job ${job?.id} failed with error: ${err.message}`);
    });

    return worker;
  } catch (err) {
    console.warn(`[BullMQ Worker Notice] Worker initialization skipped: ${err.message}`);
    return null;
  }
};

module.exports = startInvoiceWorker;
