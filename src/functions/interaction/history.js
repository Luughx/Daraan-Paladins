const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const { winrateFunction, kdaFunction } = require("../index")

const historyFunction = async (client, int, api, player) => {
    const history = await api.getPlayerMatchHistory(player)
    if (!history[0].Match_Time) return await int.editReply("Matchs not found or the account is private")

    let totalPages = 1
    let index = 1
    let pagesType = []
    let totalMatch = 0

    const typeOption = int.options.get("type")
    if (typeOption) {
        const type = typeOption.value
        for (let i=0; i < history.length; i++) {
            if (history[i].Queue == type) {
                pagesType.push(history[i])
                totalMatch++
            }
        }
    } else {
        for (let i=0; i < history.length; i++) {
            pagesType.push(history[i])
            totalMatch++
        }
    }

    if (pagesType.length == 0) return await int.editReply("El jugador no tiene partidas recientes en ese modo de juego")
    
    if (pagesType.length > 25) totalPages = 2
    
    //const champions = await api.getChampions()
    let championsRoles = {
        '2056': 'Paladins Support',
        '2057': 'Paladins Flanker',
        '2071': 'Paladins Front Line',
        '2073': 'Paladins Front Line',
        '2092': 'Paladins Damage',
        '2093': 'Paladins Support',
        '2094': 'Paladins Flanker',
        '2147': 'Paladins Flanker',
        '2149': 'Paladins Front Line',
        '2205': 'Paladins Flanker',
        '2249': 'Paladins Damage',
        '2254': 'Paladins Support',
        '2267': 'Paladins Support',
        '2277': 'Paladins Damage',
        '2281': 'Paladins Damage',
        '2285': 'Paladins Damage',
        '2288': 'Paladins Front Line',
        '2303': 'Paladins Support',
        '2307': 'Paladins Damage',
        '2314': 'Paladins Damage',
        '2322': 'Paladins Front Line',
        '2338': 'Paladins Flanker',
        '2348': 'Paladins Front Line',
        '2362': 'Paladins Flanker',
        '2372': 'Paladins Support',
        '2393': 'Paladins Damage',
        '2404': 'Paladins Front Line',
        '2417': 'Paladins Damage',
        '2420': 'Paladins Flanker',
        '2431': 'Paladins Support',
        '2438': 'Paladins Damage',
        '2472': 'Paladins Flanker',
        '2477': 'Paladins Front Line',
        '2479': 'Paladins Front Line',
        '2480': 'Paladins Damage',
        '2481': 'Paladins Flanker',
        '2491': 'Paladins Support',
        '2493': 'Paladins Flanker',
        '2495': 'Paladins Damage',
        '2509': 'Paladins Damage',
        '2512': 'Paladins Front Line',
        '2517': 'Paladins Support',
        '2528': 'Paladins Front Line',
        '2529': 'Paladins Damage',
        '2533': 'Paladins Support',
        '2536': 'Paladins Flanker',
        '2538': 'Paladins Front Line',
        '2540': 'Paladins Damage',
        '2541': 'Paladins Flanker',
        '2542': 'Paladins Support',
        '2543': 'Paladins Damage',
        '2548': 'Paladins Front Line',
        '2549': 'Paladins Flanker',
        '2550': 'Paladins Damage',
        '2551': 'Paladins Support',
        '2554': 'Paladins Flanker',
        '2555': 'Paladins Damage'
    }
/*     for (let i=0; i < champions.length; i++) {
        championsRoles[champions[i].id] = champions[i].Roles
    }
 */
    //console.log(championsRoles)

    const pages = pageInfo(int, pagesType, totalPages, championsRoles)
    
    const main = { kills: 0, assists: 0, deaths: 0, wins: 0, losses: 0, kda: 0, winrate: 0, exist: false }
    const sup = { kills: 0, assists: 0, deaths: 0, wins: 0, losses: 0, kda: 0, winrate: 0, exist: false }
    const front = { kills: 0, assists: 0, deaths: 0, wins: 0, losses: 0, kda: 0, winrate: 0, exist: false }
    const dps = { kills: 0, assists: 0, deaths: 0, wins: 0, losses: 0, kda: 0, winrate: 0, exist: false }
    const flank = { kills: 0, assists: 0, deaths: 0, wins: 0, losses: 0, kda: 0, winrate: 0, exist: false }

    //console.log(pagesType)

    for (let i=0; i < pagesType.length; i++) {
        main.kills += pagesType[i].Kills
        main.assists += pagesType[i].Assists
        main.deaths += pagesType[i].Deaths
        pagesType[i].Win_Status == "Win" ? main.wins++ : main.losses++

        const rol = championsRoles[pagesType[i].ChampionId.toString()]

        if (rol == "Paladins Support") {
            sup.kills += pagesType[i].Kills
            sup.assists += pagesType[i].Assists
            sup.deaths += pagesType[i].Deaths
            sup.exist = true
            pagesType[i].Win_Status == "Win" ? sup.wins++ : sup.losses++
        }else if (rol == "Paladins Front Line") {
            front.kills += pagesType[i].Kills
            front.assists += pagesType[i].Assists
            front.deaths += pagesType[i].Deaths
            front.exist = true
            pagesType[i].Win_Status == "Win" ? front.wins++ : front.losses++
        } else if (rol == "Paladins Damage") {
            dps.kills += pagesType[i].Kills
            dps.assists += pagesType[i].Assists
            dps.deaths += pagesType[i].Deaths
            dps.exist = true
            pagesType[i].Win_Status == "Win" ? dps.wins++ : dps.losses++
        } else if (rol == "Paladins Flanker") {
            flank.kills += pagesType[i].Kills
            flank.assists += pagesType[i].Assists
            flank.deaths += pagesType[i].Deaths
            flank.exist = true
            pagesType[i].Win_Status == "Win" ? flank.wins++ : flank.losses++
        } 

    }

    main.kda = kdaFunction(main.kills, main.assists, main.deaths)
    main.winrate = winrateFunction(main.wins, main.losses)

    sup.kda = kdaFunction(sup.kills, sup.assists, sup.deaths)
    sup.winrate = winrateFunction( sup.wins, sup.losses)

    front.kda = kdaFunction(front.kills, front.assists, front.deaths)
    front.winrate = winrateFunction( front.wins, front.losses)

    dps.kda = kdaFunction(dps.kills, dps.assists, dps.deaths)
    dps.winrate = winrateFunction( dps.wins, dps.losses)

    flank.kda = kdaFunction(flank.kills, flank.assists, flank.deaths)
    flank.winrate = winrateFunction(flank.wins, flank.losses)

    const data = { main, sup, front, dps, flank, totalMatch }

    const buttonPrev = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("<")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true)

    const buttonNext = new ButtonBuilder()
    .setCustomId("next")
    .setLabel(">")
    .setStyle(ButtonStyle.Primary)
    totalPages == 1 ? buttonNext.setDisabled(true) : buttonNext.setDisabled(false)

    const buttons = new ActionRowBuilder().addComponents(buttonPrev, buttonNext)

    const embed = historyEmbed(client, int, pages, index, totalPages, history, data)
    let currentPage
    totalPages == 1 ? currentPage = await int.editReply({ embeds: [embed] }) : currentPage = await int.editReply({ embeds: [embed], components: [buttons], fetchReply: true}) 
    const collector = await currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 20000
    })

    collector.on("collect", async i => {

        if (i.user.id !== int.user.id) return await i.deferUpdate()
        let embedActu
        if (i.customId == "prev" && index == 2) {
            buttonPrev.setDisabled(true)
            buttonNext.setDisabled(false)
            index = 1

        } else if (i.customId == "next" && index == 1 && totalPages == 2) {
            buttonPrev.setDisabled(false)
            buttonNext.setDisabled(true)
            index = 2
        }
        
        embedActu = historyEmbed(client, int, pages, index, totalPages, pagesType, data)
        
        await int.editReply({ embeds: [embedActu], components: [buttons]})
        collector.resetTimer()
        await i.deferUpdate()
    })

    collector.on("end", async i => {
        await int.editReply( {embeds: [ historyEmbed(client, int, pages, index, totalPages, history, data)], components: []} )
    })
}

