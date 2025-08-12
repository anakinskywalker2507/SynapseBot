module.exports = async (discordClient, _twitchClient, channel, username, _userstate) => {
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    let subMessage = `### 🎉 A new subscriber! \`${username}\` just subscribed to \`${channel}\`!`;

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
