/* eslint-disable space-unary-ops */
const { VoiceResponse } = require('twilio').twiml;

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const twiml = new VoiceResponse();

  twiml.say('Returning to the main menu', {
    voice: 'alice',
    language: 'en-GB',
  });

  twiml.redirect('/api/v1/ivr/welcome');

  return twiml.toString();
}

const welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/api/v1/ivr/pincode',
    numDigits: '6',
    method: 'POST',
  });

  gather.say('Thanks for calling the soil service'
    + 'Please enter your pincode', { loop: 3 });

  return voiceResponse.toString();
};

const acceptPincode = ({ pincode }) => {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: `/api/v1/ivr/menu/${pincode}`,
    numDigits: '1',
    method: 'POST',
  });
  gather.say(
    'Thanks for calling the Soil Service'
        + 'Please press 1 for rainfall predictions'
        + 'Press 2 for groundwater table height predictions',
    + 'Press 3 for farm health',
    + 'Press 4 for farm insights',
    { loop: 3 }
  );

  return voiceResponse.toString();
};

const rainfallPredictions = ({ pincode }) => {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: `/api/v1/ivr/rainfall-predictions/${pincode}`,
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'Thanks for calling the Soil Service'
      + 'Please press 1 for state wise prediction'
      + 'Press 2 for district-wise prediction'
      + 'Press 3 for block-wise prediction',
    { loop: 3 }
  );

  return voiceResponse.toString();
};

const rainfallPredictionsController = () => {
  redirectWelcome();
};

const groundwaterTableHeightPredictions = ({ pincode }) => {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: `/api/v1/ivr/groundwater-predictions/${pincode}`,
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'Thanks for calling the Soil Service'
        + 'Please press 1 for state wise prediction'
        + 'Press 2 for district-wise prediction'
        + 'Press 3 for block-wise prediction',
    { loop: 3 }
  );

  return voiceResponse.toString();
};

const groundwaterTableHeightPredictionsController = () => {
  redirectWelcome();
};

const menu = function menu({ digit, pincode }) {
  const optionActions = {
    1: rainfallPredictions,
    2: groundwaterTableHeightPredictions,
    // 3: farmHealth,
    // 4: farmInsights,
  };

  return (optionActions[digit])
    ? optionActions[digit]({ pincode })
    : redirectWelcome();
};

module.exports = {
  groundwaterTableHeightPredictionsController,
  rainfallPredictionsController,
  acceptPincode,
  welcome,
  menu
};
