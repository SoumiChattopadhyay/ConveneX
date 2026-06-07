const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    community:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Community"
    },
    desc:{
        type:"String"
    },
    imageLink:{
        type:"String"
    },
    likes:[//an array that stores all user ids who liked this post
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:{//stores no. of comments(We have a separate comment schema for entire comment)
        type:Number,
        default:0
    },
    impressions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"User"
    }
},{timestamps:true});

const Post = mongoose.model("Post",PostSchema);

module.exports=Post;