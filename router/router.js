
const { signUp, makeAdmin, loginUser, allUsers, verifyEmail, resendVerification, resetPassword, forgotPassword, changePassword, getOneUsers, deleteUser } = require("../controller/controller")
const { authenticate } = require("../middleware/auth")
const router = require("express").Router()

router.post("/signup", signUp)
router.get("/allusers", authenticate ,allUsers)
router.post("/login", loginUser)
router.get("/getone/:userID", getOneUsers)
router.delete("/deleteuser/:userID",authenticate, deleteUser)

router.put("/make-admin/:userID" ,makeAdmin)
router.post("/verify", verifyEmail)
router.post("/resendVerification/", resendVerification)
router.get("/forgotpassword", forgotPassword )
router.post("/changepassword:token", changePassword)
router.get("/reset-password:token", resetPassword)
module.exports = router
 