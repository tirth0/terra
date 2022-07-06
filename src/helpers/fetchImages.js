/* eslint-disable max-len */
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
const getMonth = require('../utils/getMonth');

const fetchImages = async ({
  geometry,
  requestsConfig,
  bbox = new BBox(CRS_EPSG4326, 18.3, 20.1, 18.7, 20.4),
  fromTime,
  toTime,
  folder,
}) => {
  try {
    const coordinates = geometry?.coordinates?.[0]?.map((elem, ind) => [elem[0], elem[1]]);
    const polygon = {
      type: 'Polygon',
      coordinates: [coordinates]
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

    const getMapParamsTiff = {
      bbox,
      width: 512,
      height: 512,
      format: 'image/tiff',
      geometry: polygon
    };

    const getMapParamsJpeg = {
      bbox,
      width: 512,
      height: 512,
      format: 'image/jpeg',
      geometry: polygon
    };

    const flyovers = await layerS2L2ATiff.findFlyovers(bbox, fromTime, toTime);
    const datesMap = flyovers?.map((flyover) => {
      const date = flyover.fromTime.toUTCString().split(' ');
      const times = date[4].split(':');
      return [
        new Date(Date.UTC(parseInt(date[3]), getMonth(date[2]) - 1, parseInt(date[1]), parseInt(times[0]), parseInt(times[1]), parseInt(times[2]), 00)),
        new Date(Date.UTC(parseInt(date[3]), getMonth(date[2]), parseInt(date[1]), parseInt(times[0]), parseInt(times[1]), parseInt(times[2]), 59))
      ];
    });

    const tiffPromises = datesMap.map(([fromTime, toTime]) => {
      getMapParamsTiff.fromTime = fromTime;
      getMapParamsTiff.toTime = toTime;
      return layerS2L2ATiff.getMap(getMapParamsTiff, ApiType.PROCESSING, requestsConfig);
    });

    const jpegPromises = datesMap.map(([fromTime, toTime]) => {
      getMapParamsJpeg.fromTime = fromTime;
      getMapParamsJpeg.toTime = toTime;
      return layerS2L2AJpeg.getMap(getMapParamsJpeg, ApiType.PROCESSING, requestsConfig);
    });

    // convert all tiff responses to base64 and store it to imagekit
    let errcount = 0; let
      successcount = 0;
    let tiffid = 0;
    const tiffResponses = await Promise.all(tiffPromises);
    for (const tiffResponse of tiffResponses) {
      const tiffBase64 = tiffResponse.toString('base64');
      let tiffFileName = `${datesMap[tiffid]}.tiff`;
      if (tiffid === tiffResponses.length - 1) tiffFileName = `thumbnail` + tiffFileName;
      tiffid++;
      const [response, err] =	await addFile({ file: tiffBase64, folder: `${folder}-tiff`, fileName: tiffFileName, customMetadata : JSON.stringify({
          field_id: folder
        }) 
      });
      if (err) {
        console.log('Error occured while storing tiff file', err);
        errcount++;
      } else successcount++;
    }
    let jpegid =0;
    const jpegResponses = await Promise.all(jpegPromises)
    for (const jpegResponse of jpegResponses) {
      let jpegFileName = `${datesMap[jpegid]}.jpeg`;
      if (jpegid === jpegResponses.length - 1) jpegFileName = `thumbnail` + jpegFileName;
      jpegid++;
      const [response, err] = await addFile({ file: jpegResponse, folder: `${folder}-jpeg`, fileName: jpegFileName, customMetadata: JSON.stringify({
          field_id: folder
        }) 
      });
      if (err) {
        console.log('Error occured while storing jpeg file', err);
        errcount++;
      } else successcount++;
    }

    console.log(`${successcount} files successfully uploaded`);
    console.log(`${errcount} files failed to upload`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = fetchImages;
