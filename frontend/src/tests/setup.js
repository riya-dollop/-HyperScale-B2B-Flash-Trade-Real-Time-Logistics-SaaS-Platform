import '@testing-library/jest-dom';

// Mock Socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

// Mock ResizeObserver for Recharts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

