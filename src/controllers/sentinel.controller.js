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
const turf = require('@turf/turf');
const { ndviTiff, ndviJpeg } = require('../utils/ndvi.evalscript');
const addFile = require('../utils/addFile');
const transform = require('../utils/transformCoordinates');
const fetchImages = require('../helpers/fetchImages');
const Features = require('../models/features');

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

    let fieldDetails = req.body;
    const feature = fieldDetails?.[0];
    const bbox = turf.bbox(feature?.geometry);
    console.log(bbox);
    if (!feature) {
      return res.status(400).send('No field details provided');
    }
    const featureToBeAdded = {
      fieldId: feature.id,
      bbox,
      featureCoordinates: feature
    };

    // save feature to mongodb
    const featureToBeAddedToDb = new Features(featureToBeAdded);
    await featureToBeAddedToDb.save();

    res.status(200).json({ msg: 'Field Updated, generating images from satellite service', data: featureToBeAdded });
    let fromTime = new Date(Date.UTC(2021, 11 - 1, 22, 0, 0, 0));
    let toTime = new Date(Date.UTC(2021, 12 - 1, 22, 0, 0, 0));
    await fetchImages({
      geometry: feature?.geometry,
      bbox: new BBox(CRS_EPSG4326, ...bbox),
      fromTime,
      toTime,
      requestsConfig,
      folder: `field-${feature.id}`

    });
  } catch (err) {
    console.log('An error occurred', err);
    return res.status(500).send(err.message);
  }
};

const getFieldStatistics = async (req, res) => {
  try {
    const requestsConfig = {
      authToken: req.authToken,
    };
    const { fieldId } = req.params;
    const field = await Features.findOne({ fieldId });
    if (!field) {
      return res.status(404).send('Field not found');
    }
    const { bbox } = field;

    const layerS2L2ATiff = new S2L2ALayer({
      evalscript: ndviTiff,
      layerId: process.env.layerID,
      title: 'S2L2AImage',
      description: 'fetching images from s2l2a instance',
      acquisitionMode: AcquisitionMode.IW,
      polarization: Polarization.DV,
      resolution: Resolution.HIGH,
    });

    const stats = await layerS2L2ATiff.getStats({
      geometry: (new BBox(CRS_EPSG4326, ...bbox)).toGeoJSON(),
      fromTime: new Date(Date.UTC(2021, 11 - 1, 22, 0, 0, 0)),
      toTime: new Date(Date.UTC(2021, 12 - 1, 22, 23, 59, 59)),
      resolution: 2,
      requestsConfig,
    });

    return res.status(200).send(stats);
  } catch (err) {
    console.log('An error occurred', err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getImage,
  saveField,
  getFieldStatistics
};
