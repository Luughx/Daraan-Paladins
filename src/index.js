require("dotenv").config()
const { client } = require("./app")
const { TOKEN, PORT } = process.env
const http = require("http")

http.createServer((req, res) => {
    res.write("uwu")
    res.end()
}).listen(PORT || 3000)

client.login(TOKEN)