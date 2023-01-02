const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const userdb = require("../../../models/userId")
const { historyFunction } = require("../../../functions/interaction/history")

const run = async (client, int, api) => {
    await int.deferReply()
    
    const findPlayer = await userdb.findOne({userid: int.targetId}) 
    if (!findPlayer) return await int.editReply("El usuario aun no vincula su cuenta")

    const player = findPlayer.paladinsId
    
    await historyFunction(client, int, api, player)

}

const builder = new ContextMenuCommandBuilder()
    .setName("history")
    .setType(ApplicationCommandType.User)

module.exports = {
    name: "history",
    builder,
    run
} 