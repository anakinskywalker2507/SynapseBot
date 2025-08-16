require('dotenv').config();
const tmi = require('tmi.js');

const loadCommands = require("./src/loaders/loadCommands.cjs");
const loadEvents = require("./src/loaders/loadEvents.cjs");
const config = require("./config.json");

const Redis = require('ioredis');
const redisEvents = require("./src/redis.cjs");
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

console.log('[⏳]Connecting to Redis...');

let redisClient = new Redis(redisUrl);

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNEL]
});

client.commands = [];
client.prefix = config.twitchPrefix;
client.channel = 'twitch_events';
client.redisClient = redisClient;

redisEvents(client, new Redis(redisUrl));
loadEvents(client);
loadCommands(client);

client.connect();

process.on("SIGINT", () => {
  redisClient.quit();
  console.log("Redis client disconnected.");
  client.disconnect();
  console.log("Twitch client disconnected.");
  process.exit();
});
