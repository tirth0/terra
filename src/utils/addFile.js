const imagekit = require('./image-kit');

const addFile = async ({ file, folder, fileName }) => {
  try {
    const res = await imagekit.upload({
      file,
      folder,
      fileName,
    });

    return [res, null];
  } catch (err) {
    console.log('Error occured while uploading file', err);
    return [null, err];
  }
};

module.exports = addFile;
