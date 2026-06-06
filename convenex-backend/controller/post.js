const Post = require("../models/Post");

exports.addPost =  async(req,res)=>{
    try{
        const {desc, imageLink} = req.body;
        let userId = req.user._id;
        const post = await Post.create({user:userId, desc, imageLink});
        if(!post){
            return res.status(400).json({error:"Something went wrong"});
        }
        return res.status(200).json({
            message: "Post added successfully.",
            post: post
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.likeDislikePost = async(req,res)=>{
    try{
        const selfId = req.user._id;
        const {postId} = req.body;
        let post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({error:"Post not found."});
        }
        const index = post.likes.findIndex(id => id.toString()===selfId.toString());//findIndex() returns the position of the first array element that satisfies the condition, otherwise returns -1.
        if(index!==-1){
            // user has already liked the post, remove like by remove that user id from likes array of that post
            post.likes.splice(index,1);
        }else{
            //user has not liked the post, so add like by pushing the user id to likes array of that post
            post.likes.push(selfId);
        }
        await post.save();
        res.status(200).json({
            message: index!==-1 ? "Post unliked." : "Post liked.",
            likes: post.likes
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.getAllPosts = async(req,res)=>{
    try{
        let allPosts = await Post.find({}).sort({createdAt:-1}).populate("user","-password");//createdAt is usually a timestamp field that stores when a document was created in MongoDB. In Mongoose, it commonly appears automatically when you enable timestamps:true. createdAt: -1 → newest posts first (descending order). createdAt: 1 → oldest posts first (ascending order)
        return res.status(200).json({
            message: "Fetched all posts.",
            posts: allPosts
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.getPostByPostId = async(req,res)=>{
    try{
        const {postId} = req.params;
        let post = await Post.findById(postId).populate("user","-password");//createdAt is usually a timestamp field that stores when a document was created in MongoDB. In Mongoose, it commonly appears automatically when you enable timestamps:true. createdAt: -1 → newest posts first (descending order). createdAt: 1 → oldest posts first (ascending order)
        if(!post){
            return res.status(400).json({error:"Post not found."});
        }
        return res.status(200).json({
            message: "Fetched Post.",
            post: post
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.getTop5PostsOfUser = async(req,res)=>{
    try{
        const {userId} = req.params;
        let posts = await Post.find({user:userId}).sort({createdAt:-1}).populate("user","-password").limit(5);//createdAt is usually a timestamp field that stores when a document was created in MongoDB. In Mongoose, it commonly appears automatically when you enable timestamps:true. createdAt: -1 → newest posts first (descending order). createdAt: 1 → oldest posts first (ascending order)

        return res.status(200).json({
            message: "Fetched top 5 Posts of user.",
            posts: posts
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.getAllPostsOfUser = async(req,res)=>{
    try{
        const {userId} = req.params;
        let allPosts = await Post.find({user:userId}).sort({createdAt:-1}).populate("user","-password");//createdAt is usually a timestamp field that stores when a document was created in MongoDB. In Mongoose, it commonly appears automatically when you enable timestamps:true. createdAt: -1 → newest posts first (descending order). createdAt: 1 → oldest posts first (ascending order)

        return res.status(200).json({
            message: "Fetched all posts of user.",
            post: allPosts
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.updatePostImpressions = async(req,res)=>{
    try{
        let {postId} = req.params;
        let viewerId = req.user._id;
        const post = await Post.findByIdAndUpdate(userId,{
            $inc:{
                postImpressions:1
            }
        });
        const userId = post.user;
        if(userId.toString()===viewerId.toString()){
            return res.json({success:true});
        }
        return res.json({success:true});
    }catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}