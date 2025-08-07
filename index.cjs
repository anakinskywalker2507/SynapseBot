require('dotenv').config();
const tmi = require('tmi.js');
const { Client, GatewayIntentBits } = require('discord.js');
const discord = require('./src/discord.cjs');
const twitch = require('./src/twitch.cjs');

const twitchClient = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNEL]
});

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

discord(discordClient, twitchClient);
twitch(discordClient, twitchClient);

discordClient.login(process.env.DISCORD_BOT_TOKEN);
