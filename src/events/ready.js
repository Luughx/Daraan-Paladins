const { client } = require("../app")
const { ActivityType } = require("discord.js")

client.on("ready", () => {
    console.log(`Ready!! ${client.user.tag}`)

    const options = [
        {
            name: "uwu",
            type: ActivityType.Watching,
            status: "online"
        },
        {
            name: "lughx",
            type: ActivityType.Listening,
            status: "online"
        }
    ]
    // online, idle, dnd
    setInterval(() => {
        const option = Math.floor(Math.random() * options.length)
        client.user.setPresence({
            activities: [
                {
                    name: options[option].name,
                    type: options[option].type
                }
            ],
            status: options[option].status
        })
    }, 10000);
})