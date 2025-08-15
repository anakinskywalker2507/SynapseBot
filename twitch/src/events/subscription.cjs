module.exports = async (twitchClient, channel, username, methods, message, tags) => {
  const payload = JSON.stringify({
    eventType: 'subscription',
    data: { channel, username, methods, message, tags }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published subscription event to ${twitchClient.channel}`);
}
