module.exports = async (discordClient, twitchClient) => {
  twitchClient.on('message', (tags, message, self) => {
    if (self) return;

    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      discordChannel.send(`**${tags['display-name']}** (Twitch): ${message}`);
    }
  });

  twitchClient.on('subscription', (username, tags) => {
    const months = tags['msg-param-cumulative-months'];

    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      let subMessage = `🎉 A new subscriber! **${username}** just subscribed to the channel!`;
      if (months) {
        subMessage = `🎉 A new sub from **${username}**! This is their ${months} month in a row!`;
      }

      discordChannel.send(subMessage)
        .then(() => {
          console.log(`Relayed subscription notification to Discord: "${subMessage}"`);
        })
        .catch(error => {
          console.error('Error relaying subscription to Discord:', error);
        });
    }
  })
}
