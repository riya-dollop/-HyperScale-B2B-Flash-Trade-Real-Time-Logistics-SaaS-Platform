const Redis = require('ioredis');

// Enterprise Redis Client with resilient fallback
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

let redisClient = null;
let isConnected = false;

// In-memory fallback store when Redis instance is not reachable
const memoryStore = new Map();
const sortedSets = new Map();

const memoryFallback = {
  isFallback: true,
  async get(key) {
    return memoryStore.get(key) || null;
  },
  async set(key, value, mode, duration) {
    memoryStore.set(key, value);
    if (mode === 'EX' && duration) {
      setTimeout(() => memoryStore.delete(key), duration * 1000);
    }
    return 'OK';
  },
  async del(key) {
    return memoryStore.delete(key) ? 1 : 0;
  },
  async decr(key) {
    const current = parseInt(memoryStore.get(key) || '0', 10);
    const updated = current - 1;
    memoryStore.set(key, updated.toString());
    return updated;
  },
  async incr(key) {
    const current = parseInt(memoryStore.get(key) || '0', 10);
    const updated = current + 1;
    memoryStore.set(key, updated.toString());
    return updated;
  },
  async zadd(key, score, member) {
    if (!sortedSets.has(key)) sortedSets.set(key, []);
    const arr = sortedSets.get(key);
    arr.push({ score: Number(score), member });
    return 1;
  },
  async zremrangebyscore(key, min, max) {
    if (!sortedSets.has(key)) return 0;
    const arr = sortedSets.get(key);
    const filtered = arr.filter((item) => item.score < min || item.score > max);
    const removedCount = arr.length - filtered.length;
    sortedSets.set(key, filtered);
    return removedCount;
  },
  async zcard(key) {
    if (!sortedSets.has(key)) return 0;
    return sortedSets.get(key).length;
  },
  async expire(key, seconds) {
    setTimeout(() => {
      sortedSets.delete(key);
      memoryStore.delete(key);
    }, seconds * 1000);
    return 1;
  },
  on: () => {},
  status: 'ready'
};

try {
  redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('[Redis] Max retries reached. Switching to resilient in-memory fallback.');
        return null;
      }
      return Math.min(times * 100, 2000);
    },
  });

  redisClient.connect()
    .then(() => {
      isConnected = true;
      console.log(`[Redis] Connected successfully to ${redisHost}:${redisPort}`);
    })
    .catch((err) => {
      console.warn(`[Redis Notice] Server not reachable (${err.message}). Using Resilient In-Memory Fallback.`);
      redisClient = memoryFallback;
    });

  redisClient.on('error', (err) => {
    if (!isConnected) {
      redisClient = memoryFallback;
    }
  });
} catch (e) {
  redisClient = memoryFallback;
}

const getRedisClient = () => redisClient || memoryFallback;

module.exports = {
  redisClient: new Proxy({}, {
    get(target, prop) {
      const client = getRedisClient();
      return typeof client[prop] === 'function' ? client[prop].bind(client) : client[prop];
    }
  }),
  getRedisClient
};

