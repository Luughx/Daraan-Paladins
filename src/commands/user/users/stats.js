const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const userdb = require("../../../models/userId")
const { statsFunction } = require("../../../functions/interaction/stats")

const run = async (client, int, api) => {
    await int.deferReply()
    
    const findPlayer = await userdb.findOne({userid: int.targetId}) 
    if (!findPlayer) return await int.editReply("El usuario aun no vincula su cuenta")

    const player = findPlayer.paladinsId

    const embed = await statsFunction(client, int, api, player)
    await int.editReply({embeds: [ embed ]}) 
}

const builder = new ContextMenuCommandBuilder()
    .setName("stats")
    .setType(ApplicationCommandType.User)

module.exports = {
    name: "stats",
    builder,
    run
} 