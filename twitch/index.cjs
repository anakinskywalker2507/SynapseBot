require('dotenv').config();
const tmi = require('tmi.js');
const loadCommands = require("./src/loaders/loadCommands.cjs");
const loadEvents = require("./src/loaders/loadEvents.cjs");
const config = require("./config.json");

const twitchClient = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNEL]
});

twitchClient.commands = new Collection();
twitchClient.prefix = config.twitchPrefix;

loadEvents(twitchClient);
loadCommands(twitchClient);
