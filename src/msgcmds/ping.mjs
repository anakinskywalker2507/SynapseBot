export const command = {
  name: "ping",
  description: "Displays latency",
  permission: "None",
  context: "None",
  category: "Utils",
  options: [],

  async run(_, message) {
    await message.reply(`Pong: \`${Date.now() - message.createdTimestamp}\`ms`);
  }
}
