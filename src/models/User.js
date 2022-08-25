const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  district: {
    type: String
  },
  mobile: {
    type: Number
  },
  pin: {
    type: Number
  }
});

module.exports = mongoose.model('userModel', userSchema);
