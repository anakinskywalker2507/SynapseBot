module.exports = async (discordClient, channel, username, _method, _message, tags) => {
  const months = tags['msg-param-cumulative-months'];
  const streak = tags['msg-param-streak-months'];

  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    let subMessage = `### 🎉 A new subscriber! \`${username}\` just subscribed to \`${channel}\`!`;
    if (months) {
      subMessage = `### ✨ Re-sub from \`${username}\`!`;
      if (streak) {
        subMessage += ` (Streak: ${streak} months)`;
      }
    }

    discordChannel.send(subMessage)
      .then(() => {
        console.log(`Relayed subscription notification to Discord: "${subMessage}"`);
      })
      .catch(error => {
        console.error('Error relaying subscription to Discord:', error);
      })
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
}
