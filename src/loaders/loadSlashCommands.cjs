const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

module.exports = async discordClient => {
  let commands = [];

  console.log("[⏳]\x1b[33mDiscord Slash Commands Loading...\x1b[0m")
  discordClient.commands.forEach(async command => {
    let slashcommand = new Discord.SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .setDefaultMemberPermissions(command.permission === "None" ? null : command.permission);
    if (command.context !== "None") slashcommand.setContexts(command.context);

    if (command.options?.length >= 1) {
      for (let i = 0; i < command.options.length; i++) {
        if (command.options[i].type === "string")
          slashcommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`](option => option.setName(command.options[i].name).setDescription(command.options[i].description).setAutocomplete(command.options[i].autocomplete).setRequired(command.options[i].required));
        else
          slashcommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`](option => option.setName(command.options[i].name).setDescription(command.options[i].description).setRequired(command.options[i].required))
      }
    }
    commands.push(slashcommand);
    console.log(`   [✅]\x1b[32m${command.name}\x1b[0m`);
  })
  const rest = new REST({ version: "10" }).setToken(discordClient.token);

  await rest.put(Routes.applicationCommands(discordClient.user.id), { body: commands });
}
