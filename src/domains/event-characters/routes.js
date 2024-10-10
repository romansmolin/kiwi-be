const express = require("express");
const router = express.Router();

const Character = require("./model");

router.get("/all-characters", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const language = req.query.lang;

    const characters = await Character.find();

    const formattedCharacters = characters.map((character) => ({
      name: character.name[language],
      description: character.description[language],
      image: character.image,
      availableInUK: character.availableInUK,
      id: character._id,
    }));

    const total = formattedCharacters.length;
    const totalPages = Math.ceil(formattedCharacters.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    results.results = formattedCharacters.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      total,
      totalPages,
      characters: results,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch characters: ", err });
  }
});

router.post("/create-character", async (req, res) => {
  const token = req.cookies.authToken;
  const newCharacterData = req.body;

  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const newCharacter = new Character(newCharacterData);
    await newCharacter.save();
    res.status(201).json({
      success: true,
      message: "Character created successfully!",
      character: newCharacter,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to create characters: ", err });
  }
});

router.delete("/character/:id", async (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const characterId = req.params.id;
    console.log("characterId: ", characterId);
    const deletedCharacter = await Character.findByIdAndDelete(characterId);

    if (!deletedCharacter) {
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });
    }

    res.status(200).json({
      success: true,
      message: "Character deleted successfully",
      character: deletedCharacter,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to delete character",
      details: err.message,
    });
  }
});

router.patch("/character/:id/available-in-uk", async (req, res) => {
  const token = req.cookies.authToken;
  console.log("token: ", token);
  // If there's no token, return immediately after sending a 401 response
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const characterId = req.params.id;
    const character = await Character.findById(characterId);

    // Update character to make it available in the UK
    const updatedCharacter = await Character.updateOne(
      { _id: characterId },
      { $set: { availableInUK: !character.availableInUK } }
    );

    // If the character is not found, send a 404 response
    if (updatedCharacter.nModified === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });
    }

    // Successful update response
    return res.status(200).json({
      success: true,
      message: "Character updated successfully",
      character: updatedCharacter,
    });
  } catch (err) {
    // Catch any error and send a 500 error response
    return res.status(500).json({
      success: false,
      error: "Failed to update character",
      details: err.message,
    });
  }
});

module.exports = router;
