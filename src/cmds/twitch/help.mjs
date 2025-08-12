export const command = {
  name: "help",
  description: "Displays available commands.",

  async run(twitchClient) {
    let twitchMessage = "|";

    twitchClient.commands.forEach(cmd => {
      twitchMessage += ` ${twitchClient.prefix}${cmd.name} |`;
    });

    twitchClient.say(process.env.TWITCH_CHANNEL, twitchMessage)
      .then(() => {
        console.log(`Relayed message from Discord to Twitch: "${twitchMessage}"`);
      })
      .catch(error => {
        console.error('Error relaying message to Twitch:', error);
      })
  }
}
