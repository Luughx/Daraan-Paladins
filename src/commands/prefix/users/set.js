const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const userdb = require("../../../models/userId")

const run = async (client, message, args, api) => {
    
    let player
    const numReg = /^[0-9]*$/;
    const nameReg = /^[0-9a-zA-Z]+$/

    if (args.length == 0) return await message.channel.send("You need to write the id or the nickname")

    if (numReg.test(args[0])) {
        player = args[0]
    } else if (nameReg.test(args[0])) {
        const name = args[0]
        const players = await api.searchPlayers(name)
        if (players.length == 0) return await int.editReply("Jugador no encontrado")
        player = players[0].player_id
    } else {
        return await message.channel.send("That nickname contains special characters, instead you can write your id")
    }
    
    const stats = await api.getPlayer(player)
    if (!stats) return await message.channel.send("Invalid id")
    
    const findPlayer = await userdb.findOne({userid: message.author.id}) 
    if (!findPlayer) {
        const user = new userdb()
        user.userid = message.author.id
        user.paladinsId = player
        user.save()
    } else {
        await userdb.findOneAndUpdate({paladinsId: player})
    }

    await message.channel.send("Usuario actualizado")

}

module.exports = {
    name: "set",
    run
}