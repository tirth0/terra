const express = require('express');

const emojis = require('./emojis');
const sentinel = require('./sentinel.routes');
const image = require('./image.routes');
const ivr = require('./ivr.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/sentinel', sentinel);
router.use('/images/', image);
router.use('/ivr', ivr);

module.exports = router;
