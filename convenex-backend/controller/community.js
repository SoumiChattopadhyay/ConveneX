const Community = require("../models/Community.js");
const Conversation = require("../models/Conversation.js");
const Event = require("../models/Event.js");
const Form = require("../models/Form.js");
const Registration = require("../models/Registration.js");
const User = require("../models/User.js");
const razorpay = require('../utils/razorpay.js');

exports.createCommunity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, tagline, description, category, logo, bannerImage, visibility, socialLinks, tags } = req.body;
        const community = await Community.create({ createdBy: userId, name, email, tagline, description, admins: [userId], members: [userId], category, logo, bannerImage, visibility, socialLinks, tags });
        if (!community) {
            return res.status(400).json("Something went wrong!");
        }
        const conversation = await Conversation.create({
            type: "community",
            members: [userId],
            community: community._id
        });
        if (!conversation) {
            return res.status(400).json("Something went wrong!");
        }

        community.conversation = conversation._id;
        await community.save();

        return res.status(201).json({
            message: "Community created successfully",
            community: community
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
};

exports.getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find({});
        return res.status(200).json({
            message: "All Communities fetched successfully",
            communities: communities
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
};

exports.getCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const community = await Community.findById(communityId).populate("members");
        if (!community) {
            return res.status(404).json("Community doesnt exist!");
        }
        return res.status(200).json({
            message: "Community fetched successfully",
            community: community
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const userId = req.user._id;
        const { communityId } = req.params;
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json("Community doesnt exist!");
        }
        // community.members.push(userId);//same user might be pushed multiple times
        await Community.findByIdAndUpdate(
            communityId,
            {
                $addToSet: {
                    members: userId
                }
            }
        );
        await Conversation.findOneAndUpdate(
            { community: communityId },
            {
                $addToSet: {
                    members: userId
                }
            });
        return res.status(200).json({ message: "Member added!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.createEvent = async (req, res) => {
    try {
        const id = req.user._id;
        const { communityId } = req.params;
        const { payload, fields } = req.body;
        const { name, description, category, mode, startDateTime, endDateTime, location, venueDetails, meetingLink, entryFee, bannerImage, tags } = payload;
        const newForm = await Form.create({ fields });
        if (!newForm) {
            return res.status(400).json("Couldn't create Registration Form & Event!");
        }
        const newEvent = await Event.create({ name, organizer: id, community: communityId, description, category, mode, startDateTime, endDateTime, location, venueDetails, meetingLink, entryFee, bannerImage, tags, formId: newForm._id });
        if (!newEvent) {
            return res.status(400).json("Couldn't create Event!");
        }
        newForm.eventId = newEvent._id;
        await newForm.save();
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json("Community doesnt exist!");
        }
        await Community.findByIdAndUpdate(
            communityId,
            {
                $addToSet: {
                    events: newEvent._id
                }
            }
        );
        return res.status(201).json({
            message: "Event created successfully",
            event: newEvent
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.getUpcomingEvents = async (req, res) => {
    try {
        const { communityId } = req.params;
        const events = await Event.find({
            community: communityId
        }).populate("community");
        const upComingEvents = events.filter(
            (event) => event.type === "upcoming"
        );
        return res.status(200).json({
            message: "Events fetched successfully",
            events: upComingEvents
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.getEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId).populate("formId").populate("organizer");
        return res.status(200).json({
            message: "Event fetched successfully",
            event: event
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}

exports.registerForEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { communityId, eventId, formId } = req.params;
        const { answers } = req.body;

        const existingRegistration =
            await Registration.findOne({
                user: userId,
                event: eventId
            });

        if (existingRegistration) {

            return res.status(400).json({
                error: "Already registered"
            });
        }

        const newRegistration = await Registration.create({
            user: userId,
            event: eventId,
            answers: answers
        });

        const event = await Event.findById(eventId);
        const user = await User.findById(userId);

        await Event.findByIdAndUpdate(
            eventId,
            {
                $addToSet: {
                    attendees: userId
                }
            }
        );
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    registeredEvents: eventId
                }
            }
        );

        if (event.entryFee === 0) {
            return res.status(201).json({
                message: "Registered Successfully",
                registration: newRegistration
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: event.entryFee * 100,
            currency: "INR",
            receipt: newRegistration._id.toString()
        });
        return res.status(201).json({
            message: "Registered for Event!",
            registration: newRegistration,
            razorpayOrder
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
};

exports.verifyPayment = async(req,res)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id,razorpay_signature} = req.body;
        const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_API_KEY_SECRET).update(body).digest('hex');
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json("error", "Payment verification failed");
        }
    }catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error", message: err.message });
    }
}