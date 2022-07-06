const express = require('express');

const router = express.Router();
const { authMiddleware } = require('../middlewares');
const { getImage, saveField } = require('../controllers/sentinel.controller');

router.get('/image/', authMiddleware, getImage);
router.post('/field/', authMiddleware, saveField);

module.exports = router;
