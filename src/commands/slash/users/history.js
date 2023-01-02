const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const userdb = require("../../../models/userId")
const { historyFunction } = require("../../../functions/interaction/history")

const run = async (client, int, api) => {

    await int.deferReply()
    const nameOption = int.options.get("nombre")
    const idOption = int.options.get("id")
    const mentionOption = int.options.get("mention")

    let player

    if (idOption) {
        player = idOption.value
        const stats = await api.getPlayer(player)
        if (!stats) return await int.editReply("ID inválida")
    } else if (nameOption) {
        const name = encodeURIComponent(nameOption.value)
        const reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(name)) return await int.editReply("El nombre contiene carácteres especiales, en cambio puedes ingresar tu id")
        const players = await api.searchPlayers(name)
        if (players.length == 0) return await int.editReply("Player not found")
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

    await historyFunction(client, int, api, player)

}

const builder = new SlashCommandBuilder()
    .setName("history")
    .setDescription("show the last 50 matchs")
    .addStringOption(option => 
        option
        .setName("nombre")
        .setDescription("nombre de usuario")
    )
    .addNumberOption(option =>
        option
        .setName("id")
        .setDescription("id del usuario")
    )
    .addUserOption(option => option.setName("mention").setDescription("menciona al usuario"))
    .addStringOption(option => 
        option
        .setName("type")
        .setDescription("the type of match")
        .addChoices(
            {
                name: "Siege",
                value: "Siege"
            },
            {
                name: "Ranked",
                value: "Ranked"
            },
            {
                name: "Choose Any",
                value: "Choose Any"
            },
            {
                name: "Onslaught",
                value: "Onslaught"
            }
        )
    )

module.exports = {
    name: "history",
    builder,
    run
}