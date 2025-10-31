
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

// CORS configuration - Allow frontend origin
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173','https://msd-university-admission-portal-one.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(compression({ 
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses larger than 1KB
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Static file serving with caching
const staticOptions = {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Cache static assets aggressively
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticOptions));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs'), staticOptions));
app.use('/exports', express.static(path.join(__dirname, 'exports'), staticOptions));

// Serve static client files (for production) with caching
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

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

// Serve the client app for all non-API routes (must be after API routes)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      ok: false, 
      msg: 'University Admission API - Client build not found. Run "npm run build" in the server folder first.',
      note: 'API endpoints are available at /api/*'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ msg: 'Internal server error' });
});

app.listen(PORT, ()=> {
  console.log('Server running on port', PORT);
  logger.info(`Server started on port ${PORT}`);
});
