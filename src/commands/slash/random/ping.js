const { SlashCommandBuilder } = require("discord.js")

const run = async (client, int) => {
    await int.reply("pong!")
}

const builder = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong!")

module.exports = {
    name: "ping",
    builder,
    run
}