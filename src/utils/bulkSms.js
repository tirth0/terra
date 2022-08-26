/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const Users = require('../models/User');
const cropPredictionHelper = require('./cropPrediction');

const getBody = async (user) => {
  try {
    const [prediction, current_district, water_pred] = await cropPredictionHelper({ pincode: user.pin });
    const SHOULD_IRRIGATE = water_pred?.rainfall < 130;
    const SHOULD_CONSERVE = water_pred?.['Net Ground Water Availability for future use'] < 50000;
    const danger = SHOULD_IRRIGATE && SHOULD_CONSERVE;
    const data = `
        Hello ${user.name},
        Your prediction for ${current_district} is ${prediction[0]}, ${prediction[1]}, ${prediction[2]} given the soil water, rainfall, and surface/ground water availabilty in your region.
        
        ${danger
    ? 'Your surface/ground water availability is low and rainfall prediction for the next six months is below average. Consider switching crops as per our recommendations or consider choosing sustainable irrigation methods like Drip irrigation.'
    : SHOULD_IRRIGATE
      ? 'Your surface/ground water availability is good and rainfall prediction for the next six months is below average. Consider irrigating using artificial means using ground or surface water.'
      : 'Your surface/ground water availability is reducing but rainfall prediction for the next six months is above average. Consider saving groundwater by relying on rain.'
}
    `;
    return data;
  } catch (err) {
    return err.message;
  }
};

const bulkSmsUsers = async (req, res) => {
  try {
    const users = await Users.find({}).select({
      name: 1, _id: 0, mobile: 1, district: 1, pin: 1
    });

    const promises = users.map(async (user) => {
      console.log('USER', user);
      const body = await getBody(user);
      return twilio.messages.create({
        body,
        to: `+91${user.mobile}`,
        from: process.env.TWILIO_MESSAGING_SERVICE_SID
      });
    });
    await Promise.all(promises);

    return res.status(200).send('successfully sent messages');
  } catch (err) {
    console.log(err);
    return res.status(500).send('error ');
  }
};

module.exports = bulkSmsUsers;
