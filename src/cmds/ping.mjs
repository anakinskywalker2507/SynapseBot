export const command = {
  name: "ping",
  description: "Displays latency",
  permission: "None",
  context: "None",
  category: "Utils",
  options: [],

  async run(_, interaction) {
    await interaction.reply(`Pong: \`${Date.now() - interaction.createdTimestamp}\`ms`);
  },

  async msg(_, message) {
    await message.reply(`Pong: \`${Date.now() - message.createdTimestamp}\`ms`);
  }
}
