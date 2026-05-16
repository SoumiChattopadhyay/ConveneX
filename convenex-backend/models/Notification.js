const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: { //since we have to send the notification only to the receiver(the person whom someone sent friend req or the person on whose post someone commented) not to all users 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content:{
        type:"String",
        required:true
    },
    type:{// if the type of notification is friendRequest then when user clicks on notification he is redirected to /mynetwork page and if the type is comment then the user is redirected to that post
        type:String,
        enum:["friendRequest","comment"],
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    postId:{//when someone comments on the user's post we will automatically store postId on notification collection so that whenever user clicks his notification he will be redirected to his particular post
        type:String,
        default:""
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;