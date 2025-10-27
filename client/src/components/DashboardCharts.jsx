import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Assignment,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ApplicationProgressTracker = ({ application }) => {
  const stages = [
    { label: 'Submitted', status: 'completed', date: application?.submittedDate || 'N/A', icon: CheckCircle },
    { label: 'Document Verification', status: application?.documentStatus || 'pending', date: application?.verificationDate || 'Pending', icon: Assignment },
    { label: 'Under Review', status: application?.reviewStatus || 'pending', date: application?.reviewDate || 'Pending', icon: HourglassEmpty },
    { label: 'Interview', status: application?.interviewStatus || 'pending', date: application?.interviewDate || 'Pending', icon: Schedule },
    { label: 'Final Decision', status: application?.finalStatus || 'pending', date: application?.decisionDate || 'Pending', icon: application?.finalStatus === 'approved' ? CheckCircle : Cancel },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'grey';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const completedStages = stages.filter(s => s.status === 'completed').length;
  const progress = (completedStages / stages.length) * 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Progress
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              {completedStages} of {stages.length} stages completed
            </Typography>
            <Typography variant="body2">{Math.round(progress)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Timeline position="alternate">
          {stages.map((stage, index) => {
            const IconComponent = stage.icon;
            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="text.secondary">
                  <Typography variant="caption">{stage.date}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={getStatusColor(stage.status)}>
                    <IconComponent fontSize="small" />
                  </TimelineDot>
                  {index < stages.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="body2" fontWeight={stage.status === 'completed' ? 'bold' : 'normal'}>
                    {stage.label}
                  </Typography>
                  <Chip
                    label={stage.status.replace('_', ' ')}
                    size="small"
                    color={getStatusColor(stage.status)}
                    sx={{ mt: 0.5 }}
                  />
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
};

const ApplicationStatisticsChart = ({ data }) => {
  const statusData = {
    labels: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          data?.pending || 0,
          data?.under_review || 0,
          data?.approved || 0,
          data?.rejected || 0,
        ],
        backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Status Distribution
        </Typography>
        <Box sx={{ height: 300 }}>
          <Doughnut data={statusData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

const ApplicationTrendChart = ({ data }) => {
  const trendData = {
    labels: data?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications Submitted',
        data: data?.submitted || [12, 19, 15, 25, 22, 30],
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Applications Approved',
        data: data?.approved || [5, 10, 8, 15, 12, 18],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Trends
        </Typography>
        <Box sx={{ height: 300 }}>
          <Line data={trendData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

const ProgramPopularityChart = ({ data }) => {
  const programData = {
    labels: data?.labels || ['Engineering', 'Management', 'Science', 'Arts', 'Commerce'],
    datasets: [
      {
        label: 'Applications',
        data: data?.applications || [45, 30, 20, 15, 10],
        backgroundColor: ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Program Popularity
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar data={programData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardStats = ({ stats }) => {
  const statCards = [
    { label: 'Total Applications', value: stats?.total || 0, color: '#2196f3', icon: Assignment },
    { label: 'Pending Review', value: stats?.pending || 0, color: '#ff9800', icon: HourglassEmpty },
    { label: 'Approved', value: stats?.approved || 0, color: '#4caf50', icon: CheckCircle },
    { label: 'Rejected', value: stats?.rejected || 0, color: '#f44336', icon: Cancel },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ borderLeft: `4px solid ${stat.color}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <IconComponent sx={{ fontSize: 40, color: stat.color, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export {
  ApplicationProgressTracker,
  ApplicationStatisticsChart,
  ApplicationTrendChart,
  ProgramPopularityChart,
  DashboardStats,
};
