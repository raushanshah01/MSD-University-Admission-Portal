
const mongoose = require('mongoose');
const AnnouncementSchema = new mongoose.Schema({
  title: {type:String, required:true},
  message: {type:String, required:true},
  type: {type:String, enum:['info','important','urgent','general'], default:'general'},
  targetAudience: {type:String, enum:['all','applicants','admins'], default:'all'},
  isActive: {type:Boolean, default:true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now},
  expiresAt: Date
});
module.exports = mongoose.model('Announcement', AnnouncementSchema);
