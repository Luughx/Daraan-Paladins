const { Schema, model } = require("mongoose")

const userid = new Schema({
    userid: Number,
    paladinsId: Number
}, {
    timestamps: true,
    versionKey: false
})


module.exports = model("userId", userid)