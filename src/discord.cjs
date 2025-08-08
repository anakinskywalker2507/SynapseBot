module.exports = async (discordClient, twitchClient) => {

  discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
    console.log(`Connected to Twitch channel: ${process.env.TWITCH_CHANNEL}`);

    twitchClient.connect();

    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      discordChannel.send(`### Connected to ${process.env.TWITCH_CHANNEL}'s chat !`);
    } else {
      console.error(`Error: Channel ${discordChannel} not found.`);
    }
  });

  discordClient.on('messageCreate', async message => {
    if (message.channel.id === process.env.DISCORD_CHANNEL_ID && !message.author.bot) {
      const twitchMessage = `${message.author.tag} (Discord): ${message.content}`;

      twitchClient.say(process.env.TWITCH_CHANNEL, twitchMessage)
        .then(() => {
          console.log(`Relayed message from Discord to Twitch: "${twitchMessage}"`);
        })
        .catch(error => {
          console.error('Error relaying message to Twitch:', error);
        });
    }
  });
}
