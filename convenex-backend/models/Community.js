const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
   visibility: {
      type: String,
      enum: ["public", "invite-only"],
      default: "public",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    pendingRequests: [//of users wanting to become moderator or admin
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    memberCount: {
      type: Number,
      default: 0,
    },

    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },

    // joinFormId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Form",
    // },
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email:{
      type:String,
      required:true
    },
    tagline:{
      type:String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
    },

    bannerImage: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    tags: [String],

    socialLinks: {
      website: String,

      github: String,

      linkedin: String,

      discord: String,

      instagram: String,

      twitter: String,
    },
    conversation:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Conversation",
    }
    // rules: [String],

  },{timestamps:true});

const Community = mongoose.model("Community",CommunitySchema);

module.exports = Community;