
const mongoose = require('mongoose');
const FormProgressSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  step: {type:Number, default:1},
  formData: {type: mongoose.Schema.Types.Mixed, default: {}},
  lastSaved: {type: Date, default: Date.now}
});
module.exports = mongoose.model('FormProgress', FormProgressSchema);
