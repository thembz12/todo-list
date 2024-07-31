
const { signUp, makeAdmin, loginUser, allUsers, verifyEmail, resendVerification, resetPassword, forgotPassword, changePassword, getOneUsers } = require("../controller/controller")
const { authenticate } = require("../middleware/auth")
const router = require("express").Router()

router.post("/signup", signUp)
router.get("/allusers", authenticate ,allUsers)
router.post("/login", loginUser)
router.get("/getone", getOneUsers)

router.put("/make-admin/:id" ,makeAdmin)
router.post("/verify", verifyEmail)
router.post("/resendVerification/", resendVerification)
router.get("/forgotpassword", forgotPassword )
router.post("/changepassword:token", changePassword)
router.get("/reset-password:token", resetPassword)
module.exports = router
 