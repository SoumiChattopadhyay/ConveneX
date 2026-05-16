const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const commentController = require("../controller/comment");

router.post("/",authMiddleware.auth,commentController.commentPost);
router.get("/getComments/:postId",commentController.getCommentsbyPostId);

module.exports = router;