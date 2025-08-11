const fs = require("fs")

module.exports = async (discordClient, twitchClient) => {

  console.log("[⏳]\x1b[33mDiscord Events Loading...\x1b[0m");
  fs.readdirSync("./src/events/discord/").filter(f => f.endsWith(".cjs")).forEach(async file => {

    let event = require(`../events/discord/${file}`);
    discordClient.on(file.split(".cjs").join(""), (...args) => event(discordClient, twitchClient, ...args))
    console.log(`   [✅]\x1b[32m${file.slice(0, file.length - 4)}\x1b[0m`);
  })

  console.log("[⏳]\x1b[33mTwitch Events Loading...\x1b[0m");
  fs.readdirSync("./src/events/twitch/").filter(f => f.endsWith(".cjs")).forEach(async file => {

    let event = require(`../events/twitch/${file}`);
    twitchClient.on(file.split(".cjs").join(""), (...args) => event(discordClient, ...args))
    console.log(`   [✅]\x1b[32m${file.slice(0, file.length - 4)}\x1b[0m`);
  })
}
