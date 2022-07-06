const imagekit = require('./image-kit');

const listAllFiles = async ({ searchQuery }) => {
  try {
    const res = await imagekit.listFiles({
      searchQuery
    });
    return [res, null];
  } catch (err) {
    console.log(err);
    return [null, err];
  }
};

module.exports = {
  listAllFiles,

};
