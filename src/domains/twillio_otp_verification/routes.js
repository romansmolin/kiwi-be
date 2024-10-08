const express = require("express");
const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

router.post("/send-otp", async (req, res) => {
  const phoneNumber = req.body.phone;

  try {
    client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" })
      .then((verification) =>
        res.status(200).json({ success: true, sid: verification.sid })
      );
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/verify-otp", (req, res) => {
  const otpCode = req.body.otpCode;
  const phoneNumber = req.body.phone;

  try {
    client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: otpCode })
      .then((verification) => {
        res.status(200).json({ success: true, sid: verification.sid });
      });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
