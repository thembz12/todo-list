const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
title:{type:String,
required:true
},
content:{type:String,
required:true
},
user:{
    type:mongoose.SchemaTypes.ObjectId,
    ref:"user"
},
},{timestamp:true})

const userModel = mongoose.model("ToDOList", userSchema)
module.exports = userModel