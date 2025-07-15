const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  gymFee: { type: Number, required: true },
  months: { type: Number, required: true },
  address: { type: String, required: true },
  submissionDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Member', memberSchema);