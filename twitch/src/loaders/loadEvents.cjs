const fs = require("fs")

module.exports = async (twitchClient) => {

  console.log("[⏳]\x1b[33mTwitch Events Loading...\x1b[0m");
  fs.readdirSync("./src/events/").filter(f => f.endsWith(".cjs")).forEach(async file => {

    let event = require(`../events/${file}`);
    twitchClient.on(file.split(".cjs").join(""), (...args) => event(twitchClient, ...args))
    console.log(`   [✅]\x1b[32m${file.slice(0, file.length - 4)}\x1b[0m`);
  })
}
