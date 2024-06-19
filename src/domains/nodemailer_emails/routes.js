const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

const targetEmail = process.env.NODEMAILER_TARGET_EMAIL;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_EMAIL_PASS,
    },
});

router.post("/send-email", async (req, res) => {
    try {
        const {
            nameOfKid,
            ageOfKid,
            numberOfKids,
            desiredCharacter,
            phoneNumber,
            date
        } = req.body;

        const htmlContent = generateEmailTemplate({
            nameOfKid,
            ageOfKid,
            numberOfKids,
            desiredCharacter,
            phoneNumber,
            date
        });

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: targetEmail,
            subject: `New Event Request ${req.body.nameOfKid}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            info: info.response
        });
    } catch (err) {
        console.error('Error sending email:', err); 
        res.status(500).json({ success: false, error: `Failed to send email: ${err}` });
    }
});

const generateEmailTemplate = ({ nameOfKid, ageOfKid, numberOfKids, desiredCharacter, phoneNumber, date }) => {
    return `
        <html>
            <body>
                <h1>Kid’s Event Information</h1>
                <p><strong>Name of Kid:</strong> ${nameOfKid || 'Not provided'}</p>
                <p><strong>Age of Kid:</strong> ${ageOfKid !== undefined ? ageOfKid : 'Not provided'}</p>
                <p><strong>Number of Kids:</strong> ${numberOfKids !== undefined ? numberOfKids : 'Not provided'}</p>
                <p><strong>Desired Character:</strong> ${desiredCharacter || 'Not provided'}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber || 'Not provided'}</p>
                <p><strong>Date:</strong> ${date ? new Date(date).toLocaleDateString() : 'Not provided'}</p>
            </body>
        </html>
    `;
}

module.exports = router