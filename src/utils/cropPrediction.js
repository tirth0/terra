const axios = require('axios')

const cropPredictionBasedOnDistrict = async ({pincode}) => {
    try {
        const PINCODE_TO_DISTRICT_ENUM = await axios.get('https://raw.githubusercontent.com/tirth0/MiniProjectDatasets/data/enum.json');
        const PREDICTED_VALUES = await axios.get('https://raw.githubusercontent.com/tirth0/MiniProjectDatasets/data/data.json');
        const current_district = PINCODE_TO_DISTRICT_ENUM?.data[pincode];
        const predicted_result = PREDICTED_VALUES?.data[current_district];
        
        return predicted_result;
    }
    catch(err) {
        console.log(err);
    }
}

// cropPredictionBasedOnDistrict({ pincode: '522001' });

module.exports = cropPredictionBasedOnDistrict;