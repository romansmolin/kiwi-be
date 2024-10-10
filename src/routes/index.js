const express = require("express");
const router = express.Router();

const emailRoutes = require("../domains/nodemailer_emails");
const twillioRoutes = require("../domains/twillio_otp_verification");
const charactersRoutes = require("../domains/event-characters");
const sessionRoutes = require("../domains/session");

router.use("/mail", emailRoutes);
router.use("/otp_verification", twillioRoutes);
router.use("/characters", charactersRoutes);
router.use("/sign-in", sessionRoutes);

module.exports = router;
