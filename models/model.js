const mongoose = require ('mongoose')

const todoSchema = new mongoose.Schema({
fullname:{type:String,
required:true
},
email:{type:String,
required:true
},
password:{type:String,
required:true
},
todo:[{
    type:mongoose.SchemaTypes.ObjectId,
    ref:"todoModel"
}],
isVerified:{type:String,
default:false
},
isAdmin:{type:String,
default:false
}
},{timestamp:true})

const todoModel = mongoose.model("user", todoSchema)
module.exports = todoModel