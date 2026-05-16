const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({//See the /profile page
    googleId: {//if user logins through gmail
        type: String,
    },
    email: {//if user logins through email
        type: String,
        required: true,
    },
    password: {//password is not required field
        type: String,
    },
    f_name: {//user's full name
        type: String,
        default: "",
    },
    headline: {
        type: String,
        default: "",
    },
    curr_company: {
        type: String,
        default: "",
    },
    curr_location: {
        type: String,
        default: "",
    },
    profilePic:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    coverPic:{
        type:String,
        default:"https://png.pngtree.com/background/20250102/original/pngtree-vectorized-linkedin-banner-with-seamless-gradient-texture-technology-picture-image_15301363.jpg"
    },
    friends: [//friends field is an array of users
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    pending_friends: [//pending_friends field is an array of users
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    resume: {
        type: String,
    },
    about: {
        type: String,
        default: "",
    },
    skills: {//skills is an Array of strings(skills)
        type: [String],
        default: [],
    },
    experience: [//experience is an array of various experiences in different companies
        {
            designation: {
                type: String,
            },
            company_name: {
                type: String,
            },
            duration: {
                type: String,
            },
            location: {
                type: String,
            },
        },
    ],
},{timestamps:true}//to keep track when this user entry was created in Database and when any kind of updations were made in this database entry
);

const User = mongoose.model("User",UserSchema);

module.exports = User;