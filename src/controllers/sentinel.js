const { S2L2ALayer, AcquisitionMode, Polarization, Resolution, ApiType, BBox, CRS_EPSG4326, MimeTypes } = require('@sentinel-hub/sentinelhub-js');
const fs = require('fs')
const path = require('path')


const getImage = async (req, res) => {
    try{
        let ndvi = fs.readFileSync(path.join(__dirname,'../utils/ndvi.evalscript.js'));
        let requestsConfig = {
            authToken: req.authToken
        }
        const layerS2L2A = new S2L2ALayer({
            evalscript: ndvi,
            layerId: process.env.layerID,
            title: 'S2L2AImage',
            description: 'fetching images from s2l2a instance',
            acquisitionMode: AcquisitionMode.IW,
            polarization: Polarization.DV,
            resolution: Resolution.HIGH,
            maxCloudCoverPercent: 30,
        });
        const bbox = new BBox(CRS_EPSG4326, 18, 20, 20, 22);
        const getMapParams = {
          bbox: bbox,
          fromTime: new Date(Date.UTC(2018, 11 - 1, 22, 0, 0, 0)),
          toTime: new Date(Date.UTC(2018, 12 - 1, 22, 23, 59, 59)),
          width: 512,
          height: 512,
          format: MimeTypes.JPEG,
        };
        const image2 = layerS2L2A.getMap(getMapParams, ApiType.PROCESSING, requestsConfig);
        res.contentType('image/jpeg');
        res.send(image2);
    }
    catch(err){
        // console.log(err.message);
        res.status(500)
    }
}

module.exports = {
    getImage
}