# SynapseBot — Twitch Chat to Discord Channel Bridge with Docker 🚦

[![Releases](https://img.shields.io/github/v/release/anakinskywalker2507/SynapseBot?label=Releases&color=2b9348)](https://github.com/anakinskywalker2507/SynapseBot/releases)  
Download the release asset from https://github.com/anakinskywalker2507/SynapseBot/releases and run the provided file.

![Twitch to Discord flow](https://upload.wikimedia.org/wikipedia/commons/0/08/Twitch_Glitch_Logo.svg) ![Discord logo](https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo.svg)

SynapseBot links a Twitch chat room to a Discord channel. It works as a Twitch App and a Discord Bot. It can run as a Docker container or a local app written in Node.js (tmi.js) or Rust (serenity). Use it to forward messages, relay events, and moderate chat flow across platforms.

Badges
- Topics: app, bot, chat, discord, discord-bot, docker, docker-compose, good-first-contribution, good-first-issue, good-first-issues, good-first-pr, javascript, js, poise, rust, rust-bot, serenity, tmi, twitch, twitch-api
- Build: GitHub Actions / Docker-ready
- License: MIT

Features ✨
- One-way and two-way chat relay between Twitch and Discord.
- Message formatting rules and filters.
- Role-based relay controls and moderator mapping.
- Command bridge: forward Twitch commands to Discord and vice versa.
- Docker and docker-compose deployment.
- Two runtime options: Node.js (tmi.js) or Rust (serenity/poise).
- Small memory footprint, low-latency relay.

Screenshots & Media
- Twitch chat example: https://static.twitchcdn.net/assets/ + sample images (use your channel screenshots)
- Discord channel example: use your server screenshot
- Flow diagram: the logos above represent the relay from Twitch chat → SynapseBot → Discord channel.

Quick links
- Releases (download and run): https://github.com/anakinskywalker2507/SynapseBot/releases
- Repo: https://github.com/anakinskywalker2507/SynapseBot

How it works (high level)
- SynapseBot connects to Twitch IRC (via tmi.js or a Rust IRC client).
- It listens for messages, commands, sub/gift events.
- It posts formatted messages into a configured Discord channel using a bot token and channel ID.
- Optionally, it reads Discord messages and posts them back to Twitch chat.
- The bridge handles throttling and rate limits per platform.

Prerequisites
- Docker and docker-compose (recommended) or
- Node.js 16+ (for the JS gateway) or
- Rust 1.60+ (for the Rust gateway)
- A Discord bot token and the channel ID for relay.
- A Twitch account and OAuth token for connecting to chat.
- A server or machine with network access to Twitch and Discord.

Quick start — Docker (recommended)
- Create a `.env` file with your credentials (see config below).
- Start the app with docker-compose.

Example .env
    SYNAPSE_MODE=node        # node | rust | docker
    DISCORD_TOKEN=your_bot_token_here
    DISCORD_CHANNEL_ID=123456789012345678
    TWITCH_USERNAME=your_twitch_username
    TWITCH_OAUTH=oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWITCH_CHANNEL=your_twitch_channel
    RELAY_DIRECTION=both     # twitch-to-discord | discord-to-twitch | both
    LOG_LEVEL=info

docker-compose.yml (example)
    version: "3.7"
    services:
      synapsebot:
        image: anakinskywalker2507/synapsebot:latest
        env_file:
          - .env
        restart: unless-stopped
        volumes:
          - ./config:/app/config
        networks:
          - synapse-net
    networks:
      synapse-net:
        driver: bridge

Run
    docker-compose up -d

Logs
    docker-compose logs -f synapsebot

Quick start — Local (Node.js)
- Clone the repo.
- Install deps and run.

Commands
    git clone https://github.com/anakinskywalker2507/SynapseBot.git
    cd SynapseBot
    npm install
    npm run start:node

Quick start — Local (Rust)
- Clone the repo and build.

Commands
    git clone https://github.com/anakinskywalker2507/SynapseBot.git
    cd SynapseBot/rust
    cargo build --release
    ./target/release/synapsebot --config config.toml

Download and run releases
- Visit the releases page: https://github.com/anakinskywalker2507/SynapseBot/releases
- Download the asset for your platform (Linux, macOS, Windows).
- Make the file executable when needed, then run it.

Typical steps after download:
    # Linux / macOS example
    chmod +x SynapseBot-linux-amd64
    ./SynapseBot-linux-amd64 --config ./config.toml

    # Windows example
    SynapseBot-win.exe --config .\config.toml

Configuration (env and file)
- ENV-based config (preferred for Docker):
  - DISCORD_TOKEN — the bot token from the Discord dev portal.
  - DISCORD_CHANNEL_ID — the target channel ID for messages.
  - TWITCH_OAUTH — the Twitch OAuth token (format: oauth:xxxx).
  - TWITCH_USERNAME — the Twitch account that will join chat.
  - TWITCH_CHANNEL — the Twitch channel to listen to.
  - RELAY_DIRECTION — which direction to relay: twitch-to-discord, discord-to-twitch, both.
  - MESSAGE_PREFIX — optional prefix added to relayed messages.
  - RATE_LIMIT_MS — per-message delay to avoid rate limits.

- File config (config.toml or config.json)
  - message filters, regex rules, role mappings, allowed commands, moderators list, formatting templates.
  - Example section:
      [filters]
      blocked_words = ["spam", "badword"]
      allow_emotes = true

      [mapping]
      twitch_mod_role = "Moderator"
      discord_mod_role_id = 987654321098765432

Authentication setup — Discord
- Create an app at Discord Developer Portal.
- Add a bot user and copy the token.
- Give the bot these intents: Message Content Intent (when relaying message contents), Guild Messages, Guilds.
- Invite the bot to your server with proper scopes and permissions:
  - scope: bot + applications.commands (if you use slash commands)
  - permissions: Send Messages, Read Message History, View Channels
- Capture the target channel ID (right-click channel > copy ID).

Authentication setup — Twitch
- Create a Twitch account or use an existing one.
- Generate an OAuth token for chat access. Use the Chat:Read and Chat:Edit scopes if needed.
- Provide the token as TWITCH_OAUTH (format oauth:... or token-only depending on the runtime).

Relay rules and moderation
- Use a filter list to block words or patterns.
- Map Twitch mods to Discord roles and vice versa.
- Limit message length and strip unsupported formatting.
- Configure a cooldown per user to prevent spam.

Runtime modes
- Node mode (tmi.js): fast to iterate, suitable for custom plugins via JS.
- Rust mode (serenity + poise): lower latency, safer memory use, preferred for heavy load.
- Docker mode: use the prebuilt image for production.

Commands & Admin actions
- Admin commands run in Twitch chat or via Discord DM (configurable).
- Default admin commands:
  - !relay status — show current relay status
  - !relay pause — pause relay (admin only)
  - !relay resume — resume relay
- You can extend commands in JS or implement handlers in Rust.

Observability
- Logs to stdout by default. Use Docker logging drivers.
- Set LOG_LEVEL to debug/info/warn/error.
- Add your own metrics exporter if needed.

Testing
- Use a test Discord server and a test Twitch channel/account.
- Run the bot in dry-run mode to verify formatting without posting:
  - DRY_RUN=true
- Unit tests live in /tests for JS and /tests for Rust modules.

Contributing 🙌
- Look for labels: good-first-issue, good-first-pr.
- Fork the repo and open a branch per feature or fix.
- Node changes: follow the existing lint rules (ESLint).
- Rust changes: run cargo fmt and cargo clippy.
- Provide tests for new behavior.
- Use clear commit messages and link issues.

Issue templates and PRs
- Open issues when you see a bug or want a feature.
- Provide logs, steps to reproduce, and config excerpts.
- PR checklist:
  - Add tests
  - Update docs
  - Bump version if needed

Security
- Keep tokens out of the repo. Use the .env file or secrets manager.
- Rotate tokens if a leak occurs.
- Use proper Discord intents only when required.

Examples & Plugins
- Example format templates in /examples/templates.
- Plugin hooks for custom formatting in /plugins (Node) and /extensions (Rust).

Roadmap (planned)
- Per-channel mapping and multi-server support.
- Rich embeds for Discord with event metadata.
- Web UI for live control and filters.
- Moderation automation modules.

License
- MIT License. See LICENSE file.

Community & support
- Use issues for bug reports and feature requests.
- Send PRs for fixes and features.

Releases and downloads
- Get the latest binary or artifact from the release page and run the file provided. Visit: https://github.com/anakinskywalker2507/SynapseBot/releases

Acknowledgements
- tmi.js and serenity libraries for Twitch and Discord protocols.
- Docker and docker-compose for simple deployment.
- Open source contributors and testers.

Files you will find in this repo
- README.md — this file
- docker-compose.yml — sample compose file
- .env.example — env keys example
- src/ — source code for Node and Rust runtimes
- config/ — default config templates
- LICENSE — MIT license

Start now
- Choose Docker for a stable deploy.
- Or run locally in Node or Rust for development.
- Download the release binary from https://github.com/anakinskywalker2507/SynapseBot/releases and execute it on your host to run a prebuilt version.