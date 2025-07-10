const express = require("express");
const router = express.Router();
const updateWallpaper = require("../controller/updateWallpaper");

router.post("/update-wallpaper", updateWallpaper);

module.exports = router;