
const mongoose = require('mongoose');

const AdmissionCycleSchema = new mongoose.Schema({
  name: {type: String, required: true}, // e.g., "2024-2025 Academic Year"
  year: {type: String, required: true},
  isActive: {type: Boolean, default: false},
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  description: String,
  allowApplications: {type: Boolean, default: true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now}
});

// Ensure only one active cycle at a time
AdmissionCycleSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('AdmissionCycle').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model('AdmissionCycle', AdmissionCycleSchema);
