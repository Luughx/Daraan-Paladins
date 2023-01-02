const { connect,set } = require("mongoose")

const connectMongo = () => {
    try {
        set("strictQuery", false)
        connect(process.env.DB_URL)
        console.log("database connected")

    } catch (error) {
        console.log(error)
    }
}

module.exports = {connectMongo}
