const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    lv: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    lv: { type: String, required: true },
  },
  image: {
    type: String,
    required: true,
  },
  availableInUK: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Character", CharacterSchema);
