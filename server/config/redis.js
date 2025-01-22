// config/redisClient.js
const { createClient } = require('@redis/client');

// Create the Redis client and connect it
const client = createClient({ url: 'redis://127.0.0.1:6000' });

(async () => {
  try {
    await client.connect();
    console.log('Redis client is now ready to use.');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
})();

// Export the client to use it in other files
module.exports = client;
