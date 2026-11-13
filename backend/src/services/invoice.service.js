const PDFDocument = require('pdfkit');
const { uploadToS3 } = require('../config/s3');

/**
 * Generate PDF buffer for an Order using PDFKit
 */
const generateInvoicePDF = async (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Header
      doc.fillColor('#1E293B').fontSize(22).text('HyperScale B2B Logistics Platform', { align: 'left' });
      doc.fontSize(10).fillColor('#64748B').text('Enterprise Flash-Trade Invoicing System', { align: 'left' });
      doc.moveDown(1.5);

      // Invoice Details
      doc.fontSize(12).fillColor('#0F172A').text(`INVOICE: ${orderData.orderNumber || 'ORD-UNKNOWN'}`);
      doc.fontSize(10).fillColor('#475569');
      doc.text(`Date: ${new Date(orderData.createdAt || Date.now()).toLocaleDateString()}`);
      doc.text(`Customer ID: ${orderData.customer || 'N/A'}`);
      doc.text(`Payment Status: ${(orderData.paymentStatus || 'PAID').toUpperCase()}`);
      doc.text(`Payment Method: ${(orderData.paymentMethod || 'STRIPE').toUpperCase()}`);
      doc.moveDown(1);

      // Line items table header
      doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#1E293B');
      doc.text('Item Description', 50, tableTop);
      doc.text('Qty', 350, tableTop, { width: 50, align: 'right' });
      doc.text('Unit Price', 410, tableTop, { width: 60, align: 'right' });
      doc.text('Subtotal', 480, tableTop, { width: 70, align: 'right' });
      doc.font('Helvetica');

      doc.moveDown(0.5);
      doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

      let currentY = doc.y + 10;
      const items = orderData.items || [];

      items.forEach((item) => {
        doc.fontSize(9).fillColor('#334155');
        doc.text(item.title || 'Product', 50, currentY, { width: 280 });
        doc.text((item.quantity || 1).toString(), 350, currentY, { width: 50, align: 'right' });
        doc.text(`$${(item.unitPrice || 0).toFixed(2)}`, 410, currentY, { width: 60, align: 'right' });
        doc.text(`$${(item.subtotal || 0).toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });
        currentY += 22;
      });

      doc.moveDown(1.5);
      doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(50, currentY).lineTo(550, currentY).stroke();

      // Total
      const totalY = currentY + 15;
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#0F172A');
      doc.text('TOTAL AMOUNT:', 350, totalY, { width: 120, align: 'right' });
      doc.text(`$${(orderData.totalAmount || 0).toFixed(2)}`, 480, totalY, { width: 70, align: 'right' });

      // Footer
      doc.font('Helvetica').fontSize(9).fillColor('#94A3B8');
      doc.text(
        'Thank you for partnering with HyperScale B2B Logistics. This is a computer generated invoice.',
        50,
        700,
        { align: 'center', width: 500 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF,
};

