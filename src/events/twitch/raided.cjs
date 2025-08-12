module.exports = async (discordClient, _twitchClient, _channel, username, viewers) => {
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    const raidMessage = `### 🚀 \`${username}\` started a raid with \_\_${viewers}\_\_ viewers !`;

    discordChannel.send(raidMessage)
      .catch(error => console.error('Error relaying raid:', error));
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
}
