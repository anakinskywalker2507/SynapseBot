const Discord = require("discord.js")

module.exports = async (discordClient, _twitchClient, interaction) => {

  if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
    let entry = interaction.options.getFocused()

    if (interaction.commandName === "help") {
      const choices = discordClient.commands.filter(cmd => cmd.name.includes(entry));
      const limitedChoices = entry === "" ? discordClient.commands.map(cmd => ({ name: cmd.name, value: cmd.name })).slice(0, 25) : choices.map(choice => ({ name: choice.name, value: choice.name })).slice(0, 25);
      await interaction.respond(limitedChoices.slice(0, 25));
    }
  }

  if (interaction.type === Discord.InteractionType.ApplicationCommand) {
    let command = require(`../../cmds/${interaction.commandName}.mjs`).command;
    try {
      command.run(discordClient, interaction, interaction.options);
    } catch {
      interaction.reply(`Error: ${command.name}`);
    }
  }
}
