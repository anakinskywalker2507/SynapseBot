export const command = {
  name: "ping",
  description: "Displays latency",

  async run(twitchClient) {
    twitchClient.ping()
      .then((data) => {
        const twitchMessage = `Pong: \`${data}\`ms`;

        twitchClient.say(process.env.TWITCH_CHANNEL, twitchMessage)
          .then(() => {
            console.log(`Relayed message from Discord to Twitch: "${twitchMessage}"`);
          })
          .catch(error => {
            console.error('Error relaying message to Twitch:', error);
          })
        console.log(`Relayed message from Discord to Twitch: "${twitchMessage}"`);
      })
      .catch(error => {
        console.error('Error pinging to Twitch:', error);
      });
  }
}
