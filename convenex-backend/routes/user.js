const express = require('express');
const router = express.Router();
const userController = require("../controller/user.js");
const authMiddleware = require("../middlewares/auth.js");

router.post("/register",userController.register);
router.post("/login",userController.login);
router.post("/google",userController.loginThroughGmail);

router.put("/update",authMiddleware.auth,userController.updateUser);
router.get("/user/:id",userController.getProfileById);
router.post("/logout",authMiddleware.auth,userController.logout);

router.get("/self",authMiddleware.auth,(req,res)=>{//first auth middleware check if browser has cookies and if present then it validates if it is the same token that server sent to client during login and if validation is successful then only that api endpoint is fetched and given to user(client)
    return res.status(200).json({
        user: req.user
    });
});

router.get("/findUser",authMiddleware.auth,userController.findUser);//search bar 
router.post("/sendFriendReq",authMiddleware.auth,userController.sendFriendReq);
router.post("/acceptFriendReq",authMiddleware.auth,userController.acceptFriendReq);
router.get("/friendList",authMiddleware.auth,userController.getFriendList);
router.get("/pendingFriendsList",authMiddleware.auth,userController.getPendingFriendsList);
router.delete("/removeFromFriendList/:friendId",authMiddleware.auth,userController.removeFromFriendList);

router.post("/user/profile-view/:userId",authMiddleware.auth,userController.updateUserProfileViews);

router.get("/google-calendar/connect",authMiddleware.auth,userController.connectGoogleCalendar);
router.get("/google-calendar/callback",authMiddleware.auth,userController.googleCalendarCallback);

module.exports=router;