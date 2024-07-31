const { createContent, getAllContent, updateContent, deleteContent, getOneContent } = require("../controller/todoController")
const { authenticate } = require("../middleware/auth")

const router = require ("express").Router()


router.post("/create-content", authenticate ,createContent)
router.get("/getone-content/:userID",authenticate, getOneContent)
router.get("/getall-content",authenticate, getAllContent )
router.put("/update-content/:userID",authenticate, updateContent )
router.delete("/delete-content/:userID",authenticate , deleteContent )


module.exports = router