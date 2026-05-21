const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const conversationController = require("../controller/conversation");

router.post("/add-conversation",authMiddleware.auth,conversationController.addConversation);
router.get("/get-conversations",authMiddleware.auth,conversationController.getConversations);
router.get("/communityConvo/:communityId",authMiddleware.auth,conversationController.getCommunityConvo);

module.exports = router;