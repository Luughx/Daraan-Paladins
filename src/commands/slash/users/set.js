const { SlashCommandBuilder } = require("discord.js")
const userdb = require("../../../models/userId")

const run = async (client, int, api) => {
    
    await int.deferReply()
    const idOption = int.options.get("id")
    const nameOption = int.options.get("name")
    
    let player

    if (idOption) {
        player = idOption.value
    } else if (nameOption) {
        const name = encodeURIComponent(nameOption.value) 
        const reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(name)) return await int.editReply("El nombre contiene carácteres especiales, en cambio puedes ingresar tu id")
        const players = await api.searchPlayers(name)
        if (players.length == 0) return await int.editReply("Jugador no encontrado")
        player = players[0].player_id
    } else {
        return await int.editReply("Tienes que ingresar tu nickname o tu id")
    }
    
    const stats = await api.getPlayer(player)
    if (!stats) return await int.editReply("Invalid id")
    
    const findPlayer = await userdb.findOne({userid: int.user.id}) 
    if (!findPlayer) {
        const user = new userdb()
        user.userid = int.user.id
        user.paladinsId = player
        user.save()
    } else {
        await userdb.findOneAndUpdate({paladinsId: player})
    }

    await int.editReply("Usuario actualizado")
}

const builder = new SlashCommandBuilder()
    .setName("set")
    .setDescription("link your paladins account")
    .addStringOption(option => 
        option
        .setName("name")
        .setDescription("nombre de usuario")
    )
    .addNumberOption(option =>
        option
        .setName("id")
        .setDescription("id del usuario")
    )

module.exports = {
    name: "set",
    builder,
    run
}