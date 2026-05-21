const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
    },

   category: {
        type: String,
        required: true,
    },

    mode: {
        type: String,
        enum: ["online", "offline", "hybrid"],
        required: true,
    },

    startDateTime: {
        type: Date,
        required: true,
    },

    endDateTime: {
        type: Date,
        required: true,
    },

    location: {
        type: String,
        required: function () {
            return this.mode !== "online";
        },
    },

    venueDetails: {
        venueLink: {
            type: String,
        },

        fullAddress: {
            type: String,
        },
    },

    meetingLink: {
        type: String,
    },

    entryFee: {
        type: Number,
        default: 0,
    },

    bannerImage: {
        type: String,
    },

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },

    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    registrationDeadline: {
        type: Date,
    },

    tags: [String],

    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
    },
}, { timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true} });

EventSchema.virtual("type").get(function(){
    return new Date(this.endDateTime)<new Date() ? "past" : "upcoming";
});
EventSchema.virtual("status").get(function(){
    return new Date(this.endDateTime)<new Date()?"completed":"published";
});
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;