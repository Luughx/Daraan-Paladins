const { SlashCommandBuilder } = require("discord.js")

const run = async (client, int) => {

    await int.reply(int.options.get("texto").value)
}

const builder = new SlashCommandBuilder()
    .setName("say")
    .setDescription("di algo")
    .addStringOption(option => option.setName("texto").setDescription("di algo").setRequired(true))

module.exports = {
    name: "say",
    builder,
    run
}