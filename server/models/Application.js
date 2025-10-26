
const mongoose = require('mongoose');
// Name sub-schema
const nameSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true, default: '' },
  lastName: { type: String, required: true, trim: true }
}, { _id: false });

const AppSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: nameSchema, required: true },
  dob: String,
  gender: String,
  category: {type:String, enum:['General','OBC','SC','ST','EWS',''], default:''},
  course: String,
  phone: String,
  email: String,
  address: String,
  guardianName: String,
  guardianPhone: String,
  previousEducation: String,
  percentage: String,
  status: {type:String, enum:['Pending','Verified','Approved','Rejected','Hold'], default:'Pending'},
  documents: {
    photo: {type:String, default:''},
    marksheet10: {type:String, default:''},
    marksheet12: {type:String, default:''},
    certificate: {type:String, default:''},
    idProof: {type:String, default:''}
  },
  remarks: {type:String, default:''},
  applicationNumber: {type:String, unique:true},
  submittedAt: {type: Date, default: Date.now},
  verifiedAt: Date,
  approvedAt: Date,
  // Enrollment fields
  isAdmitted: {type: Boolean, default: false},
  admittedAt: Date,
  studentId: {type: String, unique: true, sparse: true},
  rollNumber: {type: String, unique: true, sparse: true},
  offerLetterGenerated: {type: Boolean, default: false},
  offerLetterUrl: String,
  seatLocked: {type: Boolean, default: false},
  seatLockedAt: Date,
  admissionCycle: {type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionCycle'},
  createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Application', AppSchema);
