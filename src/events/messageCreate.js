const { client, api } = require("../app")

client.on("messageCreate", async message => {
    const prefix = "d!"
    if (!message.content.startsWith("d!") || message.author.bot) return

    const args = message.content.slice(prefix.length).split(" ")
    const cmd = client.prefixCommands.get(args.shift().toLowerCase())
    
    if (cmd) return cmd.run(client, message, args, api)
})