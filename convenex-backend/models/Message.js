const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    conversation:{//the conversation this message belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    message:{
        type:String
    },
    picture:{
        type:String
    },
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;