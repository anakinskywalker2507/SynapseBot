module.exports = async (twitchClient, channel, username, streakMonths, recipient, tags) => {
  const payload = JSON.stringify({
    eventType: 'subgift',
    data: { channel, username, streakMonths, recipient, tags }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published subgift event to ${twitchClient.channel}`);
}
