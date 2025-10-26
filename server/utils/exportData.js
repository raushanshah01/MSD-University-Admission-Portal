
const ExcelJS = require('exceljs');
const { format } = require('fast-csv');
const fs = require('fs');
const path = require('path');

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// Export applications to CSV
async function exportToCSV(applications) {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `applications_${Date.now()}.csv`;
      const filePath = path.join(exportsDir, fileName);
      const writeStream = fs.createWriteStream(filePath);
      
      const csvStream = format({ headers: true });
      csvStream.pipe(writeStream);

      applications.forEach(app => {
        csvStream.write({
          'Application Number': app.applicationNumber || '',
          'Full Name': app.fullName || '',
          'Email': app.email || '',
          'Phone': app.phone || '',
          'Date of Birth': app.dob || '',
          'Gender': app.gender || '',
          'Category': app.category || '',
          'Course': app.course || '',
          'Previous Education': app.previousEducation || '',
          'Percentage': app.percentage || '',
          'Status': app.status || '',
          'Student ID': app.studentId || '',
          'Roll Number': app.rollNumber || '',
          'Submitted At': app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '',
          'Verified At': app.verifiedAt ? new Date(app.verifiedAt).toLocaleDateString() : '',
          'Approved At': app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : '',
          'Remarks': app.remarks || ''
        });
      });

      csvStream.end();

      writeStream.on('finish', () => {
        resolve(`/exports/${fileName}`);
      });

      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

// Export applications to Excel
async function exportToExcel(applications) {
  try {
    const fileName = `applications_${Date.now()}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
      { header: 'Application Number', key: 'applicationNumber', width: 20 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Category', key: 'category', width: 12 },
      { header: 'Course', key: 'course', width: 30 },
      { header: 'Previous Education', key: 'previousEducation', width: 20 },
      { header: 'Percentage', key: 'percentage', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Student ID', key: 'studentId', width: 15 },
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Submitted At', key: 'submittedAt', width: 15 },
      { header: 'Verified At', key: 'verifiedAt', width: 15 },
      { header: 'Approved At', key: 'approvedAt', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 30 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    applications.forEach(app => {
      worksheet.addRow({
        applicationNumber: app.applicationNumber || '',
        fullName: app.fullName || '',
        email: app.email || '',
        phone: app.phone || '',
        dob: app.dob || '',
        gender: app.gender || '',
        category: app.category || '',
        course: app.course || '',
        previousEducation: app.previousEducation || '',
        percentage: app.percentage || '',
        status: app.status || '',
        studentId: app.studentId || '',
        rollNumber: app.rollNumber || '',
        submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '',
        verifiedAt: app.verifiedAt ? new Date(app.verifiedAt).toLocaleDateString() : '',
        approvedAt: app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : '',
        remarks: app.remarks || ''
      });
    });

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A1',
      to: 'Q1'
    };

    // Save file
    await workbook.xlsx.writeFile(filePath);
    
    return `/exports/${fileName}`;
  } catch (error) {
    throw error;
  }
}

// Export statistics to Excel
async function exportStatisticsToExcel(statistics) {
  try {
    const fileName = `statistics_${Date.now()}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    
    const workbook = new ExcelJS.Workbook();
    
    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Count', key: 'count', width: 15 }
    ];
    
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' }
    };
    summarySheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    summarySheet.addRow({ metric: 'Total Applications', count: statistics.total || 0 });
    summarySheet.addRow({ metric: 'Pending', count: statistics.pending || 0 });
    summarySheet.addRow({ metric: 'Verified', count: statistics.verified || 0 });
    summarySheet.addRow({ metric: 'Approved', count: statistics.approved || 0 });
    summarySheet.addRow({ metric: 'Rejected', count: statistics.rejected || 0 });
    summarySheet.addRow({ metric: 'On Hold', count: statistics.hold || 0 });

    // Course-wise Sheet
    if (statistics.byCourse && statistics.byCourse.length > 0) {
      const courseSheet = workbook.addWorksheet('By Course');
      courseSheet.columns = [
        { header: 'Course', key: 'course', width: 40 },
        { header: 'Applications', key: 'count', width: 15 }
      ];
      
      courseSheet.getRow(1).font = { bold: true };
      courseSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667EEA' }
      };
      courseSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

      statistics.byCourse.forEach(item => {
        courseSheet.addRow({ course: item._id || 'Not Specified', count: item.count });
      });
    }

    // Category-wise Sheet
    if (statistics.byCategory && statistics.byCategory.length > 0) {
      const categorySheet = workbook.addWorksheet('By Category');
      categorySheet.columns = [
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Applications', key: 'count', width: 15 }
      ];
      
      categorySheet.getRow(1).font = { bold: true };
      categorySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667EEA' }
      };
      categorySheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

      statistics.byCategory.forEach(item => {
        categorySheet.addRow({ category: item._id || 'Not Specified', count: item.count });
      });
    }

    // Gender-wise Sheet
    if (statistics.byGender && statistics.byGender.length > 0) {
      const genderSheet = workbook.addWorksheet('By Gender');
      genderSheet.columns = [
        { header: 'Gender', key: 'gender', width: 20 },
        { header: 'Applications', key: 'count', width: 15 }
      ];
      
      genderSheet.getRow(1).font = { bold: true };
      genderSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667EEA' }
      };
      genderSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

      statistics.byGender.forEach(item => {
        genderSheet.addRow({ gender: item._id || 'Not Specified', count: item.count });
      });
    }

    await workbook.xlsx.writeFile(filePath);
    
    return `/exports/${fileName}`;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  exportToCSV,
  exportToExcel,
  exportStatisticsToExcel
};
