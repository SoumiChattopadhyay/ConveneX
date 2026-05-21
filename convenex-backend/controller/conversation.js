const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.addConversation = async (req, res) => {//when user clicks message from other user's profile
    try {
        const selfId = req.user._id;
        const { receiverId, message } = req.body;
        let convExists = await Conversation.findOne({
            members: { $all: [selfId, receiverId] }//find documents where the members array contains both selfId and receiverId
        });
        if (!convExists) {
            let newConversation = await Conversation.create({
                members: [selfId, receiverId]
            });
            let addMessage = await Message.create({ conversation: newConversation._id, sender: selfId, message });
        } else {
            let addMessage = await Message.create({ conversation: convExists._id, sender: selfId, message });
        }
        return res.status(201).json({
            message: "Message sent"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.getConversations = async (req, res) => {//sidebar in /message page
    try {
        let loggedinId = req.user._id;
        let conversations = await Conversation.find({
            type:"dm",
            members: { $in: [loggedinId] }//find conversation docs where the members array contains loggedinId among the 2 member ids
        }).populate("members", "-password").sort({ createdAt: -1 });//replace member IDs with full user documents, but exclude the password field. And give latest conversations first.
        return res.status(200).json({
            message: "Fetched conversations.",
            conversations: conversations
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.getCommunityConvo = async (req, res) => {
    try {
        let { communityId } = req.params;
        
        let conversation = await Conversation.findOne({
            type:"community",
            community: communityId
        }).populate("members", "-password");
       
        const isMember = conversation.members.some(
            (member) => member._id.toString() === req.user._id.toString()
        );
        if (!isMember) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }
        return res.status(200).json({
            message: "Community conversation fetched.",
            conversation
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}