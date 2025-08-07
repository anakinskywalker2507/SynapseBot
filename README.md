# Synapse Bot

<p align="center">
  <img src="./readme/example1.png" alt="Example 1"> <img src="./readme/example2.png" alt="Example 2">
</p>

## Table of Content

- [About](#about)
- [Installation](#installation)
  - [Dependencies](#dependencies)
  - [Initialization](#initialization)
- [Usage](#usage)
  - [Twitch](#twitch)
  - [Bot](#bot)
- [License](#license)

## About

> [!NOTE]
> A Twitch App & Discord Bot that links Twich Chat with a Discord Channel

## Installation

### Dependencies

> [!IMPORTANT]
> Make sure to have [Node.js](https://nodejs.org) & [npm](https://www.npmjs.com/) installed.

### Initialization

> [!NOTE]
> Clone the repo somewhere, make a `.env` file at the root of the repository that contains the followig variables.

> [!TIP]
> Exemple of a `.env` file :

```env
TWITCH_BOT_USERNAME="your-twitch-bot-username"
TWITCH_OAUTH_TOKEN="oauth:your-twitch-oauth-token"
TWITCH_CHANNEL="streamers-channel-name"
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_CHANNEL_ID="your-discord-channel-id"
```

> [!NOTE]
> Install dependencies with npm.

```bash
npm install
```

## Usage

### Twitch

> [!IMPORTANT]
> Mod the app on your Twitch Chat.

```
/mod your-twitch-bot-username
```

### Bot

> [!NOTE]
> Start both the Twitch App & Discord Bot with npm.

```bash
npm run start
```

## Licence

[MIT](https://github.com/YetAnotherMechanicusEnjoyer/SynapseBot/blob/471d506d441951272afa4067d1dc75349af5f129/LICENSE)
