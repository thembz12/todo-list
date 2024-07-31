const cors = require ("cors")
const morgan = require ("morgan")
const express = require ("express")
require("dotenv").config()
require("./config/dbConfig")

const router = require("./router/router")
const todoRouter = require ("./router/todoRouter")
const port = process.env.port || 1234
const app = express()

app.use(express.json())
app.use("/api/v1/",router)
app.use("/api/v1/",todoRouter)




app.listen(port,()=>{
    console.log("server is listening to port", port);
})

app.get("/", (req,res)=>{
    res.status(200).json({message:"HELLO WORLD"})
})   