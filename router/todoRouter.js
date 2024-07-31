const { createContent, getAllContent, updateContent, deleteContent, getOneContent } = require("../controller/todoController")
const { authenticate } = require("../middleware/auth")

const router = require ("express").Router()


router.post("/create-content", authenticate ,createContent)
router.get("/getone-content", getOneContent)
router.get("/getall-content",getAllContent )
router.get("/update-content",updateContent )
router.get("/delete-content",deleteContent )


module.exports = router