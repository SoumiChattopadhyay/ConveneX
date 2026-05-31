const express = require('express');
const router = express.Router();
const {createCommunity,getAllCommunities,getCommunity,addMember,createEvent,getUpcomingEvents,getEvent,registerForEvent,verifyPayment} = require('../controller/community.js');
const authMiddleware = require('../middlewares/auth.js');

router.post("/createCommunity",authMiddleware.auth,createCommunity);
router.get("/getAllCommunities",getAllCommunities);
router.get("/getCommunity/:communityId",authMiddleware.auth,getCommunity);
router.post("/:communityId/addMember",authMiddleware.auth,authMiddleware.isMember,addMember);
router.post("/:communityId/createEvent",authMiddleware.auth,authMiddleware.isMember,createEvent);
router.get("/:communityId/getAllEvents", getUpcomingEvents);
router.get("/:communityId/event/:eventId",getEvent);
router.post("/:communityId/event/:eventId/form/:formId",authMiddleware.auth,registerForEvent);
router.post("/community/event/:eventId/verifyPayment",authMiddleware.auth,verifyPayment);

module.exports=router;