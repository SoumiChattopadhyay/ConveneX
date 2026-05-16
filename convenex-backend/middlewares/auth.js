const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async(req,res,next)=>{
    try{
        const token = req.cookies.token;//next time when user tries to access any endpoint auth middleware functions in b/w and checks if token is stored in user browser or not then it doesnt ask user for login it redirects user to dashboard directly
        if(!token){
            return res.status(401).json({error:"No token, authorization denied."});
        }
        const decode = jwt.verify(token,process.env.JWT_PRIVATE_KEY);//again returns the token object
        req.user = await User.findById(decode.userId).select("-password");//stores user details in req object
        next();
    }
    catch(err){
        res.status(401).json({error:"Token is not valid."});
    }
}