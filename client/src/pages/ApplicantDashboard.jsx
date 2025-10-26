import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, notificationAPI, announcementAPI, handleAPIError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  CircularProgress,
  Avatar,
  Divider,
  Paper,
  Badge
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
  Schedule,
  CheckCircle,
  Add,
  Description,
  Recommend,
  School,
  ArrowForward,
  Notifications,
  Campaign
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
  <Card 
    elevation={0} 
    sx={{ 
      height: '100%',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)'
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {value}
          </Typography>
          {trend !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {trendUp ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography variant="caption" color={trendUp ? 'success.main' : 'error.main'}>
                {Math.abs(trend)}% vs last month
              </Typography>
            </Stack>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: color + '20',
            color: color,
            width: 56,
            height: 56
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

function ApplicantDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, notifRes, announcRes] = await Promise.all([
        applicationAPI.getMy(),
        notificationAPI.getAll(),
        announcementAPI.getAll()
      ]);

      setApplications(appsRes.data.applications || []);
      setNotifications(notifRes.data.notifications || []);
      setAnnouncements(announcRes.data.announcements || []);
    } catch (error) {
      handleAPIError(error, 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const successRate = applications.length > 0 ? ((approvedCount / applications.length) * 100).toFixed(1) : 0;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Chart Data
  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Progress',
        data: [20, 45, 70, 85],
        borderColor: '#2c3e50',
        backgroundColor: 'rgba(44, 62, 80, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const statusData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          applications.filter(a => a.status === 'pending').length,
          applications.filter(a => a.status === 'approved').length,
          applications.filter(a => a.status === 'rejected').length
        ],
        backgroundColor: ['#f57c00', '#2e7d32', '#c62828'],
        borderWidth: 0
      }
    ]
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* LEFT HERO SECTION */}
      <Box
        sx={{
          width: '40%',
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          color: 'white',
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {/* User Welcome */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={3} mb={6}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.3)',
                fontSize: '2.5rem',
                fontWeight: 700,
                border: '4px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95 }}>
                {user?.email}
              </Typography>
              <Chip 
                label="Applicant" 
                size="small" 
                sx={{ 
                  mt: 1, 
                  bgcolor: 'rgba(255,255,255,0.25)', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
            </Box>
          </Stack>

          {/* Stats Overview */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Your Progress
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h3" fontWeight={800} color="white">
                    {applications.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Total Applications
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h3" fontWeight={800} color="white">
                    {approvedCount}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Approved
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h3" fontWeight={800} color="white">
                    {pendingCount}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Pending
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3
                  }}
                >
                  <Typography variant="h3" fontWeight={800} color="white">
                    {successRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Success Rate
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Quick Actions */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                component={Link}
                to="/applicant/applications"
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Description />}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: 'white',
                  color: '#2c3e50',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateX(4px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                My Applications
              </Button>
              <Button
                component={Link}
                to="/applicant/recommendations"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Recommend />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Get Recommendations
              </Button>
              <Button
                component={Link}
                to="/courses"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<School />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Browse Courses
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Bottom Quote */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
            "Education is the most powerful weapon which you can use to change the world."
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
            — Nelson Mandela
          </Typography>
        </Box>
      </Box>

      {/* RIGHT MAIN CONTENT */}
      <Box
        sx={{
          flex: 1,
          p: 6,
          overflowY: 'auto',
          maxHeight: '100vh'
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Track your application journey and explore opportunities
        </Typography>

        {/* Application Status Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item lg={8}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Application Progress Timeline
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ height: 320 }}>
                  <Line
                    data={progressData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          grid: { color: '#f0f0f0' }
                        },
                        x: {
                          grid: { display: false }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item lg={4}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Status Distribution
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {applications.length > 0 ? (
                    <Doughnut
                      data={statusData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' }
                        },
                        cutout: '65%'
                      }}
                    />
                  ) : (
                    <Box textAlign="center">
                      <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary">No applications yet</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Applications & Notifications */}
        <Grid container spacing={3}>
          <Grid item lg={6}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Recent Applications
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {applications.length === 0 ? (
                  <Box textAlign="center" py={6}>
                    <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary" variant="body2" mb={2}>
                      You haven't submitted any applications yet
                    </Typography>
                    <Button
                      component={Link}
                      to="/courses"
                      variant="contained"
                      startIcon={<Add />}
                    >
                      Browse Courses
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {applications.slice(0, 5).map((app) => (
                      <ListItem
                        key={app._id}
                        sx={{
                          px: 0,
                          py: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 0 }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={600}>
                              {app.courseId?.name || 'Course Name'}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              Application #{app.applicationNumber}
                            </Typography>
                          }
                        />
                        <Chip
                          label={app.status}
                          size="small"
                          color={
                            app.status === 'approved'
                              ? 'success'
                              : app.status === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={6}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight={700}>
                    Notifications
                  </Typography>
                  {unreadNotifications > 0 && (
                    <Badge badgeContent={unreadNotifications} color="error">
                      <Notifications color="action" />
                    </Badge>
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <List sx={{ p: 0 }}>
                  {notifications.length === 0 ? (
                    <Box textAlign="center" py={6}>
                      <Notifications sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary" variant="body2">
                        No notifications yet
                      </Typography>
                    </Box>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <ListItem
                        key={notif._id}
                        sx={{
                          px: 0,
                          py: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          '&:last-child': { borderBottom: 0 }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={notif.read ? 400 : 700}>
                              {notif.title || notif.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Announcements */}
          <Grid item lg={12}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Campaign color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Important Announcements
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {announcements.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Campaign sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary" variant="body2">
                      No announcements at this time
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {announcements.slice(0, 3).map((ann) => (
                      <Grid item lg={4} key={ann._id}>
                        <Paper
                          sx={{
                            p: 3,
                            bgcolor: '#f8f9fa',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Typography variant="body1" fontWeight={700} gutterBottom>
                            {ann.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(ann.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ApplicantDashboard;
