const mongoose = require("mongoose")

const infoSchema = new mongoose.Schema({
    
    fullname : {
        type : String,
        required : true
    },age:{
        type : String,
        required : true
    },
    dataCreated :{
        type : Date,
        default : Date.now
    }
})

const infodb = new mongoose.model("info",infoSchema)

module.exports = infodb

