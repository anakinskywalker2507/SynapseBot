module.exports = async (discordClient, _channel, username, _streakMonths, recipient, _tags) => {
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    const giftMessage = `### 🎁 \`${username}\` just gifted a sub to \`${recipient}\`!`;

    discordChannel.send(giftMessage)
      .catch(error => console.error('Error relaying gift sub:', error));
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
}
