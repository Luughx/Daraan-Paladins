const { Client, Collection, REST, Routes, GatewayIntentBits } = require("discord.js")
const fs = require("fs")
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})
require("dotenv").config()
const { TOKEN, CLIENT_ID, DEV_ID, AUTH_KEY } = process.env
const antiCrash = require("./handlers/antiCrash")
const { API } = require("pe-paladins.js")
const { connectMongo } = require("./config/database")

connectMongo()

const api = new API({
    devId: DEV_ID,
    authKey: AUTH_KEY,
    languageId: 1
})

const rest = new REST({ version: '10' }).setToken(TOKEN);

fs.readdir(`${__dirname}/events/`, (err, files) => {
    if(err) return console.error(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0) {
        return console.log("no hay eventos para cargar")
    }

    jsfile.forEach((f, i) => {
        require(`${__dirname}/events/${f}`)
        console.log(`${f} was loaded`)
    })
})
client.slashCommands = new Collection()
client.menuCommands = new Collection()
client.prefixCommands = new Collection()

let commands = [];

antiCrash()

const dirCommands = fs.readdirSync(`${__dirname}/commands`)
const load = dirCommands => {
    const dirC = fs.readdirSync(`${__dirname}/commands/${dirCommands}/`)
    dirC.forEach(dir => {
        const files = fs.readdirSync(`${__dirname}/commands/${dirCommands}/${dir}`).filter((f) => f.endsWith(".js"))
        for (let file of files){       
            let command = require(`${__dirname}/commands/${dirCommands}/${dir}/${file}`)

            if (dirCommands === "slash") client.slashCommands.set(command.name, command)
            else if (dirCommands === "user") client.menuCommands.set(command.name, command)
            else if (dirCommands === "prefix") client.prefixCommands.set(command.name, command)

            if (dirCommands === "slash" || dirCommands === "user") commands.push(command.builder.toJSON())
            console.log(file+" was loaded")
        }
    })
}  
dirCommands.forEach(x => load(x))

const main = async () => {
    try {
        console.log('Started refreshing application (/) commands.')
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}

main()

module.exports = {client, api}