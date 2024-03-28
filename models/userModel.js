const mongoose = require('mongoose');
const Token = require('./token');
const USER = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    }
    // token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', required: true }
})

module.exports = mongoose.model('users',USER);