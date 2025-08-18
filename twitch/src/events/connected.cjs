module.exports = async (twitchClient, address, port) => {
  console.log(`[Twitch Bot] Connected to ${address}:${port}`);
  twitchClient.color(twitchClient.configColor)
    .then((data) => {
      console.log(`Client color is set to ${data}`);
    }).catch((err) => {
      console.error(`Color Error: ${err}`);
    });
}

