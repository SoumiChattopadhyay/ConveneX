const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const notificationController = require("../controller/notification");

router.get("/",authMiddleware.auth,notificationController.getNotifications);
router.put("/updateIsRead",authMiddleware.auth,notificationController.updateRead);
router.get("/activeNotifications",authMiddleware.auth,notificationController.activeNotify);

module.exports = router;