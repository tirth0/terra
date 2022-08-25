const { Router } = require('express');
const {
  groundwaterTableHeightPredictionsController,
  rainfallPredictionsController,
  acceptPincode,
  welcome,
  menu
} = require('../utils/ivrwebhook');

const router = new Router();

// POST: /ivr/welcome
router.post('/welcome', (req, res) => {
  res.send(welcome());
});

// POST: /ivr/menu
router.post('/menu/:pincode', (req, res) => {
  const digit = req.body.Digits;
  const { pincode } = req.params;
  return res.send(menu({ digit, pincode }));
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
  return res.send(acceptPincode(pincode));
});

module.exports = router;
