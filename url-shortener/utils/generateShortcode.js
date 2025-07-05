const { customAlphabet } = require('nanoid');
const ShortUrl = require('../models/ShortUrl');
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

async function generateUniqueShortcode() {
  let code, exists;
  do {
    code = nanoid();
    exists = await ShortUrl.findOne({ shortcode: code });
  } while (exists);
  return code;
}

module.exports = generateUniqueShortcode;