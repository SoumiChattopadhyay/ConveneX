const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const conversationController = require("../controller/conversation");

router.post("/add-conversation",authMiddleware.auth,conversationController.addConversation);
router.get("/get-conversation",authMiddleware.auth,conversationController.getConversation);

module.exports = router;