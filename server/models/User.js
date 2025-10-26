
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  role: {type:String, enum:['applicant','admin','reviewer'], default:'applicant'},
  isEmailVerified: {type:Boolean, default:false},
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshToken: String,
  // Profile fields
  phone: {type:String, default:''},
  address: {type:String, default:''},
  city: {type:String, default:''},
  state: {type:String, default:''},
  pincode: {type:String, default:''},
  gender: {type:String, enum:['Male','Female','Other',''], default:''},
  dateOfBirth: {type:String, default:''},
  guardianName: {type:String, default:''},
  guardianPhone: {type:String, default:''},
  lastLogin: Date,
  createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('User', UserSchema);
