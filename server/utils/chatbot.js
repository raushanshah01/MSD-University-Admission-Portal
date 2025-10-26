
// Simple FAQ Chatbot with pattern matching

const faqDatabase = {
  // Admission Process
  admission: {
    patterns: ['admission', 'apply', 'application', 'how to apply', 'process'],
    responses: [
      {
        question: 'How do I apply for admission?',
        answer: 'To apply for admission:\n1. Register on the portal\n2. Complete your profile\n3. Fill the multi-step application form\n4. Upload required documents\n5. Submit your application\n6. Track your application status'
      },
      {
        question: 'What documents are required?',
        answer: 'Required documents:\n- Passport size photo\n- 10th marksheet\n- 12th marksheet (if applicable)\n- ID proof (Aadhar/PAN)\n- Any relevant certificates'
      },
      {
        question: 'When can I apply?',
        answer: 'Check the active admission cycle on the homepage. Applications are accepted during the specified dates only.'
      }
    ]
  },

  // Eligibility
  eligibility: {
    patterns: ['eligible', 'eligibility', 'qualify', 'criteria', 'requirement'],
    responses: [
      {
        question: 'What is the eligibility criteria?',
        answer: 'Eligibility varies by course. Generally:\n- Minimum 60% in 12th for B.Tech\n- Relevant stream (Science/Commerce/Arts)\n- Age limit as per university norms\nCheck specific course details for exact requirements.'
      },
      {
        question: 'Can I apply with 55%?',
        answer: 'Eligibility depends on the course and category. Some courses may accept lower percentages for reserved categories. Check the course details or contact admissions.'
      }
    ]
  },

  // Courses
  courses: {
    patterns: ['course', 'program', 'branch', 'stream', 'what courses'],
    responses: [
      {
        question: 'What courses are available?',
        answer: 'We offer various undergraduate and postgraduate programs. Visit the Courses section to see all available programs with seat availability and fees.'
      },
      {
        question: 'How do I choose a course?',
        answer: 'Use our Course Recommendation feature! Enter your marks and interests, and we\'ll suggest the best courses for you based on eligibility and seat availability.'
      }
    ]
  },

  // Fees
  fees: {
    patterns: ['fee', 'fees', 'cost', 'payment', 'how much'],
    responses: [
      {
        question: 'What are the fees?',
        answer: 'Fees vary by course. Check the Courses section for detailed fee structure. Payment can be made after admission confirmation.'
      },
      {
        question: 'Are there any scholarships?',
        answer: 'Yes, scholarships are available based on merit and category. Details will be provided after admission. Contact the admissions office for more information.'
      }
    ]
  },

  // Status
  status: {
    patterns: ['status', 'track', 'check application', 'where is my'],
    responses: [
      {
        question: 'How do I check my application status?',
        answer: 'Login to your account and go to "My Applications" to track your application status. You\'ll also receive email and in-app notifications for any updates.'
      },
      {
        question: 'What do the different statuses mean?',
        answer: 'Status meanings:\n- Pending: Under initial review\n- Verified: Documents verified\n- Approved: Admission granted\n- Rejected: Application not approved\n- Hold: Additional information needed'
      }
    ]
  },

  // Documents
  documents: {
    patterns: ['document', 'upload', 'file', 'certificate', 'marksheet'],
    responses: [
      {
        question: 'What format should documents be in?',
        answer: 'Accepted formats: JPG, PNG, PDF\nMaximum size: 5MB per document\nEnsure documents are clear and readable.'
      },
      {
        question: 'Can I edit documents after submission?',
        answer: 'No, documents cannot be edited after submission. Please ensure all documents are correct before submitting. Contact support if you need to update documents.'
      }
    ]
  },

  // Contact
  contact: {
    patterns: ['contact', 'help', 'support', 'email', 'phone'],
    responses: [
      {
        question: 'How can I contact support?',
        answer: 'You can:\n- Use the Contact/Query form on the portal\n- Email: admissions@university.edu\n- Check the Contact Us page for more details\nWe typically respond within 24-48 hours.'
      }
    ]
  },

  // Technical
  technical: {
    patterns: ['error', 'not working', 'problem', 'issue', 'bug'],
    responses: [
      {
        question: 'I\'m facing technical issues',
        answer: 'Try these steps:\n1. Clear browser cache\n2. Try a different browser\n3. Check your internet connection\n4. Disable browser extensions\nIf the issue persists, submit a query through the Contact form with details.'
      },
      {
        question: 'My form is not saving',
        answer: 'The form auto-saves every 2 seconds. Ensure you have a stable internet connection. Your progress is saved automatically, so you can return later to complete it.'
      }
    ]
  },

  // Admission Confirmation
  confirmation: {
    patterns: ['confirm', 'accept', 'offer letter', 'admission letter'],
    responses: [
      {
        question: 'How do I confirm my admission?',
        answer: 'After approval:\n1. You\'ll receive an offer letter\n2. Pay the admission fees\n3. Submit original documents\n4. Collect your student ID\nFollow the instructions in your offer letter.'
      }
    ]
  },

  // General
  general: {
    patterns: ['hello', 'hi', 'hey', 'help', 'start'],
    responses: [
      {
        question: 'Welcome!',
        answer: 'Hello! I\'m here to help with your admission queries. You can ask me about:\n- Admission process\n- Eligibility criteria\n- Available courses\n- Application status\n- Documents required\n- Fees and scholarships\n\nWhat would you like to know?'
      }
    ]
  }
};

