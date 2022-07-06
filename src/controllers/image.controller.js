/* eslint-disable max-len */
const {
  listAllFiles,
} = require('../utils/getFiles');
const Features = require('../models/features');

const getFilesForThumbnail = async (req, res) => {
  try {
    const [images, err] = await listAllFiles({
      searchQuery: 'name: thumbnail AND format=jpg'
    });
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.status(200).send(images);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const getLatestImageForMapLayover = async (req, res) => {
  try {
    const [images, err] = await listAllFiles({
      searchQuery: 'name: thumbnail AND format=jpg'
    });
    if (err) {
      return res.status(500).send(err.message);
    }
    const modifiedImages = await Promise.all(images.map(async (img) => {
      const feature = await Features.findOne({
        id: img?.customMetadata?.id?.replace('field-', '')
      });
      return {
        fieldId: feature.fieldId, bbox: feature.bbox, geometry: feature?.featureCoordinates?.geometry, ...img
      };
    }));
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.status(200).send(modifiedImages);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getFilesForThumbnail,
  getLatestImageForMapLayover,
};
