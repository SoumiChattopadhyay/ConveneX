const User = require("../models/User");
const Notification = require("../models/Notification");
const bcryptjs = require('bcryptjs');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');
const {google} = require('googleapis');//require google's library

const cookieOptions = {
    httpOnly: true,
    secure: false,//Set to true in production
    sameSite: 'Lax'//Set to None in production
};

exports.loginThroughGmail = async (req, res) => {
    try {
        const { token } = req.body;//frontend will send a token to req body
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;
        let userExists = await User.findOne({ email });
        if (!userExists) {
            // Register new user
            userExists = await User.create({
                googleId: sub,
                email,
                f_name: name,
                profilePic: picture
            });
        }
        let jwttoken = jwt.sign({ userId: userExists._id }, process.env.JWT_PRIVATE_KEY);//sign funct of jwt package helps us create a token which we send as a cookie to user browser. //next time when user tries to access any endpoint auth middleware functions in b/w and checks if token is stored in user browser or not then it doesnt ask user for login it redirects user to dashboard directly
        res.cookie('token', jwttoken, cookieOptions);//key,value,options
        return res.status(200).json({ user: userExists });
    } catch (err) {
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

exports.connectGoogleCalendar = async(req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type:"offline",
        prompt:"consent",
        scope:[
            "https://www.googleapis.com/auth/calendar.events"
        ]
    });
    res.redirect(url);
}

exports.googleCalendarCallback = async(req,res)=>{
    try{
        const code = req.query.code;
        const {tokens} = oauth2Client.getToken(code);
        res.json(tokens);
    }catch(err){
        res.status(500).json({
            error:err.message
        });
    }
}

