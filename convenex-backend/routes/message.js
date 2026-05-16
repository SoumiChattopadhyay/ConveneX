const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const messageController = require("../controller/message");

router.post("/",authMiddleware.auth,messageController.sendMessage);
router.get("/:convoId",authMiddleware.auth,messageController.getMessages);

module.exports = router;