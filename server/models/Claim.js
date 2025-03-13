// Claim schema
const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  claimAmount: { type: Number, required: true },
  description: { type: String },
  document: { type: String }, // File path of the uploaded document
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submissionDate: { type: Date, default: Date.now },
  approvedAmount: { type: Number },
  insurerComments: { type: String }
});

module.exports = mongoose.model('Claim', ClaimSchema);
