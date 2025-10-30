import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Rating,
  Fade,
  Grow,
} from '@mui/material';
import {
  School,
  Assignment,
  EmojiEvents,
  Groups,
  ArrowForward,
  CheckCircle,
  TrendingUp,
  Public,
  WorkspacePremium,
  AutoAwesome,
  FormatQuote,
} from '@mui/icons-material';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <School sx={{ fontSize: 48 }} />,
      title: 'Quality Education',
      description: 'World-class education with experienced faculty and modern infrastructure',
      color: '#2c3e50',
    },
    {
      icon: <Assignment sx={{ fontSize: 48 }} />,
      title: 'Easy Application',
      description: 'Simple and streamlined online application process with real-time tracking',
      color: '#546e7a',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 48 }} />,
      title: 'Scholarships',
      description: 'Merit-based and need-based scholarships for deserving students',
      color: '#2c3e50',
    },
    {
      icon: <Groups sx={{ fontSize: 48 }} />,
      title: 'Placement Support',
      description: 'Strong industry connections and dedicated placement assistance',
      color: '#546e7a',
    },
  ];

  const stats = [
    { value: '50+', label: 'Programs Offered', icon: <School /> },
    { value: '95%', label: 'Placement Rate', icon: <TrendingUp /> },
    { value: '200+', label: 'Expert Faculty', icon: <WorkspacePremium /> },
    { value: '10000+', label: 'Alumni Network', icon: <Public /> },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'B.Tech Graduate',
      rating: 5,
      text: 'Vignan University provided me with excellent opportunities and a strong foundation for my career. The faculty and facilities are top-notch.',
      avatar: 'R',
    },
    {
      name: 'Priya Patel',
      role: 'MBA Student',
      rating: 5,
      text: 'The supportive environment and industry connections helped me secure my dream job even before graduation. Highly recommend!',
      avatar: 'P',
    },
    {
      name: 'Amit Kumar',
      role: 'Alumni',
      rating: 5,
      text: 'The holistic approach to education, combining academics with practical skills, prepared me well for the corporate world.',
      avatar: 'A',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #546e7a 100%)',
          color: 'white',
          py: { xs: 8, sm: 12, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AutoAwesome sx={{ color: '#ffd700' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 1 }}>
                    EXCELLENCE IN EDUCATION
                  </Typography>
                </Box>
                <Typography
                  variant="h2"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Welcome to Vignan University
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                    fontWeight: 400,
                    opacity: 0.95,
                    lineHeight: 1.6,
                  }}
                >
                  Empowering students to achieve their dreams through quality education,
                  innovation, and excellence in learning.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    onClick={() => {
                      if (user && user.role === 'applicant') {
                        navigate('/applicant/apply');
                      } else if (user && user.role === 'admin') {
                        navigate('/admin');
                      } else {
                        navigate('/register');
                      }
                    }}
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: 3,
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    {user && user.role === 'applicant' ? 'Apply for Course' : user ? 'View Dashboard' : 'Apply Now'}
                  </Button>
                  <Button
                    component={Link}
                    to="/courses"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Explore Courses
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 300,
                      height: 300,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <School sx={{ fontSize: 150, opacity: 0.3 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 4, sm: 6 }, boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Grow in timeout={500 + index * 200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: '#fafafa' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="overline" color="primary" sx={{ fontSize: '1rem', fontWeight: 600, letterSpacing: 2 }}>
              OUR STRENGTHS
            </Typography>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: 'text.primary',
                mt: 1,
              }}
            >
              Why Choose Vignan University?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, maxWidth: '700px', mx: 'auto' }}
            >
              We provide a comprehensive learning experience that prepares you for success
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Grow in timeout={700 + index * 150}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: { xs: 2, sm: 3 },
                      border: '1px solid #e0e0e0',
                      boxShadow: 0,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: 8,
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: `${feature.color}15`,
                          color: feature.color,
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mx: 'auto',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="overline" color="primary" sx={{ fontSize: '1rem', fontWeight: 600, letterSpacing: 2 }}>
              STUDENT VOICES
            </Typography>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: 'text.primary',
                mt: 1,
              }}
            >
              What Our Students Say
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      border: '1px solid #e0e0e0',
                      boxShadow: 0,
                      borderRadius: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 5,
                      },
                    }}
                  >
                    <CardContent>
                      <FormatQuote sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, fontStyle: 'italic' }}>
                        "{testimonial.text}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Application Process Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 6, sm: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: 'text.primary',
              }}
            >
              Simple Application Process
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
            >
              Get started in just a few easy steps
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              { step: '1', title: 'Register', desc: 'Create your account on our portal' },
              { step: '2', title: 'Fill Application', desc: 'Complete the online application form' },
              { step: '3', title: 'Submit Documents', desc: 'Upload required documents' },
              { step: '4', title: 'Get Admission', desc: 'Receive your admission decision' },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 700,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button
              component={Link}
              to="/courses"
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
              endIcon={<ArrowForward />}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, sm: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem' } }}
            >
              Discover Your Future at Vignan University
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.95, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Explore our programs and find the perfect course for your career goals
            </Typography>
            <Button
              component={Link}
              to="/courses"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Browse Programs
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
