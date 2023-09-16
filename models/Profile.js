const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  age: {
    type: Number,
    default: "",
    required: true,
  },
  gender: {
    type: String,
    default: '',
    required: true,
  },
  dob: {
    type: Date,
    default: null, 
    required: true,
  },
  mobile: {
    type: String,
    default: '', 
    required: true,
  },
});

module.exports = mongoose.model('Profile', profileSchema);

