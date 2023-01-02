const { EmbedBuilder } = require("discord.js")

const currentFunction = async (message, api, player) => {

    const statusUser = await api.getPlayerStatus(player)

    const embed = new EmbedBuilder()
    if (statusUser.status == 0) {
        embed.setDescription("Player offline")
        embed.setColor("#A1A1A1")
        return await message.channel.send({embeds: [embed]})
    }  else if (statusUser.status == 1) {
        embed.setDescription("in lobby")
        embed.setColor("#78A6EB")
        return await message.channel.send({embeds: [embed]})
    } else if (statusUser.status == 2) {
        embed.setDescription("In selection")
        embed.setColor("#EADE6D")
        return await message.channel.send({embeds: [embed]})
    } else if (statusUser.status == 5 && statusUser.privacy_flag === "n") {
        embed.setDescription("Player not found")
        embed.setColor("#EB6C5A")
        return await message.channel.send({embeds: [embed]})
    } else if (statusUser.status == 5) {
        embed.setDescription("Private account")
        embed.setColor("#EB6C5A")
        return await message.channel.send({embeds: [embed]})
    } else if (statusUser.status == 4 || statusUser.status == 6 || statusUser.status == 7) {
        embed.setDescription("???")
        embed.setColor("#A1A1A1")
        return await message.channel.send({embeds: [embed]})
    }

    const match = await api.getActiveMatchDetails(statusUser.Match)

    if (match[0].mapGame === "LIVE Shooting Range Local") {
        embed.setDescription("In the Shooting Range")
        embed.setColor("#78A6EB")
        return await int.editReply({embeds: [embed]})
    }

    let team1 = ""
    let team2 = ""
    let ranked = ""
    const nameMatch = match[0].mapGame
    for (let i=0; i<6; i++) {
        ranked += nameMatch[i]
    }
    for (let i=0; i < match.length; i++) {
        
        const base = baseText(match[i], ranked)
        if (match[i].taskForce == 1) {
            team1 = team1 + `= ${base} =\n`
        } else {
            team2 = team2 + `[ ${base} ]\n`
        }
    }

    let msg

    if (ranked.toLowerCase() == "ranked") {
        msg = `Match: ${statusUser.Match}  Map: ${match[0].mapGame}  Region: ${match[0].playerRegion}\n\n  Player                Rank         Level   Champion        \n${team1}\n${team2}`
    } else {
        msg = `Match: ${statusUser.Match}  Map: ${match[0].mapGame}  Region: ${match[0].playerRegion}\n\n  Player                Level   Champion        \n${team1}\n${team2}`
    }

    await message.channel.send(`\`\`\`asciidoc\n${msg}\`\`\``)
}

const baseText = (match, ranked) => {

    let name
    
    const accountLevel = `${match.Account_Level}lvl`
    const championName = match.ChampionName
    const championLevel = match.ChampionLevel
    
    match.playerName.length != 0 ? name = match.playerName : name = "???"
    const account = `${name} (${accountLevel}lvl)`
    const champion = `${championName} (${championLevel}lvl)`
    
    let spaceNC, spaceLC

    if (name.length == 21) spaceNC = " "
    else if (name.length == 20) spaceNC = "  "
    else if (name.length == 19) spaceNC = "   "
    else if (name.length == 18) spaceNC = "    "
    else if (name.length == 17) spaceNC = "     "
    else if (name.length == 16) spaceNC = "      "
    else if (name.length == 15) spaceNC = "       "
    else if (name.length == 14) spaceNC = "        "
    else if (name.length == 13) spaceNC = "         "
    else if (name.length == 12) spaceNC = "          "
    else if (name.length == 11) spaceNC = "           "
    else if (name.length == 10) spaceNC = "            "
    else if (name.length == 9) spaceNC = "             "
    else if (name.length == 8) spaceNC = "              "
    else if (name.length == 7) spaceNC = "               "
    else if (name.length == 6) spaceNC = "                "
    else if (name.length == 5) spaceNC = "                 "
    else if (name.length == 4) spaceNC = "                  "
    else if (name.length == 3) spaceNC = "                   "
    else if (name.length == 2) spaceNC = "                    "
    else if (name.length == 1) spaceNC = "                     "
    else spaceNC = " "

    if (ranked.toLowerCase() != "ranked") {

        
        if (accountLevel.length == 6) spaceLC = "  "
        else if (accountLevel.length == 5) spaceLC = "   "
        else if (accountLevel.length == 4) spaceLC = "    "
        
        return `${name}${spaceNC}${accountLevel}${spaceLC}${champion}`
    } else {
        
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
            27: "GM"
        }

        const rank = ranks[match.Tier]

        let spaceRA = ""

        if (rank.length == 12) spaceRA = " "
        else if (rank.length == 11) spaceRA = "  "
        else if (rank.length == 10) spaceRA = "   "
        else if (rank.length == 9) spaceRA = "    "
        else if (rank.length == 8) spaceRA = "     "
        else if (rank.length == 7) spaceRA = "      "
        else if (rank.length == 6) spaceRA = "       "
        else if (rank.length == 5) spaceRA = "        "
        else if (rank.length == 4) spaceRA = "         "
        else if (rank.length == 3) spaceRA = "          "
        else if (rank.length == 2) spaceRA = "           "
        else spaceRA = "   "

        if (accountLevel.length == 6) spaceLC = "  "
        else if (accountLevel.length == 5) spaceLC = "   "
        else if (accountLevel.length == 4) spaceLC = "    "

        return `${name}${spaceNC}${rank}${spaceRA}${accountLevel}${spaceLC}${champion}`
    }

}

module.exports = { currentFunction }