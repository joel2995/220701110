const ShortUrl = require('../models/ShortUrl');
const generateUniqueShortcode = require('../utils/generateShortcode');

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url) return res.status(400).json({ message: "URL required" });

  let code = shortcode;
  if (code) {
    if (!/^[a-zA-Z0-9]{4,}$/.test(code)) return res.status(400).json({ message: "Invalid shortcode" });
    if (await ShortUrl.findOne({ shortcode: code })) return res.status(409).json({ message: "Shortcode exists" });
  } else {
    code = await generateUniqueShortcode();
  }

  const expiry = new Date(Date.now() + validity * 60000);
  await ShortUrl.create({ originalUrl: url, shortcode: code, expiry });

  res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/${code}`,
    expiry: expiry.toISOString()
  });
};

exports.redirectShortUrl = async (req, res) => {
  const { shortcode } = req.params;
  const shortUrl = await ShortUrl.findOne({ shortcode });
  if (!shortUrl) return res.status(404).json({ message: "Not found" });
  if (shortUrl.expiry < new Date()) return res.status(410).json({ message: "Expired" });

  shortUrl.clicks += 1;
  await shortUrl.save();
  res.redirect(shortUrl.originalUrl);
};

exports.getShortUrlStats = async (req, res) => {
  const { shortcode } = req.params;
  const shortUrl = await ShortUrl.findOne({ shortcode });
  if (!shortUrl) return res.status(404).json({ message: "Not found" });

  res.json({
    originalUrl: shortUrl.originalUrl,
    expiry: shortUrl.expiry,
    clicks: shortUrl.clicks
  });
};