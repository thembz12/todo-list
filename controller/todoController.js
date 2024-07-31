const todoModel = require ("../models/todoModel")
const userModel = require ("../models/model")

exports.createContent = async (req,res)=>{
    try {
        const {userID} = req.user
        const {title, content} = req.body
        const user = await userModel.findOne(userID)
        if(!user){
            return res.status(404).json({
                message:'user not found'
            })
        }
        const todo = new todoModel({
            title,
            content
        })
        todo.user = userID
        user.todo.push(user._id).push

        await user.save()
        await todo.save()
        res.status(201).json({
            message:"todo created successfully",
            data:todo
        })
        
    } catch (error) {
        res.status(500).json({
            status: "server error",
            errorMessage: error.Message
        })
        
    }
}

exports.getOneContent = async (req,res)=>{
    try {
        const userID = req.params.userID
        const getOneContent = await todoModel.findOne({userID})
        if(!getOneContent){
            return res.status(404).json({
                message:"content not found"
            })
        }
        res.status(200).json({
            message:"content below"
        })
    } catch (error) {
        res.status(500).json({
            status:"server error",
            errorMessage: error.message
        })
        
    }
}

exports.getAllContent = async (req,res)=>{
    try {
        const {userID} = req.user
        const getAllContent = await todoModel.find({user:userID})
        if(!getAllContent.length <=0){
            return res.status(404).json({
                message:"content not found"
            })
        }
        res.status(200).json({
            message:"content below",
            data:getAllContent.length
        })
    } catch (error) {
        res.status(500).json({
            status:"server error",
            errorMessage: error.message
        })
        
    }
}

exports.updateContent = async (req,res)=>{
    try {
        const {userID} = req.user
        const {todoID}= req.params
        const {title,content}= req.body
        const user = await userModel.findById({userID})
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const todo = await todoModel.findById({todoID})
        if(!todo){
            return res.status(404).json({
                message:"todo content not found"
            })
        }
        if(todo.user.toString()!== userID.toString){
            return res.status(401).json({
                message:"not allowed to update a content by another user."
            })
        }
        const data = {
            title: title || todo.title,
            content: content || todo.content
        }

        const updatedContent = await todoModel.findByIdAndUpdate(todoID,data, {new:true})
        res.status(200).json({
            message:"content updated successfull",
            data: updatedContent
        })
    
    } catch (error) {
        res.status(500).json({
            status:"server error",
            errorMessage: error.message
        })
        
    }
}

exports.deleteContent = async (req,res)=>{
    try{
    const {todoID}= req.user
    const todo = await todoModel.findById({todoID})
    if(!todo){
        return res.status(404).json({
            message:"todo is not found"
        })
    }
    if(todo.user.toString()!== userID.toString){
        return res.status(401).json({
            message:"not allowed to update a content by another user."
        })
    }
    const deletedContent = await todoModel.findByIdAndDelete(todoID)
    res.status(200).json({
        message:"content deleted successfully"
    })
}catch(error){
    res.status(500).json({
        status:"server error",
        errorMessage: error.message
    })
}}