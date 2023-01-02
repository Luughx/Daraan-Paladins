const antiCrash = () => {
    process.removeAllListeners()

    process.on("unhandledRejection", (reason, p) => {
        console.log(reason, p)
    })

    process.on("uncaughtException", (reason, p) => {
        console.log(reason, p)
    })

    process.on("uncaughtExceptionMonitor", (reason, p) => {
        console.log(reason, p)
    })

    process.on("multipleResolves", () => {})
}

module.exports = antiCrash