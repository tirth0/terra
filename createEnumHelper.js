const axios = require('axios');
const fs = require('fs');

const addDistrictEnums = async () => {
    try {
        const districtJson = await axios.get('https://raw.githubusercontent.com/mithunsasidharan/India-Pincode-Lookup/master/pincodes.json');
        console.log(districtJson?.data[0]);

        let PINCODE_TO_STATE = {};
        for (let district of districtJson?.data) 
            PINCODE_TO_STATE[district.pincode] = district.districtName.toLowerCase();
        
        fs.writeFileSync('./src/utils/enum.json', JSON.stringify(PINCODE_TO_STATE))
    }
    catch (err) {
        console.log(err);
    }
}

addDistrictEnums();
