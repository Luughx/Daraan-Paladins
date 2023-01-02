const { EmbedBuilder } = require("discord.js") 
const { kdaFunction, winrateFunction, championReplaces } = require("../index")

const statsFunction = async (client, message, api, player, champion) => {

    const stats = await api.getPlayer(player)
    if (!stats) return await message.channel.send("Invalid id")
    if (stats.Id == 0 && !stats.hz_gamer_tag && !stats.hz_player_name) return message.channel.send("Private account")
    
    const statsChampions = await api.getPlayerChampionRanks(player)

    if (champion) {
        if (statsChampions.length == 0) return message.channel.send("Not data")
        return statsChampion(client, message, api, player, statsChampions, stats, champion)
        
    } else {
        return statsPlayer(client, message, api, player, statsChampions, stats)
    } 
}

const statsChampion = async (client, message, api, player, statsChampions, statsPlayer, champion) => {

    let stats 
    
    for (let i=0; i < statsChampions.length; i++) {
        if (statsChampions[i].champion.toLowerCase() == champion.toLowerCase()) {
            stats = statsChampions[i]
        }
    }
    
    if (!stats) return message.channel.send("Champion not found")

    let title
    statsPlayer.Title ? title = `(${statsPlayer.Title})` : title = ""

    let playerName
    statsPlayer.hz_player_name ? playerName = statsPlayer.hz_player_name : playerName = statsPlayer.hz_gamer_tag

    const embed = new EmbedBuilder()
    .setTitle(`${playerName} ${title}`)
    .setDescription(`Champion: ${stats.champion}\nLevel: ${stats.Rank}\nkda: ${kdaFunction(stats.Kills, stats.Assists, stats.Deaths)} (${stats.Kills} / ${stats.Deaths} / ${stats.Assists})\nTime: ${(stats.Minutes / 60).toFixed(2)}h`)
    .addFields([
        {
            name: "wins",
            value: `${stats.Wins}`,
            inline: true
        },
        {
            name: "Losses",
            value: `${stats.Losses}`,
            inline: true
        },
        {
            name: "Winrate",
            value: `${winrateFunction(stats.Wins, stats.Losses)}%`,
            inline: true
        },
        {
            name: "Extra",
            value: `Gold: ${stats.Gold}\nLast played: ${stats.LastPlayed}`,
            inline: false
        }
    ])
    .setThumbnail(statsPlayer.AvatarURL)
    .setColor("Random")
    .setFooter({
        iconURL: message.author.displayAvatarURL(),
        text: `by ${message.author.tag}`
    })

    message.channel.send({embeds: [embed]})
}

const statsPlayer = async (client, message, api, player, statsChampions, stats) => {
    
    let kills = 0
    let assists = 0
    let deaths = 0

    for (let i=0; i < statsChampions.length; i++) {
        kills += statsChampions[i].Kills
        assists += statsChampions[i].Assists
        deaths += statsChampions[i].Deaths
    }

    let title
    stats.Title ? title = `(${stats.Title})` : title = ""

    let playerName
    stats.hz_player_name ? playerName = stats.hz_player_name : playerName = stats.hz_gamer_tag

    const ranks = {
        0: "Unranked",
        1: "Bronze V",
        2: "Bronze IV",
        3: "Bronze III",
        4: "Bronze II",
        5: "Bronze I",
        6: "Silver V",
        7: "Silver IV",
        8: "Silver III",
        9: "Silver II",
        10: "Silver I",
        11: "Gold V",
        12: "Gold IV",
        13: "Gold III",
        14: "Gold II",
        15: "Gold I",
        16: "Platinum V",
        17: "Platinum IV",
        18: "Platinum III",
        19: "Platinum II",
        20: "Platinum I",
        21: "Diamond V",
        22: "Diamond IV",
        23: "Diamond III",
        24: "Diamond II",
        25: "Diamond I",
        26: "Master",
        27: "Grand Master"
    }

    const embed = new EmbedBuilder()
    embed.setTitle(`${playerName} ${title}`)
    embed.setDescription(`id: ${player}\n${stats.Level} lvl\n${kdaFunction(kills, assists, deaths)} kda (${kills} / ${deaths} / ${assists})\nLeaves: ${stats.Leaves}`)
    embed.setThumbnail(stats.AvatarURL)
    embed.setColor("Random")
    embed.addFields([
        {
            name: "Wins",
            value: stats.Wins.toString(),
            inline: true
        },
        {
            name: "Losses",
            value: stats.Losses.toString(),
            inline: true
        },
        {
            name: "Winrate",
            value: `${winrateFunction(stats.Wins, stats.Losses)}%`,
            inline: true
        }
    ])

    if (stats.RankedKBM.Tier != 0 && stats.RankedKBM.Wins != 0 && stats.RankedKBM.Losses != 0) {    
        const winrateRanked = ((stats.RankedKBM.Wins*100)/(stats.RankedKBM.Wins + stats.RankedKBM.Losses)).toFixed(1)
        embed.addFields([
            {
                name: "Ranked PC",
                value: `Rank: ${ranks[stats.RankedKBM.Tier]}\nPoints: ${stats.RankedKBM.Points}\nLeaves: ${stats.RankedKBM.Leaves}`
            }
        ])
        embed.addFields([
            {
                name: "Wins",
                value: `${stats.RankedKBM.Wins}`,
                inline: true
            },
            {
                name: "Losses",
                value: `${stats.RankedKBM.Losses}`,
                inline: true
            },
            {
                name: "Winrate",
                value: `${winrateRanked}%`,
                inline: true
            },
        ])
    } 
    if (stats.RankedController.Tier != 0 && stats.RankedController.Wins != 0 && stats.RankedController.Losses != 0) {
        const winrateRanked = ((stats.RankedController.Wins*100)/(stats.RankedController.Wins + stats.RankedController.Losses)).toFixed(1)
        embed.addFields([
            {
                name: "Ranked Controller",
                value: `Rank: ${ranks[stats.RankedController.Tier]}\nPoints: ${stats.RankedController.Points}\nLeaves: ${stats.RankedController.Leaves}`
            }
        ])
        embed.addFields([
            {
                name: "Wins",
                value: `${stats.RankedController.Wins}`,
                inline: true
            },
            {
                name: "Losses",
                value: `${stats.RankedController.Losses}`,
                inline: true
            },
            {
                name: "Winrate",
                value: `${winrateRanked}%`,
                inline: true
            },
        ])
    }

    embed.addFields([
        {
            name: "Extra",
            value: `Time played: ${(stats.MinutesPlayed/60).toFixed(1)} h\nLast Login: ${stats.Last_Login_Datetime}\nRegion: ${stats.Region}\nPlatform: ${stats.Platform}`
        }
    ])
    embed.setFooter({
        iconURL: message.author.displayAvatarURL(),
        text: `by ${message.author.tag}`
    })
    embed.setTimestamp(Date.now())

    message.channel.send({embeds: [embed]})
}



module.exports = { statsFunction, championReplaces}