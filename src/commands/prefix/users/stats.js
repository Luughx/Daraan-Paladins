const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const userdb = require("../../../models/userId")
const { statsFunction } = require("../../../functions/prefix/stats")
const { championReplaces } = require("../../../functions/index")

const run = async (client, message, args, api) => {
    let player, champion
    const numReg = /^[0-9]*$/;
    const nameReg = /^[0-9a-zA-Z]+$/

    if (args.length >= 2) { 
        if (numReg.test(args[0])) {
            player = args[0]
        } else if (message.mentions.users.first()) {
            const mention = message.mentions.users.first().id
            const findPlayer = await userdb.findOne({userid: mention}) 
            if (!findPlayer) return await message.channel.send("Ese usuario aun no vincula su nickname")
            player = findPlayer.paladinsId 
        } else if (args[0].toLowerCase() == "me") {
            const findPlayer = await userdb.findOne({userid: message.author.id}) 
            if (!findPlayer) return await message.channel.send("Aún no vinculas tu usuario")
            player = findPlayer.paladinsId
        } else {
            const name = encodeURIComponent(args[0])
            
            if (!nameReg.test(name)) return message.channel.send("That nickname contains special characters, instead you can write your id")
            const players = await api.searchPlayers(name)

            

            if (players.length == 0) return message.channel.send("Player not found")
            player = players[0].player_id
        } 
        console.log(player)
        const champ = championReplaces()
        console.log(champ[args[1].toLowerCase()])
        if (champ[args[1].toLowerCase()]) champion = champ[args[1].toLowerCase()]
        else return message.channel.send("Champion not found")

    } else if (args.length == 1) {
        const champ = championReplaces()
        if (message.mentions.users.first()) {
            const findPlayer = await userdb.findOne({userid: message.mentions.users.first().id}) 
            if (!findPlayer) return await message.channel.send("El usuario aún no vincula su cuenta")
            player = findPlayer.paladinsId

        } else if (numReg.test(args[0])) {
            player = args[0]
        } else if (args[0].toLowerCase() == "me") {
            const findPlayer = await userdb.findOne({userid: message.author.id}) 
            if (!findPlayer) return await message.channel.send("Aún no vinculas tu usuario")
            player = findPlayer.paladinsId
        } else if (!champ[args[0].toLowerCase()]) {
            const name = encodeURIComponent(args[0])
            if (!nameReg.test(name)) return message.channel.send("That nickname contains special characters, instead you can write your id")
            const players = await api.searchPlayers(name)
            if (players.length == 0) return message.channel.send("player not found")
            player = players[0].player_id
        } else {
            const findPlayer = await userdb.findOne({userid: message.author.id}) 
            if (!findPlayer) return await message.channel.send("Aún no vinculas tu usuario")
            player = findPlayer.paladinsId
    
            if (champ[args[0].toLowerCase()]) champion = champ[args[0].toLowerCase()]
            else return message.channel.send("Champion not found")
        }

    } else {
        const findPlayer = await userdb.findOne({userid: message.author.id}) 
        if (!findPlayer) return await message.channel.send("Aún no vinculas tu usuario")
        player = findPlayer.paladinsId
    }

    statsFunction(client, message, api, player, champion)

}

module.exports = {
    name: "stats",
    run
}