const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    password:{
        type:String
    }
})

module.exports =  mongoose.model('users',schema)