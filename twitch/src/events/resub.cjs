module.exports = async (twitchClient, channel, username, months, message, userstate) => {
  const payload = JSON.stringify({
    eventType: 'resub',
    data: { channel, username, months, message, userstate }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published resub event to ${twitchClient.channel}`);
}
