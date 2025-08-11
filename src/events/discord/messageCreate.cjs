module.exports = async (discordClient, twitchClient, message) => {
  if (message.content.startsWith(discordClient.prefix)) {
    let messageArray = message.content.split(" ");
    let commandName = messageArray[0].slice(discordClient.prefix.length);
    let args = messageArray.slice(1);

    let command;
    try {
      command = require(`../../msgcmds/${commandName}.mjs`).command;
      command.run(discordClient, message, args);
    } catch {
      message.reply(`Error: \"${commandName}\" No such command.`);
    }
  } else if (message.channel.id === process.env.DISCORD_CHANNEL_ID && !message.author.bot) {
    const twitchMessage = `${message.author.tag} (Discord): ${message.content}`;

    twitchClient.say(process.env.TWITCH_CHANNEL, twitchMessage)
      .then(() => {
        console.log(`Relayed message from Discord to Twitch: "${twitchMessage}"`);
      })
      .catch(error => {
        console.error('Error relaying message to Twitch:', error);
      });
  }
}
