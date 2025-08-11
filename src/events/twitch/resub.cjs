module.exports = async (discordClient, username, userstate) => {
  let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    let subMessage = `### ✨ Re-sub from \`${username}\`! This is their ${cumulativeMonths} month in a row!`;

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
