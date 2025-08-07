module.exports = async (discordClient, twitchClient) => {
  twitchClient.on('message', (_, tags, message, self) => {
    if (self) return;

    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      discordChannel.send(`**${tags['display-name']}** (Twitch): ${message}`);
    }
  });
}
