module.exports = async (twitchClient, redisClient) => {
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

      const tuple = message.split("|");

      const twitchMessage = `~Discord~ ${tuple[1]}: ${tuple[0]}`;

      twitchClient.say(process.env.TWITCH_CHANNEL, twitchMessage)
        .then(() => {
          console.log(`Relayed message from Discord to Twitch: "${twitchMessage}"`);
        })
        .catch(error => {
          console.error('Error relaying message to Twitch:', error);
        });
    }
  });

  redisClient.on('connect', () => {
    console.log('[✅]Successfully connected to Redis.');
  });

  redisClient.on('error', (err) => {
    console.error('[❌]Redis connection error:', err);
  });
}
