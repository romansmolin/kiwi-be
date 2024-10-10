const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || "";

router.post("", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for username and password
    if (username !== "admin" || password !== "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Sign the token
    const token = jwt.sign(
      {
        username,
      },
      jwtSecret,
      {
        expiresIn: "3h",
      }
    );

    // Serialize the cookie
    const serialized = cookie.serialize("authToken", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 60 * 60, // 3 hours in seconds
      path: "/",
    });

    // Set the cookie
    res.setHeader("Set-Cookie", serialized);

    // Send response
    res.status(200).json({ success: true, message: "Authenticated" });
  } catch (err) {
    console.error("Error during the authentication process:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
