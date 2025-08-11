module.exports = async (discordClient, channel, tags, message, self) => {
  if (self) return;
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    discordChannel.send(`\`${tags['display-name']}\` **(\`${channel}\`):** ${message}`);
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
}
