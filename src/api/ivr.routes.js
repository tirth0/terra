const { Router } = require('express');
const {
  groundwaterTableHeightPredictionsController,
  rainfallPredictionsController,
  acceptPincode,
  welcome,
  menu
} = require('../utils/ivrwebhook');
const bulkSms = require('../utils/bulkSms');
const cropPredictionHelper = require('../utils/cropPrediction');

const router = new Router();

// POST: /ivr/welcome
router.post('/welcome', (req, res) => {
  res.send(welcome());
});

// POST: /ivr/menu
router.post('/menu/:pincode', async (req, res) => {
  const digit = req.body.Digits;
  const { pincode } = req.params;

  const [prediction, current_district, water_pred] = await cropPredictionHelper({ pincode });

  return res.send(menu({
    digit, pincode, prediction, current_district, water_pred
  }));
});

// POST: /ivr/rainfall-predictions/:pincode
router.post('/rainfall-predictions/:pincode', (req, res) => {
  const digit = req.body.Digits;
  const { pincode } = req.params;
  return res.send(rainfallPredictionsController({ digit, pincode }));
});

// POST: /ivr/groundwater-predictions/:pincode
router.post('/groundwater-predictions/:pincode', (req, res) => {
  const digit = req.body.Digits;
  const { pincode } = req.params;

  return res.send(groundwaterTableHeightPredictionsController({ digit, pincode }));
});

// POST: accept pincode

router.post('/pincode', (req, res) => {
  const pincode = req.body.Digits;
  console.log(pincode);
  return res.send(acceptPincode({ pincode }));
});

router.get('/sendBulkSMS', bulkSms);

module.exports = router;
