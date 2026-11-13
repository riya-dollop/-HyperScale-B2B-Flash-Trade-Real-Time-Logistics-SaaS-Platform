const { Server } = require('socket.io');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingInterval: 10000,
    pingTimeout: 5000
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for real-time order tracking
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined room: order_${orderId}`);
    });

    // Join room for live flash sale updates
    socket.on('join_flash_sale_room', (saleId) => {
      socket.join(`flash_sale_${saleId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined flash sale room: flash_sale_${saleId}`);
    });

    // Delivery Partner live coordinate simulation or broadcast
    socket.on('update_delivery_coords', (data) => {
      const { orderId, lat, lng, speed, heading } = data;
      io.to(`order_${orderId}`).emit('delivery_location_changed', {
        orderId,
        lat,
        lng,
        speed,
        heading,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    // Resilient mock if not initialized
    return {
      emit: () => {},
      to: () => ({ emit: () => {} })
    };
  }
  return io;
};

module.exports = {
  initSocket,
  getIO
};

