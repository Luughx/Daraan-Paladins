const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { statsFunction } = require("../../../functions/interaction/stats")
const userdb = require("../../../models/userId")


const run = async (client, int, api) => {

    await int.deferReply()
    const nameOption = int.options.get("name")
    const idOption = int.options.get("id")
    const mentionOption = int.options.get("mention")

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
    } else if (mentionOption) {
        const mention = mentionOption.value
        const findPlayer = await userdb.findOne({userid: mention}) 
        if (!findPlayer) return await int.editReply("Ese usuario aun no vincula su nickname")
        player = findPlayer.paladinsId
    } else  {
        const findPlayer = await userdb.findOne({userid: int.user.id}) 
        if (!findPlayer) return await int.editReply("Aún no vinculas tu usuario")
        player = findPlayer.paladinsId
    }

    await statsFunction(client, int, api, player)
}

const builder = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("mira los stats")
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
    .addUserOption(option => 
        option
        .setName("mention")
        .setDescription("menciona al usuario")
    )
    .addStringOption(option => 
        option
        .setName("champion")
        .setDescription("Stats of a champion")
    )

module.exports = {
    name: "stats",
    builder,
    run
}