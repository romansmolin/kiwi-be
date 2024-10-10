const express = require("express");
const router = express.Router();

const emailRoutes = require("../domains/nodemailer_emails");
const twillioRoutes = require("../domains/twillio_otp_verification");
const charactersRoutes = require("../domains/event-characters");
const sessionRoutes = require("../domains/session");
const galleryRoutes = require("../domains/gallery");

router.use("/mail", emailRoutes);
router.use("/otp_verification", twillioRoutes);
router.use("/characters", charactersRoutes);
router.use("/sign-in", sessionRoutes);
router.use("/gallery", galleryRoutes);

module.exports = router;