// Find best matching response
function getChatbotResponse(userMessage) {
  const messageLower = userMessage.toLowerCase().trim();
  
  // Special case: empty or very short message
  if (messageLower.length < 2) {
    return {
      answer: 'Please ask a specific question about admissions, courses, eligibility, or any other topic.',
      confidence: 'low',
      suggestions: ['How do I apply?', 'What courses are available?', 'Check application status']
    };
  }
  
  let bestMatch = null;
  let highestScore = 0;
  let matchedCategory = null;
  
  // Search through all categories
  for (const [category, data] of Object.entries(faqDatabase)) {
    const { patterns, responses } = data;
    
    // Check if any pattern matches
    const patternScore = patterns.reduce((score, pattern) => {
      if (messageLower.includes(pattern)) {
        return score + pattern.length;
      }
      return score;
    }, 0);
    
    if (patternScore > highestScore) {
      highestScore = patternScore;
      matchedCategory = category;
      
      // Find most relevant response in this category
      bestMatch = responses[0]; // Default to first response
      
      // Try to find more specific match
      for (const response of responses) {
        const questionWords = response.question.toLowerCase().split(' ');
        const messageWords = messageLower.split(' ');
        const commonWords = questionWords.filter(word => 
          messageWords.includes(word) && word.length > 3
        );
        
        if (commonWords.length > 0) {
          bestMatch = response;
          break;
        }
      }
    }
  }
  
  // If no match found
  if (!bestMatch || highestScore === 0) {
    return {
      answer: 'I\'m not sure about that. Here are some topics I can help with:\n\n' +
              '• Admission process and how to apply\n' +
              '• Eligibility criteria\n' +
              '• Available courses and programs\n' +
              '• Application status tracking\n' +
              '• Required documents\n' +
              '• Fees and scholarships\n\n' +
              'You can also submit a detailed query through the Contact form for personalized assistance.',
      confidence: 'low',
      suggestions: [
        'How do I apply for admission?',
        'What are the eligibility criteria?',
        'What courses are available?'
      ],
      relatedTopics: Object.keys(faqDatabase).filter(k => k !== 'general')
    };
  }
  
  // Determine confidence level
  let confidence = 'high';
  if (highestScore < 5) confidence = 'medium';
  if (highestScore < 3) confidence = 'low';
  
  // Get related questions from same category
  const relatedQuestions = faqDatabase[matchedCategory].responses
    .filter(r => r !== bestMatch)
    .map(r => r.question)
    .slice(0, 3);
  
  return {
    answer: bestMatch.answer,
    question: bestMatch.question,
    confidence,
    category: matchedCategory,
    relatedQuestions,
    suggestions: generateSuggestions(matchedCategory)
  };
}

// Generate follow-up suggestions
function generateSuggestions(category) {
  const suggestions = {
    admission: ['What documents are required?', 'When can I apply?'],
    eligibility: ['What courses are available?', 'How do I apply?'],
    courses: ['What are the fees?', 'Am I eligible?'],
    fees: ['How do I apply?', 'Are there scholarships?'],
    status: ['How long does verification take?', 'What happens after approval?'],
    documents: ['What file formats are accepted?', 'Can I update documents?'],
    contact: ['What are the office hours?', 'How do I track my query?'],
    technical: ['How do I reset my password?', 'Is there a mobile app?'],
    confirmation: ['When do I get my student ID?', 'What are the next steps?']
  };
  
  return suggestions[category] || ['How do I apply?', 'What courses are available?'];
}

// Get all FAQs for a category
function getFAQsByCategory(category) {
  if (faqDatabase[category]) {
    return {
      category,
      faqs: faqDatabase[category].responses
    };
  }
  return null;
}

// Get all categories
function getAllCategories() {
  return Object.keys(faqDatabase).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    questionCount: faqDatabase[key].responses.length
  }));
}

// Search FAQs
function searchFAQs(searchTerm) {
  const results = [];
  const searchLower = searchTerm.toLowerCase();
  
  for (const [category, data] of Object.entries(faqDatabase)) {
    for (const response of data.responses) {
      if (response.question.toLowerCase().includes(searchLower) ||
          response.answer.toLowerCase().includes(searchLower)) {
        results.push({
          category,
          ...response
        });
      }
    }
  }
  
  return results;
}

module.exports = {
  getChatbotResponse,
  getFAQsByCategory,
  getAllCategories,
  searchFAQs,
  faqDatabase
};
