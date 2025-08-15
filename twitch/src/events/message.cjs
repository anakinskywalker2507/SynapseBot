module.exports = async (twitchClient, channel, tags, message, self) => {
  const payload = JSON.stringify({
    eventType: 'message',
    data: { channel, tags, message, self }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published message event to ${twitchClient.channel}`);
}
