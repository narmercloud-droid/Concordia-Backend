import Redis from 'ioredis';

let client = null;

if (process.env.REDIS_URL?.startsWith('redis://')) {
  client = new Redis(process.env.REDIS_URL);
}

export default client;
