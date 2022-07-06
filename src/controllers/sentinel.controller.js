/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const {
  S2L2ALayer,
  AcquisitionMode,
  Polarization,
  Resolution,
  ApiType,
  BBox,
  CRS_EPSG4326,
  MimeTypes,
} = require('@sentinel-hub/sentinelhub-js');
const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const { ndviTiff, ndviJpeg } = require('../utils/ndvi.evalscript');
const addFile = require('../utils/addFile');
const transform = require('../utils/transformCoordinates');
const fetchImages = require('../helpers/fetchImages');

const getImage = async (req, res) => {
  try {
    const requestsConfig = {
      authToken: req.authToken,
    };
    const layerS2L2ATiff = new S2L2ALayer({
      evalscript: ndviTiff,
      layerId: process.env.layerID,
      title: 'S2L2AImage',
      description: 'fetching images from s2l2a instance',
      acquisitionMode: AcquisitionMode.IW,
      polarization: Polarization.DV,
      resolution: Resolution.HIGH,
    });

    const layerS2L2AJpeg = new S2L2ALayer({
      evalscript: ndviJpeg,
      layerId: process.env.layerID,
      title: 'S2L2AImage',
      description: 'fetching images from s2l2a instance',
      acquisitionMode: AcquisitionMode.IW,
      polarization: Polarization.DV,
      resolution: Resolution.HIGH,
    });

    const bbox = new BBox(CRS_EPSG4326, 18, 20, 20, 22);

    const getMapParamsTiff = {
      bbox,
      fromTime: new Date(Date.UTC(2018, 11 - 1, 22, 0, 0, 0)),
      toTime: new Date(Date.UTC(2018, 12 - 1, 22, 23, 59, 59)),
      width: 512,
      height: 512,
      format: 'image/tiff',
    };

    const getMapParamsJpeg = {
      bbox,
      fromTime: new Date(Date.UTC(2018, 11 - 1, 22, 0, 0, 0)),
      toTime: new Date(Date.UTC(2018, 12 - 1, 22, 23, 59, 59)),
      width: 512,
      height: 512,
      format: 'image/jpeg',
    };

    const imageTiff = await layerS2L2ATiff.getMap(getMapParamsTiff, ApiType.PROCESSING, requestsConfig);
    const imageJpeg = await layerS2L2AJpeg.getMap(getMapParamsJpeg, ApiType.PROCESSING, requestsConfig);
    const [imageKitResponse1, imageKitError1] = await addFile({
      file: imageTiff.toString('base64'),
      folder: 's2l2a-tiff',
      fileName: `${nanoid()}.tiff`,
    });
    if (imageKitError1) {
      return res.status(500).send(imageKitError1.message);
    }
    const [imageKitResponse2, imageKitError2] = await addFile({
      file: imageJpeg,
      folder: 's2l2a-jpg',
      fileName: `${nanoid()}.jpeg`,
    });

    if (imageKitError2) {
      return res.status(500).send(imageKitError2.message);
    }

    return res.status(200).send('Content Downloaded');
  } catch (err) {
    console.log('An error occurred', err);
    return res.status(500).send(err.message);
  }
};

const saveField = async (req, res) => {
  try {
    const requestsConfig = {
      authToken: req.authToken,
    };

    console.log(req.body);
    let { geometry } = req.body;
    res.status(200).send('Field Updated, generating images from satellite service');
    // fromTime = new Date(Date.UTC(2019, 11 - 1, 22, 0, 0, 0));
    // toTime = new Date(Date.UTC(2022, 12 - 1, 22, 0, 0, 0));
    // await fetchImages({
    //   geometry,
    //   fromTime,
    //   toTime,
    //   requestsConfig,

    // });
  } catch (err) {
    console.log('An error occurred', err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getImage,
  saveField
};
