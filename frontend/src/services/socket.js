import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket Client Connected]:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket Client Disconnected]');
    });
  }
  return socket;
};

export const joinOrderTracking = (orderId) => {
  const s = getSocket();
  s.emit('join_order_room', orderId);
};

export const joinFlashSale = (saleId) => {
  const s = getSocket();
  s.emit('join_flash_sale_room', saleId);
};

