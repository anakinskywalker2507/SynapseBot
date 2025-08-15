require('dotenv').config();
const tmi = require('tmi.js');
const loadCommands = require("./src/loaders/loadCommands.cjs");
const loadEvents = require("./src/loaders/loadEvents.cjs");
const config = require("./config.json");
const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

let redisClient = null;

console.log('[⏳]Connecting to Redis...');
redisClient = new Redis(redisUrl);

redisClient.on('connect', () => {
  console.log('[✅]Successfully connected to Redis.');
});

redisClient.on('error', (err) => {
  console.error('[❌]Redis connection error:', err);
});

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

loadEvents(client);
loadCommands(client);

client.on('connected', (address, port) => {
  console.log(`[Twitch Bot] Connected to ${address}:${port}`);
});

client.connect();
