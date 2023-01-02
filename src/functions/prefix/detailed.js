const { EmbedBuilder } = require("discord.js")
const { kdaFunction } = require("../index")

const detailedFunction = async (message, api, player, matchId) => {

    if (!matchId) {
        const history = await api.getPlayerMatchHistory(player)
        if (!history[0].Match_Time) return await message.channel.send("El usuario no tiene partidas recientes")
        matchId = history[0].Match
    }

    const matchData = await api.getMatchDetails(matchId)
    if (matchData.length == 0) return await message.channel.send("Match not found")

    let match

    for (let i=0; i < matchData.length; i++) {
        if (matchData[i].playerId == player) {
            match = matchData[i]
        }
    }

    if (!match) return await message.channel.send("This user did not play in that match")

    const kills = match.Kills_Player
    const assists = match.Assists
    const deaths = match.Deaths
    const timeDec = (match.Time_In_Match_Seconds/60).toFixed(2).toString()

    let time = timeDec.split(".")
    if (time[0].length == 1) {
        time[0] = "0" + time[0]
    }
    
    const embed = new EmbedBuilder()
    embed.setTitle(`Last match ${match.playerName}`) 
    embed.setColor("Random")
    embed.setDescription(`Queue: ${match.name} (${time.join(":")})\nChampion: ${match.Reference_Name}\nKDA: ${kdaFunction(kills, assists, deaths )} (${kills}/${deaths}/${assists})`)
    embed.addFields([
        {
            name: "Damage",
            value: `Damage: ${match.Damage_Player}\nTaken: ${match.Damage_Taken}\nMitigated: ${match.Damage_Mitigated}\nOther: ${match.Damage_Player - match.Damage_Done_In_Hand}`,
            inline: true
        },
        {
            name: "Healing",
            value: `Healing: ${match.Healing}\nSelf Healing: ${match.Healing_Player_Self}`,
            inline: true
        },
        {
            name: "Match",
            value: `Id: ${match.Match}\nStatus: ${match.Win_Status}\nMap: ${match.Map_Game}`,
            inline: true
        }
    ])
    if (match.name == "Ranked") {
        embed.addFields([
            {
                name: "Bans",
                value: `Team 1: ${match.Ban_1}, ${match.Ban_2}, ${match.Ban_3}\nTeam 2: ${match.Ban_4}, ${match.Ban_5}, ${match.Ban_6}`,
                inline: true
            }
            
        ])
    }

    embed.addFields([
        {
            name: "Extra",
            value: `Gold: ${match.Gold_Earned}\nObjective Time: ${match.Objective_Assists}\nRegion: ${match.Region}\nItems: ${match.Item_Active_1}${match.Item_Active_2 ? ", ":""}${match.Item_Active_2}${match.Item_Active_3 ? ", ":""}${match.Item_Active_3}${match.Item_Active_4 ? ", ":""}${match.Item_Active_4}\nTalent: ${match.Item_Purch_6}`,
            inline: false
        }
        
    ])
    embed.setFooter({
        iconURL: message.author.displayAvatarURL(),
        text: `by ${message.author.tag}`
    })
    embed.setTimestamp(Date.now())

    await message.channel.send({ embeds: [embed] } ) 
}

module.exports = { detailedFunction } 