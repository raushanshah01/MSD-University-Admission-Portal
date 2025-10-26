
const Course = require('../models/Course');
const Application = require('../models/Application');

// Course Recommendation Engine
async function recommendCourses(userProfile) {
  try {
    const { percentage, previousEducation, category, interests } = userProfile;
    const percentageNum = parseFloat(percentage) || 0;
    
    // Get all active courses
    const courses = await Course.find({ isActive: true, availableSeats: { $gt: 0 } });
    
    // Score each course based on multiple factors
    const scoredCourses = courses.map(course => {
      let score = 0;
      
      // Factor 1: Eligibility match (40 points)
      if (course.eligibility) {
        const eligibilityMatch = checkEligibility(course.eligibility, previousEducation, percentageNum);
        score += eligibilityMatch ? 40 : 0;
      } else {
        score += 20; // Partial score if no specific eligibility
      }
      
      // Factor 2: Percentage requirement (30 points)
      if (percentageNum >= 90) score += 30;
      else if (percentageNum >= 80) score += 25;
      else if (percentageNum >= 70) score += 20;
      else if (percentageNum >= 60) score += 15;
      else score += 10;
      
      // Factor 3: Seat availability (20 points)
      const seatRatio = course.availableSeats / course.totalSeats;
      score += seatRatio * 20;
      
      // Factor 4: Interest match (10 points)
      if (interests && course.name) {
        const interestMatch = checkInterestMatch(interests, course.name);
        score += interestMatch ? 10 : 0;
      }
      
      return {
        course: course.name,
        code: course.code,
        score: Math.round(score),
        availableSeats: course.availableSeats,
        totalSeats: course.totalSeats,
        fees: course.fees,
        duration: course.duration,
        eligibility: course.eligibility,
        matchReason: generateMatchReason(score, seatRatio, percentageNum)
      };
    });
    
    // Sort by score and return top 5
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
      
  } catch (error) {
    console.error('Course recommendation error:', error);
    return [];
  }
}

// Check eligibility match
function checkEligibility(eligibility, previousEducation, percentage) {
  const eligLower = eligibility.toLowerCase();
  const prevEduLower = previousEducation.toLowerCase();
  
  // Check if previous education matches
  if (eligLower.includes('science') && prevEduLower.includes('science')) return true;
  if (eligLower.includes('commerce') && prevEduLower.includes('commerce')) return true;
  if (eligLower.includes('arts') && prevEduLower.includes('arts')) return true;
  if (eligLower.includes('12th') && prevEduLower.includes('12')) return true;
  
  // Check percentage requirement
  const percentMatch = eligibility.match(/(\d+)%/);
  if (percentMatch) {
    const requiredPercent = parseInt(percentMatch[1]);
    return percentage >= requiredPercent;
  }
  
  return true; // Default to eligible if can't determine
}

// Check interest match
function checkInterestMatch(interests, courseName) {
  const interestsLower = interests.toLowerCase();
  const courseLower = courseName.toLowerCase();
  
  const keywords = {
    'computer': ['computer', 'software', 'programming', 'coding', 'it'],
    'mechanical': ['mechanical', 'machines', 'automobile', 'manufacturing'],
    'electrical': ['electrical', 'electronics', 'circuits', 'power'],
    'civil': ['civil', 'construction', 'building', 'architecture'],
    'chemical': ['chemical', 'chemistry', 'process'],
    'biotechnology': ['bio', 'biology', 'genetics', 'medical']
  };
  
  for (const [key, terms] of Object.entries(keywords)) {
    if (courseLower.includes(key)) {
      return terms.some(term => interestsLower.includes(term));
    }
  }
  
  return false;
}

// Generate match reason
function generateMatchReason(score, seatRatio, percentage) {
  const reasons = [];
  
  if (score >= 80) reasons.push('Highly recommended');
  else if (score >= 60) reasons.push('Good match');
  else if (score >= 40) reasons.push('Suitable option');
  
  if (percentage >= 85) reasons.push('Excellent academic record');
  else if (percentage >= 75) reasons.push('Strong academic background');
  
  if (seatRatio > 0.5) reasons.push('Good seat availability');
  else if (seatRatio > 0.2) reasons.push('Limited seats available');
  else reasons.push('Very few seats remaining');
  
  return reasons.join(', ');
}

// Generate Merit List
async function generateMeritList(filters = {}) {
  try {
    const { course, category, limit = 100 } = filters;
    
    // Build query
    const query = { status: 'Approved' };
    if (course) query.course = course;
    if (category) query.category = category;
    
    // Get applications
    const applications = await Application.find(query)
      .populate('user', 'name email')
      .lean();
    
    // Calculate merit score for each application
    const scoredApplications = applications.map(app => {
      let meritScore = 0;
      
      // Factor 1: Percentage (70% weightage)
      const percentage = parseFloat(app.percentage) || 0;
      meritScore += (percentage / 100) * 70;
      
      // Factor 2: Category bonus (10% weightage)
      const categoryBonus = {
        'SC': 10,
        'ST': 10,
        'OBC': 5,
        'EWS': 5,
        'General': 0
      };
      meritScore += categoryBonus[app.category] || 0;
      
      // Factor 3: Early submission bonus (5% weightage)
      const submissionDate = new Date(app.submittedAt);
      const daysSinceStart = Math.floor((Date.now() - submissionDate) / (1000 * 60 * 60 * 24));
      if (daysSinceStart > 30) meritScore += 5;
      else if (daysSinceStart > 20) meritScore += 3;
      else if (daysSinceStart > 10) meritScore += 1;
      
      // Factor 4: Gender diversity (5% weightage)
      if (app.gender === 'Female') meritScore += 5;
      
      // Factor 5: Document completeness (10% weightage)
      const docs = app.documents || {};
      const docCount = Object.values(docs).filter(d => d).length;
      meritScore += (docCount / 5) * 10;
      
      return {
        applicationNumber: app.applicationNumber,
        name: app.fullName,
        email: app.email,
        course: app.course,
        category: app.category,
        percentage: app.percentage,
        gender: app.gender,
        meritScore: Math.round(meritScore * 100) / 100,
        submittedAt: app.submittedAt
      };
    });
    
    // Sort by merit score and assign ranks
    const rankedList = scoredApplications
      .sort((a, b) => b.meritScore - a.meritScore)
      .slice(0, limit)
      .map((app, index) => ({
        ...app,
        rank: index + 1
      }));
    
    return rankedList;
    
  } catch (error) {
    console.error('Merit list generation error:', error);
    return [];
  }
}

