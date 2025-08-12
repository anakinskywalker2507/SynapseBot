module.exports = async (discordClient, twitchClient, channel, tags, message, self) => {
  if (self && message.startsWith("~")) return;
  const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (discordChannel) {
    discordChannel.send(`\`${tags['display-name']}\` **(\`${channel}\`):** ${message}`);
  } else {
    console.error(`Error: Channel ${discordChannel} not found.`);
  }
  if (message.startsWith(twitchClient.prefix)) {
    let messageArray = message.split(" ");
    let commandName = messageArray[0].slice(twitchClient.prefix.length);
    let args = messageArray.slice(1);

    let command;
    try {
      command = require(`../../cmds/twitch/${commandName}.mjs`).command;
      command.run(twitchClient, message, args);
    } catch {
      twitchClient.say(`Error: \"${commandName}\" No such command.`)
        .then(() => {
          console.log(`Relayed message from Discord to Twitch: "Error: \"${commandName}\" No such command."`);
        })
        .catch(error => {
          console.error('Error relaying message to Twitch:', error);
        })
    }
  }
}
