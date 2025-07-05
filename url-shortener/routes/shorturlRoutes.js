const express = require('express');
const router = express.Router();
const c = require('../controllers/shorturlController');

router.post('/shorturls', c.createShortUrl);
router.get('/shorturls/:shortcode', c.getShortUrlStats);
router.get('/:shortcode', c.redirectShortUrl);

module.exports = router;