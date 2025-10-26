
const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  name: {type:String, required:true, unique:true},
  code: {type:String, required:true, unique:true},
  duration: {type:String, default:''},
  eligibility: {type:String, default:''},
  totalSeats: {type:Number, default:0},
  availableSeats: {type:Number, default:0},
  fees: {type:Number, default:0},
  description: {type:String, default:''},
  isActive: {type:Boolean, default:true},
  createdAt: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Course', CourseSchema);
