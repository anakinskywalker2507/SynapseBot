const fs = require("fs")

module.exports = async (discordClient, twitchClient) => {

  console.log("[⏳]\x1b[33mDiscord Commands Loading...\x1b[0m");
  fs.readdirSync("./src/cmds/discord").filter(f => f.endsWith(".mjs")).forEach(async file => {

    let command = require(`../cmds/discord/${file}`).command;
    if (!command.name || typeof command.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 4)} doesn't have a name !`)
    discordClient.commands.set(command.name, command)
    console.log(`   [✅]\x1b[32m${file.slice(0, file.length - 4)}\x1b[0m`);
  });

  console.log("[⏳]\x1b[33mTwitch Commands Loading...\x1b[0m");
  fs.readdirSync("./src/cmds/twitch").filter(f => f.endsWith(".mjs")).forEach(async file => {

    let command = require(`../cmds/twitch/${file}`).command;
    if (!command.name || typeof command.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 4)} doesn't have a name !`);
    twitchClient.commands.set(command.name, command);
    console.log(`   [✅]\x1b[32m${file.slice(0, file.length - 4)}\x1b[0m`);
  })
}
