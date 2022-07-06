const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.imageKitPubKey,
  privateKey: process.env.imageKitPrivKey,
  urlEndpoint: 'https://ik.imagekit.io/tirtho007/'
});

module.exports = imagekit;
