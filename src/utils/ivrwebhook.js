/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
/* eslint-disable space-unary-ops */
const { VoiceResponse } = require('twilio').twiml;
const cropPredictionHelper = require('./cropPrediction');
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
        + 'Please press 1 for crop predictions'
        + 'Press 2 for groundwater table height predictions',
    + 'Press 3 for rainfall predictions',
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

const waterPredictionsController = (context) => {
  try {
    const voiceResponse = new VoiceResponse();
    voiceResponse.say('Hello, here is your prediction');

    const { prediction, current_district, water_pred } = context;
    const SHOULD_IRRIGATE = water_pred?.rainfall < 130;
    const SHOULD_CONSERVE = water_pred?.['Net Ground Water Availability for future use'] < 50000;
    const danger = SHOULD_IRRIGATE && SHOULD_CONSERVE;
    const data = `
        Hello,
        Your prediction for ${current_district} is ${prediction[0]}, ${prediction[1]}, ${prediction[2]} given the soil water, rainfall, and surface/ground water availabilty in your region.
        
        ${danger
    ? 'Your surface/ground water availability is low and rainfall prediction for the next six months is below average. Consider switching crops as per our recommendations or consider choosing sustainable irrigation methods like Drip irrigation.'
    : SHOULD_IRRIGATE
      ? 'Your surface/ground water availability is good and rainfall prediction for the next six months is below average. Consider irrigating using artificial means using ground or surface water.'
      : 'Your surface/ground water availability is reducing but rainfall prediction for the next six months is above average. Consider saving groundwater by relying on rain.'
}`;
    voiceResponse.say(data, { loop: 3 });
    voiceResponse.say('Thank you for using the soil service');
    voiceResponse.hangup();
    return voiceResponse.toString();
  } catch (err) {
    console.log(err);
    return err;
  }
};

function cropPredictionController(context) {
  const voiceResponse = new VoiceResponse();
  try {
    console.log(context);
    voiceResponse.say('Hello, here is your prediction');

    const { prediction, current_district, water_pred } = context;
    voiceResponse.say(`The crop prediction for ${current_district} is ${prediction[0]}, ${prediction[1]}, ${prediction[2]}`, { loop: 3 });
    voiceResponse.say('Thank you for using the soil service');

    voiceResponse.hangup();
    return voiceResponse.toString();
  } catch (err) {
    console.log(err);
    return err;
  }
}

const menu = function menu(context) {
  const optionActions = {
    1: cropPredictionController,
    2: waterPredictionsController,
    // 4: farmInsights,
  };
  console.log(context);
  return (optionActions[context.digit])
    ? optionActions[context.digit](context)
    : redirectWelcome();
};

module.exports = {
  waterPredictionsController,
  rainfallPredictionsController,
  acceptPincode,
  welcome,
  menu
};