exports.register = async (req, res) => {
    try {
        let { email, password, f_name } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "Already have an account with this email. Try with another email." });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, f_name });
        await newUser.save();

        let token = jwt.sign({ userId: newUser._id }, process.env.JWT_PRIVATE_KEY);
        res.cookie('token', token, cookieOptions);

        return res.status(201).json({ message: "User registered successfully", success: true, data: newUser });
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userExists = await User.findOne({ email });
        if(userExists && !userExists.password){//For people who sign up through email we dont store passwords, so if they try to login normally using email and password ask them to login by Google instead
            return res.status(400).json({error:"Please login through Google"});
        }
        if (userExists && await bcryptjs.compare(password, userExists.password)) {
            let token = jwt.sign({ userId: userExists._id }, process.env.JWT_PRIVATE_KEY);//sign funct of jwt package helps us create a token which we send as a cookie to user browser. //next time when user tries to access any endpoint auth middleware functions in b/w and checks if token is stored in user browser or not then it doesnt ask user for login it redirects user to dashboard directly
            res.cookie('token', token, cookieOptions);//key,value,options
            return res.status(200).json({ message: "Logged in successfully", success: "true", data: userExists });
        } else {
            return res.status(401).json({ error: "Invalid credentials." });
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { user } = req.body;//user sends a new object as req.body (PUT request)

        const userExists = await User.findById(req.user._id);//since auth middleware runs before this it passed user details to req object we extract the id of user from that and search for user details in database

        if (!userExists) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        const updatedData = await User.findByIdAndUpdate(userExists._id, user);
        console.log(updatedData);

        const userData = await User.findById(req.user._id);
        res.status(200).json({
            message: "User updated successfully",
            user: userData
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}

exports.getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const userExists = await User.findById(id);
        if (!userExists) {
            return res.status(404).json({ error: "No such user exists." });
        }
        return res.status(200).json({
            message: "User fetched successfully",
            user: userExists
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}

exports.logout = async (req, res) => {
    return res.clearCookie('token', cookieOptions).json({ message: 'Logged out successfully' });//delete the cookie from user's browser 
}

exports.findUser = async (req, res) => {//search bar
    try {
        const { query } = req.query;
        const users = await User.find({
            $and: [
                { _id: { $ne: req.user._id } },
                {
                    $or: [
                        { name: { $regex: new RegExp(`^${query}`, 'i') } },//i means case-insensitive
                        { email: { $regex: new RegExp(`^${query}`, 'i') } }//if name or email includes the string user typed then we fetch the other user's details from database
                    ]
                }
            ]
        });//and involves multiple conditions so they are stored in an array. same for or.
        return res.status(200).json({
            message: "Fetched users.",
            user: users
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
};

exports.sendFriendReq = async (req, res) => {
    try {
        const sender = req.user._id;
        const { receiver } = req.body;
        const userExists = await User.findById(receiver);

        if (!userExists) {
            return res.status(404).json({ error: "No such user exists." });
        }

        const index = userExists.friends.findIndex(id => id === sender);
        if (index !== -1) {
            return res.status(409).json({
                error: "Already Friend"
            });
        }

        const index2 = userExists.pending_friends.findIndex(id => id === sender);
        if (index2 !== -1) {
            return res.status(409).json({
                error: "Already Sent Friend Request."
            });
        }

        userExists.pending_friends.push(sender);
        await userExists.save();

        const content = `${req.user.f_name} has sent you friend request.`;//dont write sender.f_name because sender is id(req.user._id) so sender.f_name becomes undefined
        const notification = await new Notification({ sender, receiver, content, type: "friendRequest" });
        await notification.save();

        return res.status(200).json({
            message: "Sent friend request."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
};


exports.acceptFriendReq = async (req, res) => {
    try {
        const { friendId } = req.body;
        const selfId = req.user._id;

        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(400).json({
                error: "No such user exists."
            });
        }

        const index = req.user.pending_friends.findIndex(id => id.toString() === friendId.toString());
        if (index !== -1) {
            req.user.pending_friends.splice(index, 1);
        } else {
            return res.status(400).json({ error: "No such request from such user." });
        }
        req.user.friends.push(friendId);
        await req.user.save();

        friend.friends.push(selfId);
        await friend.save();

        const content = `${req.user.f_name} has accepted your friend request.`;
        const notification = await Notification.create({ sender: selfId, receiver: friendId, content, type: "friendRequest" });

        return res.status(200).json({
            message: "You both are connected now."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
};

exports.getFriendList = async (req, res) => {
    try {
        let friendList = await req.user.populate("friends");//populate("friends") replaces friend IDs with actual user documents.
        return res.status(200).json({
            friends: friendList.friends //dont write just friendList coz we just want friends not full req.user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}

exports.getPendingFriendsList = async (req, res) => {
    try {
        let pendingFriendList = await req.user.populate("pending_friends");//populate("pending_friends") replaces pending friend IDs with actual user documents.
        return res.status(200).json({
            pendingFriends: pendingFriendList.pending_friends //dont write just friendList coz we just want pending_friends not full req.user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}

exports.removeFromFriendList = async (req, res) => {
    try {
        let selfId = req.user._id;
        let { friendId } = req.params;

        const friendData = await User.findById(friendId);
        if (!friendData) {
            return res.status(400).json({ error: "No such user exists." });
        }

        const index = req.user.friends.findIndex(id => id.toString() === friendId.toString());
        if (index !== -1) {
            req.user.friends.splice(index, 1);
        } else {
            return res.status(400).json({ error: "No such request from such user." });
        }

        const friendIndex = friendData.friends.findIndex(id => id.toString() === selfId.toString());
        if (friendIndex !== -1) {
            friendData.friends.splice(friendIndex, 1);
        } else {
            return res.status(400).json({ error: "No such request from such user." });
        }

        await req.user.save();
        await friendData.save();

        return res.status(200).json({
            message: "You both are disconnected now."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}

exports.updateUserProfileViews = async(req,res)=>{
    try{
        let {userId} = req.params;
        let viewerId = req.user._id;
        if(userId.toString()===viewerId.toString()){//prevents self views
            return res.json({success:true});
        }
        const user = await User.findByIdAndUpdate(userId,{
            $addToSet:{
                profileViewers:viewerId
            }
        });
        return res.json({success:true});
    }catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", messgae: err.message });
    }
}