const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
  },
  cart: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('cart', schema);
