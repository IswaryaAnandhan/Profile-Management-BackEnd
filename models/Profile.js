const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  gender: {
    type: String,
    default: '',
  },
  dob: {
    type: Date,
    default: null, 
  },
  mobile: {
    type: String,
    default: '', 
  },
});

module.exports = mongoose.model('Profile', profileSchema);

