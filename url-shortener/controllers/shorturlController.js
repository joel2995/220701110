const ShortUrl = require('../models/ShortUrl');
const generateUniqueShortcode = require('../utils/generateShortcode');

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url) return res.status(400).json({ message: "URL is required" });
    let code = shortcode;
    if (code) {
      if (!/^[a-zA-Z0-9]{4,}$/.test(code)) {
        return res.status(400).json({ message: "Shortcode must be alphanumeric and at least 4 chars" });
      }
      const exists = await ShortUrl.findOne({ shortcode: code });
      if (exists) return res.status(409).json({ message: "Shortcode already exists" });
    } else {
      code = await generateUniqueShortcode();
    }
    const expiry = new Date(Date.now() + validity * 60000);
    const shortUrl = await ShortUrl.create({
      originalUrl: url,
      shortcode: code,
      expiry,
    });
    return res.status(201).json({
      shortLink: `${req.protocol}://${req.get('host')}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getShortUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortcode });
    if (!shortUrl) return res.status(404).json({ message: "Shortcode not found" });
    return res.json({
      originalUrl: shortUrl.originalUrl,
      shortcode: shortUrl.shortcode,
      createdAt: shortUrl.createdAt,
      expiry: shortUrl.expiry,
      clicks: shortUrl.clicks,
      clickDetails: shortUrl.clickDetails,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};