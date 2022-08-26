/* eslint-disable no-unused-vars */
const axios = require('axios');

const cropPredictionBasedOnDistrict = async ({ pincode }) => {
  try {
    const PINCODE_TO_DISTRICT_ENUM = await axios.get('https://raw.githubusercontent.com/tirth0/MiniProjectDatasets/data/enum.json');
    const PREDICTED_VALUES = await axios.get('https://raw.githubusercontent.com/tirth0/MiniProjectDatasets/data/data.json');
    const current_district = PINCODE_TO_DISTRICT_ENUM?.data[pincode];
    const prediction = await axios.get(`${process.env.API_ADDRESS}/predict?district=${current_district}&season=summer`);
    const water_pred = PREDICTED_VALUES?.data[current_district];
    console.log(water_pred);
    return [prediction?.data?.split(','), current_district, water_pred];
  } catch (err) {
    return [err.message, ''];
  }
};

module.exports = cropPredictionBasedOnDistrict;
