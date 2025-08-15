module.exports = async (twitchClient, channel, userstate, message) => {
  const payload = JSON.stringify({
    eventType: 'cheer',
    data: { channel, userstate, message }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published cheer event to ${twitchClient.channel}`);
}
