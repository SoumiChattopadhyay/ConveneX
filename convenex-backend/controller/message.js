const Message = require("../models/Message");

exports.sendMessage = async(req,res)=>{//input box opening when we open a chat there we type and send POST request
    try{
        let {conversation,message,picture} = req.body;
        let addMessage = await Message.create({conversation,sender:req.user._id,message,picture});
        let populatedMessage = await addMessage.populate("sender");
        return res.status(201).json(populatedMessage);
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};

exports.getMessages = async(req,res)=>{//getting all messages(texts and images) of a single conversation
    try{
        const {convoId} = req.params;
        let messages = await Message.find({
            conversation: convoId,
        }).populate("sender");    
        return res.status(200).json({message:"Fetched messages.",messages});
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error",message:err.message});
    }
};