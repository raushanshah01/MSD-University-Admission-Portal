
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure PDF directory exists
const pdfDir = path.join(__dirname, '../pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Generate Offer Letter
async function generateOfferLetter(application, user) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `offer_letter_${application.applicationNumber}.pdf`;
      const filePath = path.join(pdfDir, fileName);
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Header
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text('UNIVERSITY ADMISSION PORTAL', { align: 'center' })
         .moveDown(0.5);
      
      doc.fontSize(16)
         .text('OFFER LETTER', { align: 'center' })
         .moveDown(1);

      // Date
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'right' })
         .moveDown(1);

      // Application details
      doc.fontSize(12)
         .text(`Application Number: ${application.applicationNumber}`)
         .moveDown(0.5);

      // Applicant details
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Dear ' + application.fullName + ',')
         .moveDown(1);

      // Offer message
      doc.fontSize(11)
         .font('Helvetica')
         .text('Congratulations! We are pleased to inform you that you have been selected for admission to:', { align: 'justify' })
         .moveDown(0.5);

      doc.fontSize(13)
         .font('Helvetica-Bold')
         .text(application.course, { align: 'center' })
         .moveDown(1);

      // Student details
      doc.fontSize(11)
         .font('Helvetica')
         .text('Your admission details are as follows:')
         .moveDown(0.5);

      const details = [
        ['Student ID:', application.studentId || 'Will be assigned'],
        ['Roll Number:', application.rollNumber || 'Will be assigned'],
        ['Course:', application.course],
        ['Category:', application.category],
        ['Date of Birth:', application.dob],
        ['Email:', application.email],
        ['Phone:', application.phone]
      ];

      details.forEach(([label, value]) => {
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text(label, 50, doc.y, { continued: true, width: 150 })
           .font('Helvetica')
           .text(value, { width: 350 })
           .moveDown(0.3);
      });

      doc.moveDown(1);

      // Instructions
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('Next Steps:')
         .moveDown(0.5);

      doc.fontSize(10)
         .font('Helvetica')
         .list([
          'Complete the admission formalities within 15 days',
          'Submit original documents for verification',
          'Pay the admission fees',
          'Collect your student ID card'
        ], { bulletRadius: 2 })
         .moveDown(1);

      // Important note
      doc.fontSize(10)
         .font('Helvetica-Oblique')
         .text('Note: This offer is valid for 15 days from the date of issue. Failure to complete admission formalities within this period will result in cancellation of the offer.', { align: 'justify' })
         .moveDown(2);

      // Footer
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Admissions Office')
         .font('Helvetica')
         .text('University Admission Portal')
         .text('Email: admissions@university.edu')
         .moveDown(2);

      doc.fontSize(8)
         .font('Helvetica-Oblique')
         .text('This is a computer-generated document and does not require a signature.', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(`/pdfs/${fileName}`);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

// Generate Summary Report
async function generateSummaryReport(statistics, filters = {}) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `summary_report_${Date.now()}.pdf`;
      const filePath = path.join(pdfDir, fileName);
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Header
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text('ADMISSION SUMMARY REPORT', { align: 'center' })
         .moveDown(1);

      doc.fontSize(10)
         .font('Helvetica')
         .text(`Generated on: ${new Date().toLocaleString('en-IN')}`, { align: 'right' })
         .moveDown(1);

      // Overall Statistics
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Overall Statistics')
         .moveDown(0.5);

      const overallStats = [
        ['Total Applications:', statistics.total || 0],
        ['Pending:', statistics.pending || 0],
        ['Verified:', statistics.verified || 0],
        ['Approved:', statistics.approved || 0],
        ['Rejected:', statistics.rejected || 0],
        ['On Hold:', statistics.hold || 0]
      ];

      overallStats.forEach(([label, value]) => {
        doc.fontSize(11)
           .font('Helvetica')
           .text(label, 50, doc.y, { continued: true, width: 200 })
           .font('Helvetica-Bold')
           .text(value.toString(), { align: 'right' })
           .moveDown(0.3);
      });

      doc.moveDown(1);

      // Course-wise Distribution
      if (statistics.byCourse && statistics.byCourse.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Course-wise Distribution')
           .moveDown(0.5);

        statistics.byCourse.forEach(item => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(item._id || 'Not Specified', 50, doc.y, { continued: true, width: 300 })
             .font('Helvetica-Bold')
             .text(item.count.toString(), { align: 'right' })
             .moveDown(0.3);
        });

        doc.moveDown(1);
      }

      // Category-wise Distribution
      if (statistics.byCategory && statistics.byCategory.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Category-wise Distribution')
           .moveDown(0.5);

        statistics.byCategory.forEach(item => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(item._id || 'Not Specified', 50, doc.y, { continued: true, width: 300 })
             .font('Helvetica-Bold')
             .text(item.count.toString(), { align: 'right' })
             .moveDown(0.3);
        });

        doc.moveDown(1);
      }

      // Gender Distribution
      if (statistics.byGender && statistics.byGender.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Gender Distribution')
           .moveDown(0.5);

        statistics.byGender.forEach(item => {
          doc.fontSize(10)
             .font('Helvetica')
             .text(item._id || 'Not Specified', 50, doc.y, { continued: true, width: 300 })
             .font('Helvetica-Bold')
             .text(item.count.toString(), { align: 'right' })
             .moveDown(0.3);
        });
      }

      // Footer
      doc.fontSize(8)
         .font('Helvetica-Oblique')
         .text('End of Report', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(`/pdfs/${fileName}`);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateOfferLetter,
  generateSummaryReport
};
