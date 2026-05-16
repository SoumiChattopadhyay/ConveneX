const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.commentPost = async(req,res)=>{
    try{
        const selfId = req.user._id;
        const selfName = req.user.f_name;
        const {postId,comment} = req.body;

        if (!comment || !comment.trim()) {
            return res.status(400).json({error:"Comment cannot be empty."});
        }

        const postExists = await Post.findById(postId).populate("user");
        
        if(!postExists){
            return res.status(404).json({error:"Post not found."});
        }
        
        postExists.comments = postExists.comments + 1;
        
        await postExists.save();

        const newComment = await Comment.create({user:selfId,post:postId,comment});

        const populatedComment = await Comment.findById(newComment._id).populate("user","f_name headline curr_company profilePic");

        const notificationContent = `${selfName} has commented on your post.`;
        const notification = await Notification.create({sender:selfId, receiver:postExists.user._id, content: notificationContent, type:"comment", postId:postId.toString()});
        return res.status(200).json({
            message:"Commented successfully.",
            comment:populatedComment
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error", message:err.message});
    }
};

exports.getCommentsbyPostId = async(req,res)=>{
    try{
        const {postId} = req.params;
        const postExists = await Post.findById(postId);
        if(!postExists){
            return res.status(400).json({error:"Post not found."});
        }
        const comments = await Comment.find({post:postId}).sort({createdAt:-1}).populate("user","f_name headline curr_company profilePic");
        return res.status(200).json({
            message:"Comments fetched.",
            comments:comments
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error", message:err.message});
    }
};