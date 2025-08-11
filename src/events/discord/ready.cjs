const loadSlashCommands = require("../../loaders/loadSlashCommands.cjs");

module.exports = async (discordClient, twitchClient) => {
  await loadSlashCommands(discordClient);

  console.log(`\n\x1b[4;36m${discordClient.user.tag} is online.\x1b[0m`);

  console.log(`Connected to Twitch channel: ${process.env.TWITCH_CHANNEL}`);

  twitchClient.connect();

  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    discordChannel.send(`### Connected to ${process.env.TWITCH_CHANNEL}'s chat !`);
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
};
