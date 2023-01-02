require("dotenv").config()
const { client } = require("./app")
const { TOKEN } = process.env

client.login(TOKEN)