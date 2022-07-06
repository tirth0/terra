const express = require('express');

const router = express.Router();
const {
  getFilesForThumbnail,
  getLatestImageForMapLayover,
} = require('../controllers/image.controller');

router.get('/getAllFields/', getFilesForThumbnail);
router.get('/getFieldsForMap/', getLatestImageForMapLayover);

module.exports = router;
