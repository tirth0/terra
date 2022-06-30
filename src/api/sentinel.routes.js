const express =  require('express');
const router = express.Router();
const { authMiddleware }= require('../middlewares');
const { getImage } = require('../controllers/sentinel')

router.get('/image/', authMiddleware, getImage);

module.exports = router;
