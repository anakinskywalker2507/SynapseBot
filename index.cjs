require('dotenv').config();
const tmi = require('tmi.js');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const loadCommands = require("./src/loaders/loadCommands.cjs");
const loadEvents = require("./src/loaders/loadEvents.cjs");

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

discordClient.commands = new Collection();
discordClient.color = 0x1ec1e6;
discordClient.prefix = "€"
discordClient.login(process.env.DISCORD_BOT_TOKEN);

loadEvents(discordClient, twitchClient);
loadCommands(discordClient);
