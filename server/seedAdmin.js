
// Run with: npm run seed
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const bcrypt = require('bcrypt');
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/uni_admission';
mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true}).then(async ()=>{
  const email = process.env.ADMIN_EMAIL || 'admin@vignan.edu';
  const pwd = process.env.ADMIN_PASSWORD || 'Admin@123';
  const existing = await User.findOne({email});
  if(existing){ console.log('Admin exists'); process.exit(0); }
  const hash = await bcrypt.hash(pwd, 10);
  const admin = new User({name:'Super Admin', email, password: hash, role: 'admin'});
  await admin.save();
  console.log('Admin created', email);
  process.exit(0);
}).catch(err=> console.error(err));
