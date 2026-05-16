const Notification = require("../models/Notification");

exports.getNotifications = async(req,res)=>{
    try{
        let selfId = req.user._id;
        const notifications = await Notification.find({receiver:selfId}).populate("sender receiver").sort({createdAt:-1});//find() returns an array
        return res.status(200).json({
            message:"Notifications fetched successfully.",
            notifications: notifications
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error", message:err.message});
    }
}

exports.updateRead = async(req,res)=>{//When user clicks on a notification, it is marked as read and bg-color changes from blue to gray as isRead field of that notification becomes true from false
    try{
        const {notificationId} = req.body;
        const notification = await Notification.findByIdAndUpdate(notificationId,{isRead:true});
        if(!notification){
            return res.status(404).json({error:"Notification not found."});
        }
        return res.status(200).json({
            message:"Read notification."
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error", message:err.message});
    }
}

exports.activeNotify = async(req,res)=>{
    try{
        let selfId = req.user._id;//auth middleware runs before this controller and adds user details to req object which it got from token and database
        let activeNotifications = await Notification.find({receiver:selfId,isRead:false});//returns an array

        return res.status(200).json({
            message:"Notification Number fetched successfully.",
            count: activeNotifications.length
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error:"Server Error", message:err.message});
    }
}