const pageInfo = (int, pagesType, totalPages, championsRoles) => {
    let msg = "  Stats    Champion  Match ID   Type      Time  Extra\n"
    let pages = []

    if (totalPages === 1) {
        for (let i=0; i < pagesType.length; i++) {
            let resultMatch
            const base = baseText(pagesType, i, championsRoles)
            if (pagesType[i].Win_Status == "Win") resultMatch = `= ${base} =\n`
            else resultMatch = `[ ${base} ]\n`
            msg = msg + resultMatch
        }
        pages.push(msg)
    } else {
        for (let i=0; i < 25; i++) {

            let resultMatch
            const base = baseText(pagesType, i, championsRoles)
            if (pagesType[i].Win_Status == "Win") resultMatch = `= ${base} =\n`
            else resultMatch = `[ ${base} ]\n`
            msg = msg + resultMatch
        }
        pages.push(msg)
        msg = ""
        for (let i=25; i < pagesType.length; i++) {

            let resultMatch
            const base = baseText(pagesType, i, championsRoles)
            if (pagesType[i].Win_Status == "Win") resultMatch = `= ${base} =\n`
            else resultMatch = `[ ${base} ]\n`
            msg = msg + resultMatch
            
        }
        pages.push(msg)
    }


    return pages
}

const baseText = (pagesType, i, championsRoles) => {
    const stats = `${pagesType[i].Kills}/${pagesType[i].Deaths}/${pagesType[i].Assists}`
    let champion = pagesType[i].Champion
    const matchId = pagesType[i].Match
    const championId = pagesType[i].ChampionId.toString()
    const timeMinutes = (pagesType[i].Time_In_Match_Seconds/60).toFixed(2).toString()
    let type = pagesType[i].Queue
    let extra = ""
    
    if (champion == "Betty la Bomba") champion = "Betty"

    let spaceSC, spaceCM, spaceTT, spaceTR, spaceFinal
    if (stats.length == 8) spaceSC = " "
    else if (stats.length == 7) spaceSC = "  "
    else if (stats.length == 6) spaceSC = "   "
    else spaceSC = "    "

    if (champion.length == 9) spaceCM = " "
    else if (champion.length == 8) spaceCM = "  "
    else if (champion.length == 7) spaceCM = "   "
    else if (champion.length == 6) spaceCM = "    "
    else if (champion.length == 5) spaceCM = "     "
    else if (champion.length == 4) spaceCM = "      "
    else if (champion.length == 3) spaceCM = "       "

    if (type == "Onslaught Training") type = "Onslaught"
    else if (type == "Choose Any") type = "Choose"

    if (type.length == 9) spaceTT = " "
    else if (type.length == 8) spaceTT = "  "
    else if (type.length == 7) spaceTT = "   "
    else if (type.length == 6) spaceTT = "    "
    else if (type.length == 5) spaceTT = "     "

    let time = timeMinutes.split(".")

    if (time[0].length == 1) {
        time[0] = "0"+time[0]
    }

    if (championsRoles[championId] == "Paladins Support") extra =  pagesType[i].Healing.toString()
    else if (championsRoles[championId] == "Paladins Front Line") extra =  pagesType[i].Damage_Mitigated.toString()
    else if (championsRoles[championId] == "Paladins Damage") extra =  pagesType[i].Damage.toString()
    else if (championsRoles[championId] == "Paladins Flanker") extra =  pagesType[i].Damage.toString()

    if (extra.length >= 4) {
        extra = extra.split("")
        extra.pop()
        extra.pop()
        extra.pop()

        extra = extra.join("")
        extra = extra+"k"

    }
    
    if (extra.length == 4) spaceFinal = ""
    else if (extra.length == 3) spaceFinal = " "
    else if (extra.length == 2) spaceFinal = "  "
    else if (extra.length == 1) spaceFinal = "   "

    return `${stats}${spaceSC}${champion}${spaceCM}${matchId} ${type}${spaceTT}${time.join(":")} ${extra}${spaceFinal}`
}

