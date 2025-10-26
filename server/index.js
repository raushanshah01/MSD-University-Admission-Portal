
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./config/logger');
dotenv.config();

const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/application');
const profileRoutes = require('./routes/profile');
const courseRoutes = require('./routes/courses');
const notificationRoutes = require('./routes/notifications');
const announcementRoutes = require('./routes/announcements');
const contactRoutes = require('./routes/contact');
const formProgressRoutes = require('./routes/formProgress');
const admissionCycleRoutes = require('./routes/admissionCycle');
const smartFeaturesRoutes = require('./routes/smartFeatures');
const { apiLimiter, authLimiter, registerLimiter, passwordResetLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use(cors());
app.use(compression()); // Enable gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.use('/exports', express.static(path.join(__dirname, 'exports')));

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/uni_admission';

mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> {
    console.log('MongoDB connected');
    logger.info('MongoDB connected successfully');
  })
  .catch(err => {
    console.error(err);
    logger.error('MongoDB connection error:', err);
  });

// Apply rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/form-progress', formProgressRoutes);
app.use('/api/admission-cycle', admissionCycleRoutes);
app.use('/api/smart', smartFeaturesRoutes);

app.get('/', (req,res)=> res.send({ok:true, msg:'University Admission API'}));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Internal server error' });
});

app.listen(PORT, ()=> {
  console.log('Server running on port', PORT);
  logger.info(`Server started on port ${PORT}`);
});
