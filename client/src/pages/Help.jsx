import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  HelpOutline,
  ExpandMore,
  Email,
  Phone,
  LocationOn,
  Send,
  QuestionAnswer,
  School,
  Assignment,
  Payment,
} from '@mui/icons-material';

const faqs = [
  {
    category: 'Application Process',
    icon: <Assignment />,
    questions: [
      {
        q: 'How do I apply for admission?',
        a: 'To apply for admission, first register an account on our portal. Once logged in, navigate to the "Apply" section and fill out the application form with your personal, contact, and academic information.',
      },
      {
        q: 'What documents do I need to submit?',
        a: 'You will need to upload scanned copies of your previous academic transcripts, ID proof, photographs, and any other documents specified in the application form for your chosen course.',
      },
      {
        q: 'Can I save my application and complete it later?',
        a: 'Yes! Our system automatically saves your progress. You can log back in at any time and continue from where you left off.',
      },
      {
        q: 'How long does it take to process my application?',
        a: 'Application processing typically takes 7-10 business days. You will receive email notifications about your application status updates.',
      },
    ],
  },
  {
    category: 'Courses & Programs',
    icon: <School />,
    questions: [
      {
        q: 'What courses does Vignan University offer?',
        a: 'Vignan University offers a wide range of undergraduate, postgraduate, and doctoral programs in Engineering, Management, Science, and Humanities. Visit the "Courses" page to see the complete list.',
      },
      {
        q: 'What are the eligibility criteria?',
        a: 'Eligibility criteria vary by program. Generally, undergraduate programs require 10+2 completion, while postgraduate programs require a relevant bachelor\'s degree. Check specific course details for exact requirements.',
      },
      {
        q: 'Are there any entrance exams required?',
        a: 'Some programs may require entrance exam scores. This information is available in the course details. We accept various national and state-level entrance exam scores.',
      },
    ],
  },
  {
    category: 'Fees & Scholarships',
    icon: <Payment />,
    questions: [
      {
        q: 'How much are the tuition fees?',
        a: 'Tuition fees vary by program. You can find detailed fee structures for each course on the "Courses" page or in the course catalog.',
      },
      {
        q: 'Are scholarships available?',
        a: 'Yes, we offer merit-based and need-based scholarships. Scholarship information is provided during the admission process, and you can apply for them through your applicant dashboard.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept online payments through credit/debit cards, net banking, and UPI. Payment links are provided after admission confirmation.',
      },
    ],
  },
  {
    category: 'Technical Support',
    icon: <QuestionAnswer />,
    questions: [
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and you will receive a password reset link.',
      },
      {
        q: 'I\'m having trouble uploading documents. What should I do?',
        a: 'Ensure your documents are in PDF or JPG format and under 5MB in size. Clear your browser cache and try again. If the issue persists, contact our support team.',
      },
      {
        q: 'Can I update my application after submission?',
        a: 'Once submitted, you cannot edit your application. However, you can contact the admissions office if you need to update critical information.',
      },
    ],
  },
];

export default function Help() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast.success('Your message has been sent! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          py: { xs: 4, sm: 6 },
          mb: { xs: 3, sm: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <HelpOutline
              sx={{
                fontSize: { xs: 56, sm: 72 },
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3rem' },
                color: 'text.primary',
              }}
            >
              Help & Support
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Find answers to common questions or get in touch with our support team
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: { xs: 4, sm: 6 } }}>
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          {/* FAQ Section */}
          <Grid item xs={12} lg={7}>
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 3, color: 'text.primary' }}
            >
              Frequently Asked Questions
            </Typography>

            {faqs.map((category, idx) => (
              <Box key={idx} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box sx={{ color: 'primary.main', display: 'flex' }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {category.category}
                  </Typography>
                </Box>

                {category.questions.map((faq, qIdx) => (
                  <Accordion
                    key={qIdx}
                    sx={{
                      mb: 1.5,
                      border: '1px solid #e0e0e0',
                      boxShadow: 0,
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        margin: '0 0 12px 0',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        '&:hover': {
                          bgcolor: '#fafafa',
                        },
                      }}
                    >
                      <Typography fontWeight={500}>{faq.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: '#fafafa', pt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {faq.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))}
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              {/* Contact Form */}
              <Paper
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  mb: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 0,
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Contact Us
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        startIcon={<Send />}
                        sx={{ py: 1.5, fontWeight: 600 }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>

              {/* Contact Information */}
              <Paper
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 0,
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
                  Get In Touch
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Email sx={{ color: 'primary.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        admissions@vignan.ac.in
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Phone sx={{ color: 'primary.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Phone
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        +91 863-2344700
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocationOn sx={{ color: 'primary.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        Vignan University<br />
                        Vadlamudi, Guntur<br />
                        Andhra Pradesh - 522213
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
