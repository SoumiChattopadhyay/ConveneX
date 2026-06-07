const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const postController = require('../controller/post');

router.post("/addPost",authMiddleware.auth,postController.addPost);
router.post("/addCommunityPost/:communityId",authMiddleware.auth,postController.addCommunityPost);
router.post("/likeDislike",authMiddleware.auth,postController.likeDislikePost);
router.get("/allPosts",postController.getAllPosts);//not adding auth middleware as when someone is not logged in then also he can see all posts
router.get("/getPostByPostId/:postId",postController.getPostByPostId);//not adding auth middleware as when someone is not logged in then also he can see other people's posts
router.get("/getTop5Posts/:userId",postController.getTop5PostsOfUser);//not adding auth middleware as when someone is not logged in then also he can see other people's top 5 posts
router.get("/getAllPostsofUser/:userId",postController.getAllPostsOfUser);//not adding auth middleware as when someone is not logged in then also he can see other people's all posts
router.get("/getAllPostsofCommunity/:communityId",postController.getAllPostsOfCommunity);//not adding auth middleware as when someone is not logged in then also he can see other people's all posts
router.post("/post-impression/:postId",authMiddleware.auth,postController.updatePostImpressions);

module.exports = router;