const mongoose = require('mongoose');
const ConversationSchema = new mongoose.Schema({
    members:[//convo takes place b/w 2 users(1 to 1 relation) so members is array
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;