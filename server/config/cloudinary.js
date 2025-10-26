
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Single storage configuration for all application documents
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on file field name
    let folder = 'uni_admission/documents';
    if (file.fieldname === 'photo') {
      folder = 'uni_admission/photos';
    } else if (file.fieldname.includes('marksheet')) {
      folder = 'uni_admission/marksheets';
    } else if (file.fieldname === 'certificate') {
      folder = 'uni_admission/certificates';
    } else if (file.fieldname === 'idProof') {
      folder = 'uni_admission/id_proofs';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      public_id: `${file.fieldname}_${Date.now()}`,
      resource_type: 'auto' // Automatically detect file type
    };
  }
});

// Create multer upload instance with validation
const uploadDocument = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Only JPG, PNG, and PDF files are allowed.`), false);
    }
  }
});

module.exports = {
  cloudinary,
  uploadDocument
};
