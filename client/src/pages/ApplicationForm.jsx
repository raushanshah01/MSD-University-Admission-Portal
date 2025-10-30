import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI, formProgressAPI, courseAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Person,
  ContactMail,
  School,
  CheckCircle,
  NavigateNext,
  NavigateBefore,
  Send,
  MenuBook,
  EmojiEvents,
  Security,
  Speed,
  Info,
  ArrowBack,
  Close,
} from '@mui/icons-material';

const STEPS = ['Personal Info', 'Contact Info', 'Academic Info', 'Review'];

export default function ApplicationForm() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const autoSaveTimer = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', dob: '', gender: '', category: '',
    phone: '', email: '', address: '', guardianName: '', guardianPhone: '',
    course: '', previousEducation: '', percentage: ''
  });

  useEffect(() => { loadCourses(); loadProgress(); }, []);

  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => saveProgressSilently(), 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [formData, currentStep]);

  const loadCourses = async () => {
    try {
      const { data } = await courseAPI.getAll();
      // Backend returns { courses, total }, extract courses array
      const coursesData = data?.courses || data || [];
      setCourses(coursesData.filter(c => c.isActive !== false));
    } catch (err) { toast.error('Failed to load courses'); }
  };

  const loadProgress = async () => {
    try {
      const { data } = await formProgressAPI.get();
      if (data?.formData) { setFormData(prev => ({ ...prev, ...data.formData })); setCurrentStep(data.step || 0); }
    } catch (err) { console.error('Failed to load progress:', err); }
  };

  const saveProgressSilently = async () => {
    try { await formProgressAPI.save(currentStep, formData); }
    catch (err) { console.error('Auto-save failed:', err); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (currentStep === 0 && (!formData.firstName || !formData.lastName || !formData.dob || !formData.gender)) {
      toast.error('Please fill all required fields'); return false;
    }
    if (currentStep === 1 && (!formData.email || !formData.phone || !formData.address)) {
      toast.error('Please fill all required fields'); return false;
    }
    if (currentStep === 2 && (!formData.course || !formData.previousEducation || !formData.percentage)) {
      toast.error('Please fill all required fields'); return false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1)); };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    if (!agreed) {
      toast.error('Please agree to the declaration');
      return;
    }
    
    // Additional validation for name fields
    if (!formData.firstName || !formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!formData.lastName || !formData.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    
    setLoading(true);
    try {
      const dataToSend = {
        name: {
          firstName: formData.firstName.trim(),
          middleName: formData.middleName ? formData.middleName.trim() : '',
          lastName: formData.lastName.trim()
        },
        dob: formData.dob,
        gender: formData.gender,
        category: formData.category || '',
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        guardianName: formData.guardianName || '',
        guardianPhone: formData.guardianPhone || '',
        course: formData.course,
        previousEducation: formData.previousEducation,
        percentage: formData.percentage
      };
      
      console.log('Submitting application:', dataToSend);
      await applicationAPI.submit(dataToSend);
      await formProgressAPI.clear();
      toast.success('Application submitted successfully!');
      navigate('/applicant/applications');
    } catch (err) { 
      console.error('Submission error:', err);
      toast.error(err.response?.data?.msg || 'Failed to submit application'); 
    }
    finally { setLoading(false); }
  };

  // Step icons
  const getStepIcon = (step) => {
    const icons = [<Person />, <ContactMail />, <School />, <CheckCircle />];
    return icons[step];
  };

  // Render step content
  const renderStepContent = (step) => {
    switch(step) {
      case 0:
        return (
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600}
              gutterBottom
              sx={{ 
                mb: 1,
                color: 'text.primary',
              }}
            >
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please provide your basic personal details as per your official documents
            </Typography>

            {/* Full Name Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Full Name
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Middle Name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="Enter middle name (optional)"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Personal Details Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? 'small' : 'medium'}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                    <InputLabel>Gender *</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      label="Gender *"
                      required
                      sx={{
                        bgcolor: '#fafafa'
                      }}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category"
                      sx={{
                        bgcolor: '#fafafa'
                      }}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="OBC">OBC - Other Backward Class</MenuItem>
                      <MenuItem value="SC">SC - Scheduled Caste</MenuItem>
                      <MenuItem value="ST">ST - Scheduled Tribe</MenuItem>
                      <MenuItem value="EWS">EWS - Economically Weaker Section</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600}
              gutterBottom
              sx={{ 
                mb: 1,
                color: 'text.primary',
              }}
            >
              Contact Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Provide your contact details so we can reach you
            </Typography>

            {/* Primary Contact Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Primary Contact
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    All communications will be sent to this email
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXXXXXXX"
                    required
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Include country code
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Address Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Residential Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Complete Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House No., Street, Area, City, State, PIN Code"
                    required
                    multiline
                    rows={3}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Guardian Details Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Guardian / Parent Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Guardian Name"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    placeholder="Enter guardian's full name"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Guardian Contact Number"
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXXXXXXX"
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600}
              gutterBottom
              sx={{ 
                mb: 1,
                color: 'text.primary',
              }}
            >
              Academic Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tell us about your educational background and program preference
            </Typography>

            {/* Previous Education Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Previous Education
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                    <InputLabel>Qualification Level *</InputLabel>
                    <Select
                      name="previousEducation"
                      value={formData.previousEducation}
                      onChange={handleInputChange}
                      label="Qualification Level *"
                      required
                      sx={{
                        bgcolor: '#fafafa'
                      }}
                    >
                      <MenuItem value="">Select Education Level</MenuItem>
                      <MenuItem value="High School">High School (10th Grade)</MenuItem>
                      <MenuItem value="Intermediate">Intermediate (10+2 / 12th Grade)</MenuItem>
                      <MenuItem value="Diploma">Diploma</MenuItem>
                      <MenuItem value="Graduation">Bachelor's Degree (Graduation)</MenuItem>
                      <MenuItem value="Post Graduation">Master's Degree (Post Graduation)</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Select your highest completed qualification
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Percentage / CGPA"
                    type="number"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="Enter marks (0-100)"
                    required
                    inputProps={{ step: 0.01, min: 0, max: 100 }}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Enter percentage or CGPA (converted to %)
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Course Selection Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                Program Selection
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                    <InputLabel>Choose Your Course *</InputLabel>
                    <Select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      label="Choose Your Course *"
                      required
                      sx={{
                        bgcolor: '#fafafa'
                      }}
                    >
                      <MenuItem value="">Select a course to apply</MenuItem>
                      {courses.map(course => (
                        <MenuItem key={course._id} value={course.name}>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {course.name} ({course.code})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Duration: {course.duration} • Type: {course.type}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Select the program you wish to apply for
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {formData.course && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={500}>
                  Selected Course: {formData.course}
                </Typography>
                <Typography variant="caption">
                  Please ensure you meet the eligibility criteria for this program
                </Typography>
              </Alert>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600}
              gutterBottom
              sx={{ 
                mb: 3,
                color: 'text.primary',
              }}
            >
              Review Your Application
            </Typography>
            
            {/* Personal Information */}
            <Card 
              sx={{ 
                mb: 3, 
                bgcolor: '#fafafa',
                border: '1px solid #e0e0e0',
                boxShadow: 0
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main" sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formData.firstName} {formData.middleName} {formData.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.dob}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.gender}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formData.category || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card 
              sx={{ 
                mb: 3, 
                bgcolor: '#fafafa',
                border: '1px solid #e0e0e0',
                boxShadow: 0
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main" sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.phone}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.address}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Guardian</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formData.guardianName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Guardian Phone</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formData.guardianPhone || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card 
              sx={{ 
                mb: 3, 
                bgcolor: '#fafafa',
                border: '1px solid #e0e0e0',
                boxShadow: 0
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary.main" sx={{ mb: 2 }}>
                  Academic Information
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Course</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.course}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Previous Education</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formData.previousEducation}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Percentage/CGPA</Typography>
                    <Typography variant="body1" fontWeight={500}>{formData.percentage}%</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Declaration */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={agreed} 
                    onChange={(e) => setAgreed(e.target.checked)} 
                    required 
                  />
                }
                label={
                  <Typography variant="body2">
                    I declare that all information provided is true and correct to the best of my knowledge.
                  </Typography>
                }
              />
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      bgcolor: '#f5f5f5',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      {/* Left Panel - Educational Info (Hidden on mobile, shown on tablet/desktop) */}
      {!isMobile && (
        <Box
          sx={{
            width: { md: '40%', lg: '35%' },
            bgcolor: 'primary.main',
            color: 'white',
            p: { sm: 3, md: 4, lg: 5 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
            },
          }}
        >
          {/* Logo/Branding */}
          <Box sx={{ mb: 4 }}>
            <School sx={{ fontSize: 56, mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              EduVoyage
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Empowering Future Leaders
            </Typography>
          </Box>

          {/* Progress Indicator */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Application Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={(currentStep / (STEPS.length - 1)) * 100}
                sx={{ 
                  flexGrow: 1, 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  }
                }}
              />
              <Typography variant="body2" fontWeight={600}>
                {Math.round((currentStep / (STEPS.length - 1)) * 100)}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Step {currentStep + 1} of {STEPS.length}
            </Typography>
          </Box>

          {/* Current Step Info */}
          <Box sx={{ mb: 4, p: 2.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {STEPS[currentStep]}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              {currentStep === 0 && "Please provide your basic personal details accurately."}
              {currentStep === 1 && "Enter your contact information so we can reach you."}
              {currentStep === 2 && "Tell us about your educational background and course preference."}
              {currentStep === 3 && "Review all information carefully before submitting your application."}
            </Typography>
          </Box>

          {/* Why Apply Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
              Why Choose Vignan?
            </Typography>
            <List sx={{ p: 0 }}>
              {[
                { icon: <MenuBook />, text: 'World-class academic programs' },
                { icon: <EmojiEvents />, text: '95% placement success rate' },
                { icon: <Security />, text: 'Secure online application process' },
                { icon: <Speed />, text: 'Quick admission decisions' },
              ].map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { opacity: 0.95 }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Help Text */}
          <Box sx={{ mt: 'auto', p: 2.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Info sx={{ fontSize: 20, mt: 0.3 }} />
              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Need Help?
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', lineHeight: 1.5 }}>
                  Your progress is automatically saved. Contact support at admissions@vignan.ac.in
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Right Panel - Application Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '60%', lg: '65%' },
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <IconButton 
                onClick={() => navigate('/applicant')}
                sx={{ color: 'white', mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
              <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                <School sx={{ fontSize: 40 }} />
              </Box>
              <Box sx={{ width: 40 }} /> {/* Spacer for balance */}
            </Box>
            <Typography variant="h6" fontWeight={700} textAlign="center">
              Admission Application
            </Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={(currentStep / (STEPS.length - 1)) * 100}
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  }
                }}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9, textAlign: 'center' }}>
                Step {currentStep + 1} of {STEPS.length} - {STEPS[currentStep]}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <Box sx={{ 
            borderBottom: '1px solid #e0e0e0', 
            p: { sm: 2.5, md: 3 },
            bgcolor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Admission Application Form
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Complete all steps to submit your application
              </Typography>
            </Box>
            <IconButton 
              onClick={() => navigate('/applicant')}
              sx={{ 
                bgcolor: 'white',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        )}

        {/* Stepper (Desktop/Tablet) */}
        {!isMobile && (
          <Box sx={{ 
            borderBottom: '1px solid #e0e0e0', 
            px: { sm: 2.5, md: 3 },
            py: 2.5,
            bgcolor: 'white'
          }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {STEPS.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: index === currentStep ? 600 : 400,
                        color: index === currentStep ? 'primary.main' : 'text.secondary'
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {/* Form Content - Scrollable */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 2.5, md: 3, lg: 4 },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#e0e0e0',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: '#d0d0d0',
              }
            },
          }}
        >
          <Box>
            {renderStepContent(currentStep)}
          </Box>
        </Box>

        {/* Fixed Bottom Navigation */}
        <Box
          sx={{
            borderTop: '1px solid #e0e0e0',
            p: { xs: 2, sm: 2.5, md: 3 },
            bgcolor: '#fafafa',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <Button
                variant="outlined"
                onClick={prevStep}
                disabled={currentStep === 0 || loading}
                startIcon={<NavigateBefore />}
                sx={{ 
                  minHeight: { xs: '46px', sm: '48px' },
                  minWidth: { xs: '100%', sm: '130px' },
                  borderColor: '#e0e0e0',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(44, 62, 80, 0.04)'
                  }
                }}
              >
                Previous
              </Button>

              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {currentStep < STEPS.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={nextStep}
                    disabled={loading}
                    endIcon={<NavigateNext />}
                    fullWidth={isMobile}
                    sx={{ 
                      minHeight: { xs: '46px', sm: '48px' },
                      minWidth: { sm: '130px' },
                      fontWeight: 600,
                    }}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={loading || !agreed}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    fullWidth={isMobile}
                    sx={{ 
                      minHeight: { xs: '46px', sm: '48px' },
                      minWidth: { sm: '160px' },
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
