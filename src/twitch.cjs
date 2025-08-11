module.exports = async (discordClient, twitchClient) => {
  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return;
    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      discordChannel.send(`\`${tags['display-name']}\` **(\`${channel}\`):** ${message}`);
    } else {
      console.error(`Error: Channel ${discordChannel} not found.`);
    }
  });

  twitchClient.on('subscription', (channel, username, _method, _message, tags) => {
    const months = tags['msg-param-cumulative-months'];
    const streak = tags['msg-param-streak-months'];

    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      let subMessage = `### 🎉 A new subscriber! \`${username}\` just subscribed to \`${channel}\`!`;
      if (months) {
        subMessage = `### ✨ Re-sub from \`${username}\`!`;
        if (streak) {
          subMessage += ` (Streak: ${streak} months)`;
        }
      }

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
  })

  twitchClient.on('resub', (_channel, username, _months, _message, userstate) => {
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
  })

  twitchClient.on('subgift', (_channel, username, _streakMonths, recipient, _tags) => {
    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      const giftMessage = `### 🎁 \`${username}\` just gifted a sub to \`${recipient}\`!`;

      discordChannel.send(giftMessage)
        .catch(error => console.error('Error relaying gift sub:', error));
    } else {
      console.error(`Error: Channel ${discordChannel} not found.`);
    }
  });

  twitchClient.on('cheer', (_channel, userstate, message) => {
    const username = userstate['display-name'];
    const bits = userstate.bits;
    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      const cheerMessage = `### ✨ \`${username}\` just cheered with __${bits}__ bits! Message: "${message}"`;

      discordChannel.send(cheerMessage)
        .catch(error => console.error('Error relaying cheer:', error));
    } else {
      console.error(`Error: Channel ${discordChannel} not found.`);
    }
  });


  twitchClient.on('raided', (_channel, username, viewers) => {
    const discordChannel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    if (discordChannel) {
      const raidMessage = `### 🚀 \`${username}\` started a raid with \_\_${viewers}\_\_ viewers !`;

      discordChannel.send(raidMessage)
        .catch(error => console.error('Error relaying raid:', error));
    } else {
      console.error(`Error: Channel ${discordChannel} not found.`);
    }
  });
}
