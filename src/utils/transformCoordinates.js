/* eslint-disable no-mixed-operators */
const transform = function (x, y) {
  const lon = x * 180 / 20037508.34;
  // thanks magichim @ github for the correction
  const lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
  return [lon, lat];
};

module.exports = transform;
