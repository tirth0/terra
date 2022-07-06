const express = require('express');

const router = express.Router();
const { authMiddleware } = require('../middlewares');
const { getImage, saveField, getFieldStatistics } = require('../controllers/sentinel.controller');

router.get('/image/', authMiddleware, getImage);
router.post('/field/', authMiddleware, saveField);
router.get('/stats/:fieldId', authMiddleware, getFieldStatistics);

module.exports = router;
