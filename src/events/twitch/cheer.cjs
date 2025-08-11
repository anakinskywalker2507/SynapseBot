module.exports = async (discordClient, userstate, message) => {
  const username = userstate['display-name'];
  const bits = userstate.bits;
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    const cheerMessage = `### ✨ \`${username}\` just cheered with __${bits}__ bits! Message: "${message}"`;

    discordChannel.send(cheerMessage)
      .catch(error => console.error('Error relaying cheer:', error));
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
}
