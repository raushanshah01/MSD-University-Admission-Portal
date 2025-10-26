const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const AdmissionCycle = require('./models/AdmissionCycle');
const Announcement = require('./models/Announcement');
const User = require('./models/User');

dotenv.config();

const vignanCourses = [
  // ==================== UNDERGRADUATE (B.Tech) - CSE Specializations ====================
  {
    name: 'Bachelor of Technology in Computer Science and Engineering',
    code: 'BTECH-CSE',
    duration: 4,
    department: 'Computer Science and Engineering',
    description: 'Comprehensive program covering software development, algorithms, data structures, AI, machine learning, and modern computing technologies.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 180,
    availableSeats: 180,
    fees: 280000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Computer Science (Cyber Security)',
    code: 'BTECH-CS-BS',
    duration: 4,
    department: 'Computer Science and Engineering',
    description: 'Specialized program in cybersecurity, network security, cryptography, and information security management.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 280000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Artificial Intelligence and Machine Learning',
    code: 'BTECH-AIML',
    duration: 4,
    department: 'Computer Science and Engineering',
    description: 'Advanced AI concepts, deep learning, neural networks, natural language processing, and intelligent systems.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 280000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Data Science',
    code: 'BTECH-DS',
    duration: 4,
    department: 'Computer Science and Engineering',
    description: 'Big data analytics, statistical modeling, data visualization, predictive analytics, and business intelligence.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 90,
    availableSeats: 90,
    fees: 280000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Internet of Things (IoT)',
    code: 'BTECH-IOT',
    duration: 4,
    department: 'Computer Science and Engineering',
    description: 'IoT architecture, sensor networks, embedded systems, cloud integration, and smart device development.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 90,
    availableSeats: 90,
    fees: 280000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Information Technology',
    code: 'BTECH-IT',
    duration: 4,
    department: 'Information Technology',
    description: 'Software engineering, database systems, web technologies, cloud computing, and IT infrastructure management.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 280000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },

  // ==================== UNDERGRADUATE (B.Tech) - ECE Specializations ====================
  {
    name: 'Bachelor of Technology in Electronics and Communication Engineering',
    code: 'BTECH-ECE',
    duration: 4,
    department: 'Electronics and Communication Engineering',
    description: 'Focus on electronic circuits, communication systems, VLSI design, embedded systems, and signal processing.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 200000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in ECE - VLSI Design',
    code: 'BTECH-ECE-VLSI',
    duration: 4,
    department: 'Electronics and Communication Engineering',
    description: 'Very Large Scale Integration design, chip design, semiconductor technology, and embedded systems.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 90,
    availableSeats: 90,
    fees: 200000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },

  // ==================== UNDERGRADUATE (B.Tech) - Bio Sciences ====================
  {
    name: 'Bachelor of Technology in Biomedical Engineering',
    code: 'BTECH-BME',
    duration: 4,
    department: 'Biomedical Engineering',
    description: 'Medical devices, biomedical instrumentation, biomechanics, and healthcare technology.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Biology/Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 200000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Biotechnology',
    code: 'BTECH-BIOTECH',
    duration: 4,
    department: 'Biotechnology',
    description: 'Genetic engineering, molecular biology, bioinformatics, pharmaceutical biotechnology, and bioprocess engineering.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Biology/Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 200000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Bioinformatics',
    code: 'BTECH-BIOINFO',
    duration: 4,
    department: 'Biotechnology',
    description: 'Computational biology, genomics, proteomics, biological databases, and data mining in life sciences.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Biology/Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 200000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },

  // ==================== UNDERGRADUATE (B.Tech) - Core Engineering ====================
  {
    name: 'Bachelor of Technology in Agriculture Engineering',
    code: 'BTECH-AGRI',
    duration: 4,
    department: 'Agriculture Engineering',
    description: 'Farm machinery, irrigation systems, post-harvest technology, and agricultural automation.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Chemical Engineering',
    code: 'BTECH-CHEM',
    duration: 4,
    department: 'Chemical Engineering',
    description: 'Chemical processes, thermodynamics, process control, petrochemicals, and industrial chemistry.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Civil Engineering',
    code: 'BTECH-CIVIL',
    duration: 4,
    department: 'Civil Engineering',
    description: 'Structural engineering, construction management, transportation, environmental engineering, and infrastructure development.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 90,
    availableSeats: 90,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Electrical and Electronics Engineering',
    code: 'BTECH-EEE',
    duration: 4,
    department: 'Electrical and Electronics Engineering',
    description: 'Study of power systems, electrical machines, power electronics, renewable energy, and automation.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Mechanical Engineering',
    code: 'BTECH-MECH',
    duration: 4,
    department: 'Mechanical Engineering',
    description: 'Covers thermodynamics, fluid mechanics, manufacturing, CAD/CAM, robotics, and automotive engineering.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Robotics and Automation',
    code: 'BTECH-ROBOTICS',
    duration: 4,
    department: 'Mechanical Engineering',
    description: 'Industrial robotics, automation systems, mechatronics, artificial intelligence, and control systems.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Food Technology',
    code: 'BTECH-FOOD',
    duration: 4,
    department: 'Food Technology',
    description: 'Food processing, preservation, quality control, nutrition, and food safety management.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Biology/Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 120000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },

  // ==================== UNDERGRADUATE (B.Tech) - Textile ====================
  {
    name: 'Bachelor of Technology in Textile Technology',
    code: 'BTECH-TEXTILE',
    duration: 4,
    department: 'Textile Technology',
    description: 'Textile manufacturing, fabric design, dyeing and finishing, and quality control.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 100000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Technology in Technical Textile',
    code: 'BTECH-TECH-TEXTILE',
    duration: 4,
    department: 'Textile Technology',
    description: 'Advanced textiles, smart fabrics, geotextiles, medical textiles, and industrial applications.',
    eligibility: 'Admission through V-SAT/EAMCET/JEE(Mains/Advanced) 2025. 10+2 with Physics, Chemistry, Mathematics. Minimum 60% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 100000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },

  // ==================== OTHER UNDERGRADUATE PROGRAMMES ====================
  {
    name: 'Bachelor of Science (Hons) in Agriculture',
    code: 'BSC-AGRI',
    duration: 4,
    department: 'Agriculture',
    description: 'Crop science, soil science, horticulture, agricultural economics, and sustainable farming practices.',
    eligibility: 'Admission through V-SAT/EAMCET 2025. 10+2 with Physics, Chemistry, Biology/Agriculture. Minimum 50% aggregate.',
    totalSeats: 100,
    availableSeats: 100,
    fees: 180000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Pharmacy',
    code: 'BPHARM',
    duration: 4,
    department: 'Pharmacy',
    description: 'Pharmaceutical chemistry, pharmacology, drug formulation, quality control, and clinical pharmacy.',
    eligibility: 'Admission through V-SAT/EAMCET 2025. 10+2 with Physics, Chemistry, Biology/Mathematics. Minimum 50% aggregate.',
    totalSeats: 100,
    availableSeats: 100,
    fees: 180000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Doctor of Pharmacy (Pharm.D)',
    code: 'PHARMD',
    duration: 6,
    department: 'Pharmacy',
    description: 'Clinical pharmacy, pharmacotherapy, patient care, pharmaceutical care, and hospital pharmacy.',
    eligibility: 'Admission through V-SAT/EAMCET 2025. 10+2 with Physics, Chemistry, Biology. Minimum 50% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 260000,
    admissionFee: 20000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Business Administration',
    code: 'BBA',
    duration: 3,
    department: 'Management',
    description: 'Business management, marketing, finance, human resources, organizational behavior, and entrepreneurship.',
    eligibility: '10+2 from any stream. Minimum 50% aggregate.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 120000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Computer Applications',
    code: 'BCA',
    duration: 3,
    department: 'Computer Applications',
    description: 'Programming, web development, database management, software engineering, and system analysis.',
    eligibility: '10+2 from any stream with Mathematics. Minimum 50% aggregate.',
    totalSeats: 90,
    availableSeats: 90,
    fees: 120000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'BBA LL.B (Hons)',
    code: 'BBA-LLB',
    duration: 5,
    department: 'Law',
    description: 'Integrated law program combining business administration with legal studies, corporate law, and litigation.',
    eligibility: '10+2 from any stream. Minimum 50% aggregate. Law entrance test required.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 90000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'BA LL.B (Hons)',
    code: 'BA-LLB',
    duration: 5,
    department: 'Law',
    description: 'Integrated law program with arts subjects, constitutional law, criminal law, and legal practice.',
    eligibility: '10+2 from any stream. Minimum 50% aggregate. Law entrance test required.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 90000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Science in Mathematics',
    code: 'BSC-MATHS',
    duration: 3,
    department: 'Mathematics',
    description: 'Pure mathematics, applied mathematics, statistics, and mathematical modeling.',
    eligibility: '10+2 with Mathematics. Minimum 50% aggregate.',
    totalSeats: 40,
    availableSeats: 40,
    fees: 80000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Science in Statistics',
    code: 'BSC-STATS',
    duration: 3,
    department: 'Mathematics',
    description: 'Statistical methods, probability theory, data analysis, and statistical computing.',
    eligibility: '10+2 with Mathematics. Minimum 50% aggregate.',
    totalSeats: 40,
    availableSeats: 40,
    fees: 80000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Science in Computer Science',
    code: 'BSC-CS',
    duration: 3,
    department: 'Computer Science',
    description: 'Core computer science concepts, programming languages, operating systems, and computer networks.',
    eligibility: '10+2 with Mathematics. Minimum 50% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 80000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },
  {
    name: 'Bachelor of Science in Actuarial Science',
    code: 'BSC-ACTUARIAL',
    duration: 3,
    department: 'Mathematics',
    description: 'Risk assessment, insurance mathematics, financial modeling, and actuarial techniques.',
    eligibility: '10+2 with Mathematics. Minimum 60% aggregate.',
    totalSeats: 40,
    availableSeats: 40,
    fees: 80000,
    admissionFee: 10000,
    category: 'UG',
    isActive: true
  },

  // ==================== POSTGRADUATE PROGRAMMES ====================
  {
    name: 'Master of Business Administration',
    code: 'MBA',
    duration: 2,
    department: 'Management',
    description: 'Strategic management, marketing, finance, HR, operations, and business analytics with specializations.',
    eligibility: 'Bachelor\'s degree in any discipline. Minimum 50% aggregate. Valid entrance test score.',
    totalSeats: 120,
    availableSeats: 120,
    fees: 200000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Business Administration - Business Analytics',
    code: 'MBA-BA',
    duration: 2,
    department: 'Management',
    description: 'Data-driven decision making, predictive analytics, business intelligence, and advanced analytics tools.',
    eligibility: 'Bachelor\'s degree in any discipline. Minimum 50% aggregate. Valid entrance test score.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 200000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Computer Applications',
    code: 'MCA',
    duration: 2,
    department: 'Computer Applications',
    description: 'Advanced programming, software development, system design, mobile computing, and project management.',
    eligibility: 'BCA/B.Sc (CS/IT) or equivalent with Mathematics at 10+2 level.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 140000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Technology in Computer Science and Engineering',
    code: 'MTECH-CSE',
    duration: 2,
    department: 'Computer Science and Engineering',
    description: 'Advanced topics in algorithms, distributed systems, cloud computing, cybersecurity, and research.',
    eligibility: 'B.Tech/BE in CSE/IT or related field. Valid GATE score preferred.',
    totalSeats: 30,
    availableSeats: 30,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Pharmacy',
    code: 'MPHARM',
    duration: 2,
    department: 'Pharmacy',
    description: 'Advanced pharmaceutical sciences, drug discovery, clinical research, and pharmaceutical analysis.',
    eligibility: 'B.Pharmacy with minimum 55% aggregate. Valid GPAT score preferred.',
    totalSeats: 40,
    availableSeats: 40,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Agronomy',
    code: 'MSC-AGRONOMY',
    duration: 2,
    department: 'Agriculture',
    description: 'Crop production, soil management, sustainable agriculture, and agricultural research.',
    eligibility: 'B.Sc (Agriculture) or equivalent. Minimum 55% aggregate.',
    totalSeats: 30,
    availableSeats: 30,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Entomology',
    code: 'MSC-ENTOMOLOGY',
    duration: 2,
    department: 'Agriculture',
    description: 'Insect science, pest management, biological control, and integrated pest management.',
    eligibility: 'B.Sc (Agriculture/Life Sciences) or equivalent. Minimum 55% aggregate.',
    totalSeats: 20,
    availableSeats: 20,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Soil Science',
    code: 'MSC-SOIL',
    duration: 2,
    department: 'Agriculture',
    description: 'Soil chemistry, soil fertility, soil conservation, and soil microbiology.',
    eligibility: 'B.Sc (Agriculture/Life Sciences) or equivalent. Minimum 55% aggregate.',
    totalSeats: 20,
    availableSeats: 20,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Agricultural Economics',
    code: 'MSC-AGRI-ECO',
    duration: 2,
    department: 'Agriculture',
    description: 'Farm management, agricultural marketing, rural development, and agricultural policy.',
    eligibility: 'B.Sc (Agriculture) or equivalent. Minimum 55% aggregate.',
    totalSeats: 20,
    availableSeats: 20,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Vegetable Science',
    code: 'MSC-VEG-SCI',
    duration: 2,
    department: 'Agriculture',
    description: 'Vegetable production, breeding, post-harvest management, and organic farming.',
    eligibility: 'B.Sc (Agriculture/Horticulture) or equivalent. Minimum 55% aggregate.',
    totalSeats: 20,
    availableSeats: 20,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Floriculture and Landscaping',
    code: 'MSC-FLORI',
    duration: 2,
    department: 'Agriculture',
    description: 'Ornamental horticulture, landscape design, flower production, and garden management.',
    eligibility: 'B.Sc (Agriculture/Horticulture) or equivalent. Minimum 55% aggregate.',
    totalSeats: 20,
    availableSeats: 20,
    fees: 100000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Chemistry',
    code: 'MSC-CHEM',
    duration: 2,
    department: 'Chemistry',
    description: 'Organic chemistry, inorganic chemistry, physical chemistry, and analytical chemistry.',
    eligibility: 'B.Sc in Chemistry or equivalent. Minimum 55% aggregate.',
    totalSeats: 30,
    availableSeats: 30,
    fees: 80000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Organic Chemistry',
    code: 'MSC-ORG-CHEM',
    duration: 2,
    department: 'Chemistry',
    description: 'Advanced organic synthesis, natural products, pharmaceutical chemistry, and spectroscopy.',
    eligibility: 'B.Sc in Chemistry or equivalent. Minimum 55% aggregate.',
    totalSeats: 20,
    availableSeats: 20,
    fees: 80000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Science in Data Science',
    code: 'MSC-DS',
    duration: 2,
    department: 'Computer Science',
    description: 'Statistical analysis, machine learning, big data technologies, data mining, and visualization.',
    eligibility: 'B.Sc/B.Tech in Computer Science, Mathematics, Statistics or related field.',
    totalSeats: 40,
    availableSeats: 40,
    fees: 80000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },
  {
    name: 'Master of Arts in English',
    code: 'MA-ENG',
    duration: 2,
    department: 'English',
    description: 'Advanced literary studies, critical theory, linguistics, and research methodology.',
    eligibility: 'B.A in English or equivalent. Minimum 50% aggregate.',
    totalSeats: 30,
    availableSeats: 30,
    fees: 80000,
    admissionFee: 10000,
    category: 'PG',
    isActive: true
  },

  // ==================== DIPLOMA PROGRAMMES ====================
  {
    name: 'Diploma in Computer Science and Engineering',
    code: 'DIPLOMA-CSE',
    duration: 3,
    department: 'Computer Science and Engineering',
    description: 'Programming fundamentals, database systems, web development, and networking basics.',
    eligibility: '10th pass with minimum 50% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 70000,
    admissionFee: 10000,
    category: 'Diploma',
    isActive: true
  },
  {
    name: 'Diploma in Electronics and Communication Engineering',
    code: 'DIPLOMA-ECE',
    duration: 3,
    department: 'Electronics and Communication Engineering',
    description: 'Electronic circuits, communication systems, digital electronics, and microprocessors.',
    eligibility: '10th pass with minimum 50% aggregate.',
    totalSeats: 60,
    availableSeats: 60,
    fees: 70000,
    admissionFee: 10000,
    category: 'Diploma',
    isActive: true
  },

  // ==================== DOCTORAL PROGRAMMES (PhD) ====================
  {
    name: 'Doctor of Philosophy in Computer Science and Engineering',
    code: 'PHD-CSE',
    duration: 3,
    department: 'Computer Science and Engineering',
    description: 'Research in AI, machine learning, cloud computing, IoT, cybersecurity, and emerging technologies.',
    eligibility: 'M.Tech/M.E in CSE or equivalent with minimum 60% or valid GATE/NET score.',
    totalSeats: 15,
    availableSeats: 15,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Electronics and Communication Engineering',
    code: 'PHD-ECE',
    duration: 3,
    department: 'Electronics and Communication Engineering',
    description: 'Research in wireless communications, VLSI, signal processing, and embedded systems.',
    eligibility: 'M.Tech/M.E in ECE or equivalent with minimum 60% or valid GATE/NET score.',
    totalSeats: 12,
    availableSeats: 12,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Mechanical Engineering',
    code: 'PHD-MECH',
    duration: 3,
    department: 'Mechanical Engineering',
    description: 'Research in advanced manufacturing, robotics, thermal engineering, and materials science.',
    eligibility: 'M.Tech/M.E in Mechanical Engineering or equivalent with minimum 60% or valid GATE/NET score.',
    totalSeats: 10,
    availableSeats: 10,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Management',
    code: 'PHD-MGMT',
    duration: 3,
    department: 'Management',
    description: 'Research in strategic management, organizational behavior, marketing, finance, and entrepreneurship.',
    eligibility: 'MBA/PGDM or equivalent with minimum 60% or valid NET/GMAT score.',
    totalSeats: 12,
    availableSeats: 12,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Biotechnology',
    code: 'PHD-BIOTECH',
    duration: 3,
    department: 'Biotechnology',
    description: 'Research in molecular biology, genetic engineering, bioinformatics, and pharmaceutical sciences.',
    eligibility: 'M.Sc/M.Tech in Biotechnology or equivalent with minimum 60% or valid GATE/NET score.',
    totalSeats: 10,
    availableSeats: 10,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Mathematics',
    code: 'PHD-MATHS',
    duration: 3,
    department: 'Mathematics',
    description: 'Research in pure mathematics, applied mathematics, statistics, and computational mathematics.',
    eligibility: 'M.Sc in Mathematics or equivalent with minimum 60% or valid NET score.',
    totalSeats: 8,
    availableSeats: 8,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Physics',
    code: 'PHD-PHY',
    duration: 3,
    department: 'Physics',
    description: 'Research in theoretical physics, condensed matter physics, nanoscience, and experimental physics.',
    eligibility: 'M.Sc in Physics or equivalent with minimum 60% or valid NET score.',
    totalSeats: 8,
    availableSeats: 8,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  },
  {
    name: 'Doctor of Philosophy in Chemistry',
    code: 'PHD-CHEM',
    duration: 3,
    department: 'Chemistry',
    description: 'Research in organic chemistry, inorganic chemistry, physical chemistry, and analytical chemistry.',
    eligibility: 'M.Sc in Chemistry or equivalent with minimum 60% or valid NET score.',
    totalSeats: 8,
    availableSeats: 8,
    fees: 40000,
    admissionFee: 10000,
    category: 'Doctoral',
    isActive: true
  }
];

const admissionCycles = [
  {
    name: 'Academic Year 2025-26',
    year: '2025-26',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-31'),
    isActive: true,
    description: 'Main admission cycle for the academic year 2025-26',
    allowApplications: true
  },
  {
    name: 'Spring Intake 2026',
    year: '2025-26',
    startDate: new Date('2025-11-01'),
    endDate: new Date('2026-01-15'),
    isActive: false,
    description: 'Spring semester intake for January 2026',
    allowApplications: false
  }
];

const announcements = [
  {
    title: 'Vignan University Admissions Open for 2025-26',
    message: 'Applications are now open for UG, PG, and PhD programmes at Vignan University. Apply before August 31, 2025.',
    type: 'general',
    targetAudience: 'all',
    isActive: true
  },
  {
    title: 'Special Scholarship for Meritorious Students',
    message: 'Students with 90% and above in qualifying exams are eligible for up to 50% fee waiver. Limited seats available.',
    type: 'important',
    targetAudience: 'applicants',
    isActive: true
  },
  {
    title: 'Campus Tour Dates Announced',
    message: 'Visit our state-of-the-art campus every Saturday and Sunday. Register online for guided tours.',
    type: 'info',
    targetAudience: 'applicants',
    isActive: true
  },
  {
    title: 'New AI & Data Science Labs Inaugurated',
    message: 'Vignan University now features cutting-edge AI, ML, and Data Science laboratories with industry-standard equipment.',
    type: 'general',
    targetAudience: 'all',
    isActive: true
  },
  {
    title: 'Placement Drive 2024-25 Update',
    message: 'Over 150+ companies scheduled for campus placements. Top recruiters include Microsoft, Google, Amazon, TCS, and Infosys.',
    type: 'important',
    targetAudience: 'all',
    isActive: true
  },
  {
    title: 'International Collaboration Programs',
    message: 'Students can now participate in exchange programs with partner universities in USA, UK, Germany, and Australia.',
    type: 'general',
    targetAudience: 'all',
    isActive: true
  },
  {
    title: 'Application Deadline Extension',
    message: 'Last date to apply extended to September 15, 2025 for select programmes. Check website for details.',
    type: 'urgent',
    targetAudience: 'applicants',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Get admin user for announcements
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('❌ Admin user not found. Please run seedAdmin.js first!');
      process.exit(1);
    }

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Course.deleteMany({});
    await AdmissionCycle.deleteMany({});
    await Announcement.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed Courses
    console.log('\n📚 Seeding courses...');
    const createdCourses = await Course.insertMany(vignanCourses);
    console.log(`✅ ${createdCourses.length} courses created`);

    // Seed Admission Cycles
    console.log('\n📅 Seeding admission cycles...');
    const createdCycles = await AdmissionCycle.insertMany(admissionCycles);
    console.log(`✅ ${createdCycles.length} admission cycles created`);

    // Seed Announcements (add createdBy field)
    console.log('\n📢 Seeding announcements...');
    const announcementsWithCreator = announcements.map(ann => ({
      ...ann,
      createdBy: adminUser._id
    }));
    const createdAnnouncements = await Announcement.insertMany(announcementsWithCreator);
    console.log(`✅ ${createdAnnouncements.length} announcements created`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎓 VIGNAN UNIVERSITY - DATABASE SEEDED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log(`
📊 SUMMARY:
   • Undergraduate Programmes: ${vignanCourses.filter(c => c.category === 'UG').length}
   • Postgraduate Programmes: ${vignanCourses.filter(c => c.category === 'PG').length}
   • Doctoral Programmes: ${vignanCourses.filter(c => c.category === 'Doctoral').length}
   • Total Courses: ${createdCourses.length}
   • Admission Cycles: ${createdCycles.length}
   • Announcements: ${createdAnnouncements.length}
   • Total Available Seats: ${vignanCourses.reduce((sum, c) => sum + c.availableSeats, 0)}
    `);

    console.log('📋 COURSE CATEGORIES:');
    console.log('   UG: B.Tech (9 specializations), B.Pharm, BCA, BBA, B.Sc, B.Com, B.A');
    console.log('   PG: M.Tech (6 specializations), MBA, MCA, M.Sc, M.Com');
    console.log('   PhD: Computer Science, ECE, Mechanical, Management, Biotechnology, Mathematics, Physics');
    
    console.log('\n✨ You can now start accepting applications!');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
