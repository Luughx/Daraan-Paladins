const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const userdb = require("../../../models/userId")
const { detailedFunction } = require("../../../functions/interaction/detailed")

const run = async (client, int, api) => {
    await int.deferReply()
    
    const findPlayer = await userdb.findOne({userid: int.targetId}) 
    if (!findPlayer) return await int.editReply("El usuario aun no vincula su cuenta")

    const player = findPlayer.paladinsId

    await detailedFunction(client, int, api, player)

}

const builder = new ContextMenuCommandBuilder()
    .setName("detailed")
    .setType(ApplicationCommandType.User)

module.exports = {
    name: "detailed",
    builder,
    run
} 