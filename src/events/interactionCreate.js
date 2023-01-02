const { client, api } = require("../app")

client.on("interactionCreate", async int => {
    if (int.isChatInputCommand()) {
        const cmd = client.slashCommands.get(int.commandName)
    
        if (cmd) return cmd.run(client, int, api)
        
    } else if (int.isUserContextMenuCommand()) {
        const cmd = client.menuCommands.get(int.commandName)
    
        if (cmd) return cmd.run(client, int, api)
    }
})