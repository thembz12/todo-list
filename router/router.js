
const { signUp, makeAdmin, loginUser, allUsers, verifyEmail, resendVerification, resetPassword, forgotPassword, changePassword, getOneUsers, deleteUser } = require("../controller/controller")
const { auth2, isAdmin, isAdmin2 }= require ("../middleware/auth2")
const router = require("express").Router()

router.post("/signup", signUp)
router.get("/allusers",auth2,isAdmin2,allUsers)
router.post("/login", loginUser)
router.get("/getone/:userID", getOneUsers)
router.delete("/deleteuser/:userID",auth2,isAdmin2, deleteUser)

router.put("/make-admin/:userID" ,makeAdmin)
router.get("/verify", verifyEmail)
router.post("/resendVerification/", resendVerification)
router.get("/forgotpassword", forgotPassword )
router.post("/changepassword:token", changePassword)
router.get("/reset-password:token", resetPassword)
module.exports = router 
 