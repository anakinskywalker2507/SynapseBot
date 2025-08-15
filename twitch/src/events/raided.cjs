module.exports = async (twitchClient, channel, username, viewers) => {
  const payload = JSON.stringify({
    eventType: 'raided',
    data: { channel, username, viewers }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published raided event to ${twitchClient.channel}`);
}
