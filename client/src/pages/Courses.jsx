import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Rating,
  Avatar,
  Badge,
  Fade,
} from '@mui/material';
import {
  School,
  Search,
  AccessTime,
  Category,
  AttachMoney,
  FavoriteBorder,
  Favorite,
  Star,
  Person,
  TrendingUp,
  NewReleases,
  EmojiEvents,
} from '@mui/icons-material';

export default function Courses() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [wishlist, setWishlist] = useState([]);

  // Toggle wishlist
  const toggleWishlist = (courseId) => {
    setWishlist((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Get badge for course
  const getCourseBadge = (course, index) => {
    if (index < 3) return { label: 'Popular', icon: <TrendingUp />, color: '#ff9800' };
    if (course.createdAt && new Date(course.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      return { label: 'New', icon: <NewReleases />, color: '#4caf50' };
    }
    if (course.type?.includes('Master') || course.type?.includes('PhD')) {
      return { label: 'Premium', icon: <EmojiEvents />, color: '#9c27b0' };
    }
    return null;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filterType, filterDuration, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAll();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((course) => course.type === filterType);
    }

    // Duration filter
    if (filterDuration !== 'all') {
      filtered = filtered.filter((course) => course.duration === filterDuration);
    }

    setFilteredCourses(filtered);
  };

  const getCourseTypes = () => {
    const types = [...new Set(courses.map((c) => c.type))];
    return types;
  };

  const getCourseDurations = () => {
    const durations = [...new Set(courses.map((c) => c.duration))];
    return durations;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <School sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom color="text.primary">
            Our Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore our wide range of programs designed to help you achieve your academic goals
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 4, p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Course Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Course Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {getCourseTypes().map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={filterDuration}
                  onChange={(e) => setFilterDuration(e.target.value)}
                  label="Duration"
                >
                  <MenuItem value="all">All Durations</MenuItem>
                  {getCourseDurations().map((duration) => (
                    <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* Courses Grid - Shopping Style */}
        {filteredCourses.length === 0 ? (
          <Alert severity="info">No courses found matching your criteria.</Alert>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)', // Mobile: 1 column
              sm: 'repeat(2, 1fr)',  // Small tablets: 2 columns
              md: 'repeat(3, 1fr)',  // Medium tablets: 3 columns
              lg: 'repeat(4, 1fr)',  // Large screens: 4 columns
              xl: 'repeat(5, 1fr)'   // Extra large: 5 columns
            },
            gap: { xs: 2, sm: 2.5, md: 3 }
          }}>
            {filteredCourses.map((course, index) => {
              const badge = getCourseBadge(course, index);
              const isWishlisted = wishlist.includes(course._id);
              // Generate random rating between 4.0 and 5.0
              const rating = (Math.random() * 1 + 4).toFixed(1);
              const reviewCount = Math.floor(Math.random() * 200) + 50;
              
              return (
                <Fade in timeout={300 + index * 50} key={course._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* Wishlist Button */}
                    <IconButton
                      onClick={() => toggleWishlist(course._id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        boxShadow: 2,
                        zIndex: 1,
                        '&:hover': { bgcolor: 'white', transform: 'scale(1.1)' },
                      }}
                      size="small"
                    >
                      {isWishlisted ? (
                        <Favorite sx={{ color: '#e91e63', fontSize: 20 }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>

                    {/* Badge */}
                    {badge && (
                      <Chip
                        icon={badge.icon}
                        label={badge.label}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: badge.color,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          zIndex: 1,
                          '& .MuiChip-icon': { color: 'white', fontSize: 16 },
                        }}
                      />
                    )}

                    <CardContent sx={{ flexGrow: 1, p: 2.5, pt: badge ? 5 : 2.5 }}>
                      <Chip
                        label={course.type}
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                          mb: 1.5,
                          fontSize: '0.7rem',
                        }}
                      />
                      
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                        {course.name}
                      </Typography>
                      
                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <Rating value={parseFloat(rating)} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          {rating}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({reviewCount})
                        </Typography>
                      </Box>

                      {course.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.4 }}>
                          {course.description.length > 80
                            ? `${course.description.substring(0, 80)}...`
                            : course.description}
                        </Typography>
                      )}

                      {/* Course Details */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {course.duration}
                          </Typography>
                        </Box>
                        {course.fees && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" fontWeight={600} color="primary.main">
                              ₹{course.fees.toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                        {/* Instructor Avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Avatar sx={{ width: 20, height: 20, bgcolor: 'secondary.main', fontSize: '0.7rem' }}>
                            {course.name.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">
                            Expert Faculty
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                        href="/login"
                      >
                        Apply Now
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}
