require("dotenv").config()
const mongoose = require ("mongoose")
const URL = process.env.database

mongoose.connect(URL).then(()=>{
    console.log("database connected successfuly");
}).catch((error)=>{
    console.log("database not connected because", error);
})