// Predictive Analytics - Popular Programs
async function getProgramTrends() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Applications in last 30 days by course
    const recentTrends = await Application.aggregate([
      {
        $match: {
          submittedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
          avgPercentage: { $avg: { $toDouble: '$percentage' } },
          categories: { $push: '$category' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Overall trends
    const overallTrends = await Application.aggregate([
      {
        $group: {
          _id: '$course',
          totalApplications: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { totalApplications: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Gender distribution trends
    const genderTrends = await Application.aggregate([
      {
        $group: {
          _id: { course: '$course', gender: '$gender' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    // Category-wise trends
    const categoryTrends = await Application.aggregate([
      {
        $group: {
          _id: { course: '$course', category: '$category' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    return {
      recentTrends: recentTrends.map(t => ({
        course: t._id,
        applications: t.count,
        avgPercentage: Math.round(t.avgPercentage * 100) / 100,
        trend: t.count > 10 ? 'High Demand' : t.count > 5 ? 'Moderate' : 'Low'
      })),
      overallTrends: overallTrends.map(t => ({
        course: t._id,
        totalApplications: t.totalApplications,
        approvedCount: t.approvedCount,
        approvalRate: Math.round((t.approvedCount / t.totalApplications) * 100)
      })),
      genderDistribution: genderTrends,
      categoryDistribution: categoryTrends
    };
    
  } catch (error) {
    console.error('Predictive analytics error:', error);
    return null;
  }
}

// Admission Prediction
async function predictAdmissionChance(applicationData) {
  try {
    const { course, percentage, category } = applicationData;
    const percentageNum = parseFloat(percentage) || 0;
    
    // Get historical data for the course
    const historicalData = await Application.find({
      course,
      status: { $in: ['Approved', 'Rejected'] }
    }).lean();
    
    if (historicalData.length < 10) {
      return {
        chance: 'Insufficient data',
        confidence: 'low',
        message: 'Not enough historical data for accurate prediction'
      };
    }
    
    // Calculate approval statistics
    const approved = historicalData.filter(app => app.status === 'Approved');
    const avgApprovedPercentage = approved.reduce((sum, app) => 
      sum + (parseFloat(app.percentage) || 0), 0) / approved.length;
    
    const categoryApproved = approved.filter(app => app.category === category);
    const categoryApprovalRate = (categoryApproved.length / approved.length) * 100;
    
    // Calculate admission chance
    let chanceScore = 0;
    
    // Factor 1: Percentage comparison (60% weight)
    if (percentageNum >= avgApprovedPercentage + 10) chanceScore += 60;
    else if (percentageNum >= avgApprovedPercentage) chanceScore += 50;
    else if (percentageNum >= avgApprovedPercentage - 5) chanceScore += 35;
    else if (percentageNum >= avgApprovedPercentage - 10) chanceScore += 20;
    else chanceScore += 10;
    
    // Factor 2: Category advantage (20% weight)
    if (categoryApprovalRate > 20) chanceScore += 20;
    else if (categoryApprovalRate > 10) chanceScore += 15;
    else chanceScore += 10;
    
    // Factor 3: Seat availability (20% weight)
    const courseData = await Course.findOne({ name: course });
    if (courseData) {
      const seatRatio = courseData.availableSeats / courseData.totalSeats;
      chanceScore += seatRatio * 20;
    }
    
    // Determine chance level
    let chance, confidence;
    if (chanceScore >= 80) {
      chance = 'Very High';
      confidence = 'high';
    } else if (chanceScore >= 60) {
      chance = 'High';
      confidence = 'high';
    } else if (chanceScore >= 40) {
      chance = 'Moderate';
      confidence = 'medium';
    } else if (chanceScore >= 20) {
      chance = 'Low';
      confidence = 'medium';
    } else {
      chance = 'Very Low';
      confidence = 'low';
    }
    
    return {
      chance,
      confidence,
      score: Math.round(chanceScore),
      avgApprovedPercentage: Math.round(avgApprovedPercentage * 100) / 100,
      categoryApprovalRate: Math.round(categoryApprovalRate),
      message: generatePredictionMessage(chance, percentageNum, avgApprovedPercentage)
    };
    
  } catch (error) {
    console.error('Admission prediction error:', error);
    return null;
  }
}

function generatePredictionMessage(chance, userPercentage, avgPercentage) {
  if (chance === 'Very High' || chance === 'High') {
    return `Your percentage (${userPercentage}%) is ${userPercentage > avgPercentage ? 'above' : 'at'} the average for approved applicants. You have a strong chance of admission.`;
  } else if (chance === 'Moderate') {
    return `Your percentage (${userPercentage}%) is close to the average. Consider applying to multiple programs to increase your chances.`;
  } else {
    return `Your percentage (${userPercentage}%) is below the average for this program. Consider improving your profile or exploring alternative programs.`;
  }
}

module.exports = {
  recommendCourses,
  generateMeritList,
  getProgramTrends,
  predictAdmissionChance
};
