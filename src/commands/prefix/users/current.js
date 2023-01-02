const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const userdb = require("../../../models/userId")
const { currentFunction } = require("../../../functions/prefix/current")

const run = async (client, message, args, api) => {
    
    let player
    const numReg = /^[0-9]*$/;
    const nameReg = /^[0-9a-zA-Z]+$/

    if (numReg.test(args[0])) {
        player = args[0]
    } else if (args[0] && nameReg.test(args[0])) {
        const name = args[0]
        const players = await api.searchPlayers(name)
        if (players.length == 0) return await message.channel.send("Player not found")
        player = players[0].player_id
    } else if (message.mentions.users.first()) {
        const mention = message.mentions.users.first().id
        const findPlayer = await userdb.findOne({userid: mention}) 
        if (!findPlayer) return await message.channel.send("Ese usuario aun no vincula su nickname")
        player = findPlayer.paladinsId 
    } else {
        const findPlayer = await userdb.findOne({userid: message.author.id}) 
        if (!findPlayer) return await message.channel.send("Aún no vinculas tu usuario")
        player = findPlayer.paladinsId
    }

    currentFunction(message, api, player)

}

module.exports = {
    name: "current",
    run
}