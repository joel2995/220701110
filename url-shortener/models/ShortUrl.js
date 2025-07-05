const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  clicks: { type: Number, default: 0 }
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);