import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const EligibilityCalculator = () => {
  const [formData, setFormData] = useState({
    tenthMarks: '',
    twelfthMarks: '',
    entranceScore: '',
    category: 'general',
    programType: 'undergraduate',
    preferredProgram: '',
    extracurricular: 0,
  });

  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateEligibility = () => {
    const { tenthMarks, twelfthMarks, entranceScore, category, extracurricular } = formData;

    // Eligibility calculation logic
    let eligibilityScore = 0;
    let weights = {
      tenth: 0.2,
      twelfth: 0.3,
      entrance: 0.4,
      extra: 0.1,
    };

    eligibilityScore += (parseFloat(tenthMarks) / 100) * weights.tenth * 100;
    eligibilityScore += (parseFloat(twelfthMarks) / 100) * weights.twelfth * 100;
    eligibilityScore += (parseFloat(entranceScore) / 100) * weights.entrance * 100;
    eligibilityScore += (extracurricular / 10) * weights.extra * 100;

    // Category-based adjustments
    const categoryBonus = {
      general: 0,
      obc: 5,
      sc: 10,
      st: 10,
    };
    eligibilityScore += categoryBonus[category] || 0;

    // Cap at 100
    eligibilityScore = Math.min(eligibilityScore, 100);

    // Determine eligibility status
    let status = 'Not Eligible';
    let color = 'error';
    let eligible = false;

    if (eligibilityScore >= 80) {
      status = 'Highly Eligible';
      color = 'success';
      eligible = true;
    } else if (eligibilityScore >= 60) {
      status = 'Eligible';
      color = 'success';
      eligible = true;
    } else if (eligibilityScore >= 40) {
      status = 'Conditionally Eligible';
      color = 'warning';
      eligible = true;
    }

    setResult({
      score: eligibilityScore.toFixed(1),
      status,
      color,
      eligible,
    });

    // Generate recommendations
    generateRecommendations(eligibilityScore);
  };

  const generateRecommendations = (score) => {
    const allPrograms = [
      { name: 'Computer Science Engineering', minScore: 85, category: 'Engineering' },
      { name: 'Electrical Engineering', minScore: 75, category: 'Engineering' },
      { name: 'Mechanical Engineering', minScore: 70, category: 'Engineering' },
      { name: 'Civil Engineering', minScore: 65, category: 'Engineering' },
      { name: 'Business Administration', minScore: 70, category: 'Management' },
      { name: 'Commerce', minScore: 60, category: 'Commerce' },
      { name: 'Arts', minScore: 50, category: 'Arts' },
      { name: 'Science', minScore: 65, category: 'Science' },
    ];

    const eligible = allPrograms.filter(p => score >= p.minScore);
    setRecommendations(eligible);
  };

  const isFormValid = () => {
    return (
      formData.tenthMarks &&
      formData.twelfthMarks &&
      formData.entranceScore &&
      parseFloat(formData.tenthMarks) <= 100 &&
      parseFloat(formData.twelfthMarks) <= 100 &&
      parseFloat(formData.entranceScore) <= 100
    );
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Eligibility Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Calculate your eligibility for various programs based on your academic performance
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="10th Grade Percentage"
              type="number"
              value={formData.tenthMarks}
              onChange={(e) => handleChange('tenthMarks', e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              helperText="Enter marks out of 100"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="12th Grade Percentage"
              type="number"
              value={formData.twelfthMarks}
              onChange={(e) => handleChange('twelfthMarks', e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              helperText="Enter marks out of 100"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Entrance Exam Score"
              type="number"
              value={formData.entranceScore}
              onChange={(e) => handleChange('entranceScore', e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              helperText="Enter score out of 100"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="obc">OBC</MenuItem>
                <MenuItem value="sc">SC</MenuItem>
                <MenuItem value="st">ST</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Program Type</InputLabel>
              <Select
                value={formData.programType}
                onChange={(e) => handleChange('programType', e.target.value)}
                label="Program Type"
              >
                <MenuItem value="undergraduate">Undergraduate</MenuItem>
                <MenuItem value="postgraduate">Postgraduate</MenuItem>
                <MenuItem value="phd">PhD</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>
              Extracurricular Activities Score (0-10)
            </Typography>
            <Slider
              value={formData.extracurricular}
              onChange={(e, value) => handleChange('extracurricular', value)}
              min={0}
              max={10}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={calculateEligibility}
              disabled={!isFormValid()}
            >
              Calculate Eligibility
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {result && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Eligibility Result
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" color={`${result.color}.main`} gutterBottom>
                    {result.score}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eligibility Score
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(result.score)}
                    color={result.color}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {result.eligible ? (
                      <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                    ) : (
                      <CancelIcon color="error" sx={{ fontSize: 40 }} />
                    )}
                    <Box>
                      <Typography variant="h6">{result.status}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {result.eligible
                          ? 'You meet the eligibility criteria'
                          : 'You do not meet the minimum requirements'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary">
                    <strong>Score Breakdown:</strong>
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">10th Grade (20%)</Typography>
                      <Typography variant="caption">{formData.tenthMarks}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">12th Grade (30%)</Typography>
                      <Typography variant="caption">{formData.twelfthMarks}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">Entrance Exam (40%)</Typography>
                      <Typography variant="caption">{formData.entranceScore}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">Extracurricular (10%)</Typography>
                      <Typography variant="caption">{formData.extracurricular}/10</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommended Programs
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Based on your eligibility score, you are eligible for the following programs:
              </Typography>

              <Grid container spacing={2}>
                {recommendations.map((program, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <SchoolIcon color="primary" />
                          <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                            {program.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={program.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Min Score: {program.minScore}%
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {parseFloat(result.score) < 60 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Tips to improve your eligibility:</strong>
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Improve your entrance exam score through regular practice" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmojiEventsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Participate in extracurricular activities and competitions" />
                    </ListItem>
                  </List>
                </Alert>
              )}
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default EligibilityCalculator;
