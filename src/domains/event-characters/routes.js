const express = require('express');
const router = express.Router();
const characters = require('./model')

router.get("/all-characters", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const total = characters.length;
        const totalPages = Math.ceil(characters.length / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        results.results = characters.slice(startIndex, endIndex);

        // We kind of receiving data from DB
        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            total, 
            totalPages,
            characters: results
        })
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch characters: ', err })
    }
})

module.exports = router