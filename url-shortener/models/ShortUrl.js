const mongoose = require("mongoose");

const clickDetailSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  ip: String,
  location: String,
});

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String,
     required: true },
  shortcode: { type: String,
     required: true,
      unique: true },
  createdAt: { type: Date, 
    default: Date.now },
  expiry: { type: Date,
     required: true },
  clicks: { type: Number,
     default: 0 },
  clickDetails: [clickDetailSchema],
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);