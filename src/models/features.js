const mongoose = require('mongoose');

const { Schema } = mongoose;

const coordinateSchema = new Schema({
  type: String,
  geometry: {
    type: String,
    coordinates: [[[Number]]]
  }

});

const featureSchema = new Schema({
  fieldId: String,
  bbox: {
    type: [Number]
  },
  additionalFeatures: {
    expectedYield: String,
    lastWatered: String,
    nextwater: String,
    canopy: Number,
    ndvi: Number,
    pest: Number,
    size: Number,
    region: String
  },

  featureCoordinates: coordinateSchema

});

const FeatureCoordinates = mongoose.model('features', featureSchema);
module.exports = FeatureCoordinates;
