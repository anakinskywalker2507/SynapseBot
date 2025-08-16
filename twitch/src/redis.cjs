module.exports = async redisClient => {
  const channelName = "discord_messages";

  redisClient.subscribe(channelName, (err, count) => {
    if (err) {
      console.error("Failed to subscribe: %s", err.message);
    } else {
      console.log(`Successfully subscribed to ${count} channel(s).`);
    }
  });

  redisClient.on("message", (channel, message) => {
    if (channel === channelName) {
      console.log(`Received message from channel "${channel}": ${message}`);
    }
  });

  redisClient.on('connect', () => {
    console.log('[✅]Successfully connected to Redis.');
  });

  redisClient.on('error', (err) => {
    console.error('[❌]Redis connection error:', err);
  });
}
