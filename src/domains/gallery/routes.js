const express = require("express");
const router = express.Router();

const Gallery = require("./model");
const { message } = require("statuses");

router.get("/all-images", async (req, res) => {
  try {
    const gallery = await Gallery.find();

    return res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `Error while getting galler: ${err}` });
  }
});

router.post("/image", async (req, res) => {
  const { imageUrl } = req.body;
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const newImage = new Gallery({
      image: imageUrl,
    });

    await newImage.save();

    return res
      .status(200)
      .json({ success: true, message: "Image added successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error while adding image in gallery: ${err}`,
    });
  }
});

router.delete("/image/:id", async (req, res) => {
  const token = req.cookies.authToken;
  const photoId = req.params.id;

  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const deletedPhoto = await Gallery.findByIdAndDelete(photoId);

    if (!deletedPhoto) {
      return res
        .status(404)
        .json({ success: false, message: "Photo not found" });
    }

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
      photo: deletedPhoto,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: `Cannot delete photo: ${err}` });
  }
});

module.exports = router;
