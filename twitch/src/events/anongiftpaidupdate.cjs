module.exports = async (twitchClient, channel, username, userstate) => {
  const payload = JSON.stringify({
    eventType: 'anongiftpaidupdate',
    data: { channel, userstate, giftCount }
  });
  twitchClient.redisClient.publish(twitchClient.channel, payload);
  console.log(`[Redis] Published anongiftpaidupdate event to ${twitchClient.channel}`);
}
