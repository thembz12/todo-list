const jwt = require("jsonwebtoken")
const userModel = require ("../models/model.js")
const bcrypt = require ("bcrypt")
const sendMail = require ("../helpers/email.js")
const html = require ("../helpers/html.js")


exports.signUp = async (req,res)=>{
    try{
        const {fullname, email, password}=req.body
        const userExist = await userModel.findOne({email})
        if(userExist){
            res.status(400).json({message:"user already exist"})
        }else {
            const saltedpassword = await bcrypt.genSalt(10)
            const hashedpassword = await bcrypt.hash(password, saltedpassword)
            const user = new userModel({fullname, email, password:hashedpassword})
        
        const userToken = jwt.sign({id:user.email},process.env.JWT_SECRET,{expiresIn:"20minutes"})
        const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/verify${user._id}/${userToken}`

       let mailOptions ={
        email:user.email,
        subject:"verification email",
        html: html.signUpTemplate(verifyLink,user.fullname),
       }

           await user.save()
           await sendMail(mailOptions)
            res.status(201).json({message:"successful", data:user}) 

        }
    }catch(error){
        res.status(500).json(error.message)

    }
}

exports.allUsers = async (req,res)=>{
    try {
        const users = await userModel.find()
        if(users.length <=0){ 
            return res.status(400).json({
                message:"no available registered users"
            })
        }else{
            res.status(200).json({
                message:"all resgistered users",
                totalUsersRegistered: users.length,
                data: users
            })
        }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.getOneUsers = async (req,res)=>{
    try {
        const id = req.params.id
        const user = await userModel.findOne(id)
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.status(200).json({
            message:"below is the user",
            data:user
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.loginUser = async (req,res)=>{
    try{
        const {email, password}=req.body
        const userExist = await userModel.findOne({email:email.toLowerCase()})
        if(!userExist){
            return res.status(400).json({message:"user not found"})
        }

        const confirmPassowrd = await bcrypt.compare(password, userExist.password)
        if(!confirmPassowrd){
            return res.status(400).json({message:"incorrect password"})
        }

        
        if(!userExist.isVerified){
            return res.status(400).json({
                message:"you need to verifiy first"
            })
        }


        const token = await jwt.sign({
            userId: userExist._id,
            email: userExist.email,
            isAdmin: userExist.isAdmin
        }, process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({message:"login successful",data:userExist, token})
        

    }catch(error){ 
        res.status(500).json(error.message)
    }
}

exports.makeAdmin = async (req,res)=>{
    try {
        const userID = req.params.userID
        const user = await userModel.findById(userID)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        user.isAdmin = true
        await user.save()
        res.status(200).json({message:"user now an admin", data:user})
        
    } catch (error) {
        res.status(500).json(error.message)
        
    }
}

exports.deleteUser = async (req,res)=>{
    try {
        const userID = req.params.userID
        const user = await userModel.findById(userID)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        const deletedUser = await userModel.findByIdAndDelete(userID)
        res.status(200).json({
            message:"user deleted successfully"
        })
        
    } catch (error) {
        res.status(500).json(error.message) 
        
    }
}
  
exports.verifyEmail = async (req,res)=>{
    try {
        const {token}= req.params
        const {email}= jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        user.isVerified = true
        await user.save()

        res.status(200).json({
            message:"link verified"
        })
        
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            res.json({
                message:"link expired"
            })
        }
        res.status(500).json(error.message)
        
    }
}

exports.resendVerification = async (req,res)=>{
    try{
        const {email}= req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }

        if(user.isVerified){
            return res.status(400).json({
                message:"user has already been verified"
        })
        }
        const token = jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:"20mins"})
        const verifyLink = `${req.protocol}://${res.get("host")}/router/verifyemail/${token}`
        const mailOptions = {
            email:email.user,
            subject:`resendVerification mail`,
            html: verifyTemplate(verifyLink,user.fullname)
        }
         
        await sendMail(mailOptions)
        res.status(200).json({
            message:"verification link resent successfully"
        })
        

    }catch(error){
        res.status(500).json(error.message)
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const {email}= req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const resetToken = jwt.sign({email:user.email}, process.env.JWT_SECRET,{expiresIn:"30mins"})

        const mailOptions={
            email:user.email,
            subject:"reset password",
            html: `please click this link to: <a href"${req.protocol}://${req.get("host")}/router/reset-password/${resetToken}">Reset Password</a>, Link expires in 30 minutes`
        }
        await sendMail(mailOptions)
        res.status(200).json({
            message:"password resset sent to email successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.resetPassword = async (req,res)=>{ 
    try {
        const {token} = req.params
        const {password} = req.body

        const [email] = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne([email])
        if(!user){
            return res.status(404).json({
                message:"user not found"
        })
        }
        
        const saltedpassword = bcrypt.genSalt(10)
        const hashedpassword = bcrypt.hash(password, saltedpassword)
        
        user.password = hashedpassword
        await user.save()
        res.status(200).json({
            message:"password reset successfully"
        })
    } catch (error) {
        res.status(500).json(error.message)
        
    }
} 


exports.logOut = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(' ')[1];

        if(!token){
            return res.status(401).json({
                message: 'invalid token'
            })
        }
        // Verify the user's token and extract the user's email from the token
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user by ID
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.blackList.push(token);
        // Save the changes to the database
        await user.save();
        //   Send a success response
        res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


exports.changePassword = async (req,res)=>{
    try{
        const {token}= req.params
        const {password, existingPassword}= req.body

        const {email} = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const passwordMatched = jwt.compare(password, existingPassword)
        if(!passwordMatched){
            return res.status(400).json({
                message:"password does not matched, try again"
            })
        }
        const saltedpassword = bcrypt.genSalt(10)
        const hashedpassword = bcrypt.hash(password, saltedpassword)
        
        user.password = hashedpassword
        await user.save()
        res.status(200).json({
            message:"password changed successfully"
        })
    }catch(error){
        res.status(500).json(error.message)
    }}
