const imagekit = require('./image-kit');

const createCustomMetadata = async () => {
  try {
    const res = await imagekit.createCustomMetadataField(
      {
        name: 'field id',
        label: 'field id',
        schema: {
          type: 'Text',
        }
      },
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createCustomMetadata
};