const historyEmbed = (client, int, pages, index, totalPages, history, data) => {
    const { main, sup, front, dps, flank, totalMatch } = data

    const embed = new EmbedBuilder()
    embed.setTitle(`History ${history[0].playerName}`)
    embed.setColor("#8DBAF2")
    embed.setDescription(`\`\`\`asciidoc\n${pages[index-1]}\`\`\``)
    embed.addFields([
        {
            name: "Total",
            value: `${main.winrate}% (${main.wins} - ${main.losses})\n${main.kda} kda (${main.kills}/${main.deaths}/${main.assists})`,
            inline: true
        }
    ])
    if (sup.exist) {
        embed.addFields([
            {
                name: "Support",
                value: `${sup.winrate}% (${sup.wins} - ${sup.losses})\n${sup.kda} kda (${sup.kills}/${sup.deaths}/${sup.assists})`,
                inline: true
            }
        ])
    }
    if (front.exist) {
        embed.addFields([
            {
                name: "Frontline",
                value: `${front.winrate}% (${front.wins} - ${front.losses})\n${front.kda} kda (${front.kills}/${front.deaths}/${front.assists})`,
                inline: true
            }
        ])
    }
    if (dps.exist) {
        embed.addFields([
            {
                name: "Damage",
                value: `${dps.winrate}% (${dps.wins} - ${dps.losses})\n${dps.kda} kda (${dps.kills}/${dps.deaths}/${dps.assists})`,
                inline: true
            }
        ])
    }
    if (flank.exist) {
        embed.addFields([
            {
                name: "Flank",
                value: `${flank.winrate}% (${flank.wins} - ${flank.losses})\n${flank.kda} kda (${flank.kills}/${flank.deaths}/${flank.assists})`,
                inline: true
            }
        ])
    }
    
    embed.setFooter({
        text: `Page ${index}/${totalPages}  Matchs: ${totalMatch}`
    })

    return embed
}

module.exports = { historyFunction }