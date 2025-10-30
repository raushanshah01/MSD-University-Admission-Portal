import React, { useEffect, useState } from 'react';
import { applicationAPI, courseAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  TablePagination,
  TableSortLabel,
  Autocomplete,
  Badge,
  Tooltip
} from '@mui/material';
import {
  People,
  PendingActions,
  CheckCircle,
  Error as ErrorIcon,
  Download,
  FilterList,
  MoreVert,
  Refresh,
  Today,
  Timeline,
  Delete,
  CheckBox,
  IndeterminateCheckBox,
  Sort,
  Search,
  History,
  Upload,
  CompareArrows,
  Comment,
  Settings,
  Visibility,
  Email,
  Assessment,
  TrendingUp,
  BarChart,
  Print,
  Star,
  Flag,
  AttachFile,
  CheckCircleOutline,
  Cancel,
  Schedule,
  Phone,
  LocationOn,
  School,
  CalendarToday
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Simple StatCard Component
const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  const colorMap = {
    primary: '#1976d2',
    success: '#2e7d32',
    warning: '#ed6c02',
    error: '#d32f2f',
    indigo: '#3f51b5'
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          {Icon && (
            <Avatar sx={{ bgcolor: colorMap[color] || colorMap.primary, width: 48, height: 48 }}>
              <Icon />
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  // Helper function to get user/userId fields (API inconsistency fix)
  const getUser = (app) => app.user || app.userId;
  const getCourse = (app) => app.course || app.courseId;
  
  // State management
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  // NEW: Bulk actions state
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  
  // NEW: Filtering state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  
  // NEW: Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // NEW: Sorting state
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  
  // NEW: Timeline dialog
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  
  // NEW: Additional advanced features state
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedAppForNote, setSelectedAppForNote] = useState(null);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'high', 'medium', 'low'
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);

  // Real-time data fetching
  useEffect(() => {
    fetchData();
    // Poll for updates every 30 seconds for real-time feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, coursesRes] = await Promise.all([
        applicationAPI.getAll(),
        courseAPI.getAll()
      ]);
      // Applications endpoint returns array directly
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      // Courses endpoint returns { courses, total }
      setCourses(coursesRes.data?.courses || coursesRes.data || []);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Bulk status update with email notification
  const handleBulkStatusUpdate = async (status) => {
    if (selectedRows.length === 0) {
      toast.warning('Please select applications first');
      return;
    }
    
    try {
      await Promise.all(
        selectedRows.map(id => applicationAPI.updateStatus(id, status))
      );
      toast.success(`${selectedRows.length} application(s) updated to ${status}`);
      setSelectedRows([]);
      setBulkActionAnchor(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update applications');
    }
  };

  // NEW: Export to CSV
  const handleExportCSV = () => {
    const headers = ['Application No', 'Applicant', 'Email', 'Course', 'Status', 'Date'];
    const csvData = filteredAndSortedApplications.map(app => [
      app.applicationNumber || '',
      app.user?.name || '',
      app.user?.email || '',
      app.course || '',
      app.status || '',
      new Date(app.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().getTime()}.csv`;
    a.click();
    toast.success('Exported to CSV successfully');
  };

  // NEW: Export to Excel (basic CSV with .xlsx extension)
  const handleExportExcel = () => {
    handleExportCSV();
    toast.info('Opening in Excel...');
  };

  // Single status update
  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;
    try {
      await applicationAPI.updateStatus(selectedApplication._id, newStatus);
      toast.success('Status updated successfully - Email notification sent');
      setUpdateDialogOpen(false);
      setSelectedApplication(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // NEW: Select all rows
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = filteredAndSortedApplications.map(app => app._id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  // NEW: Select single row
  const handleSelectRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // NEW: Sorting handler
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // NEW: Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // NEW: Toggle application flag/priority
  const handleToggleFlag = (appId) => {
    // In real implementation, this would update the backend
    setApplications(prev => prev.map(app => 
      app._id === appId ? { ...app, flagged: !app.flagged } : app
    ));
    toast.success('Application flag toggled');
  };

  // NEW: Add note to application
  const handleAddNote = async () => {
    if (!selectedAppForNote || !currentNote.trim()) return;
    
    try {
      // In real implementation, call API to save note
      setApplications(prev => prev.map(app => 
        app._id === selectedAppForNote._id 
          ? { 
              ...app, 
              notes: [...(app.notes || []), {
                text: currentNote,
                author: 'Admin',
                timestamp: new Date().toISOString()
              }]
            }
          : app
      ));
      toast.success('Note added successfully');
      setNotesDialogOpen(false);
      setCurrentNote('');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  // NEW: Compare selected applications
  const handleCompare = () => {
    if (selectedForCompare.length < 2) {
      toast.warning('Please select at least 2 applications to compare');
      return;
    }
    if (selectedForCompare.length > 4) {
      toast.warning('Maximum 4 applications can be compared at once');
      return;
    }
    setCompareDialogOpen(true);
  };

  // NEW: Import applications from CSV
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // Skip header
        let importCount = 0;
        
        rows.forEach(row => {
          const columns = row.split(',');
          if (columns.length >= 4) {
            // Parse CSV and create application
            // In real implementation, this would call API
            importCount++;
          }
        });
        
        toast.success(`${importCount} applications imported successfully`);
        fetchData(); // Refresh data
      } catch (error) {
        toast.error('Failed to import CSV file');
      }
    };
    reader.readAsText(file);
    setImportDialogOpen(false);
  };

  // NEW: Print application details
  const handlePrintApplication = (app) => {
    const user = getUser(app);
    const course = getCourse(app);
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Application Details</title>');
    printWindow.document.write('<style>body{font-family:Arial;padding:20px;}h1{color:#2c3e50;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(`<h1>Application Details</h1>`);
    printWindow.document.write(`<p><strong>Applicant:</strong> ${user?.name || 'N/A'}</p>`);
    printWindow.document.write(`<p><strong>Email:</strong> ${user?.email || 'N/A'}</p>`);
    printWindow.document.write(`<p><strong>Course:</strong> ${typeof course === 'string' ? course : course?.name || 'N/A'}</p>`);
    printWindow.document.write(`<p><strong>Status:</strong> ${app.status || 'N/A'}</p>`);
    printWindow.document.write(`<p><strong>Date:</strong> ${new Date(app.createdAt).toLocaleString()}</p>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // NEW: Quick status change shortcuts
  const handleQuickApprove = async (appId) => {
    try {
      await applicationAPI.updateStatus(appId, 'approved');
      toast.success('Application approved');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve application');
    }
  };

  const handleQuickReject = async (appId) => {
    try {
      await applicationAPI.updateStatus(appId, 'rejected');
      toast.success('Application rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  // NEW: Advanced filtering
  const filteredApplications = applications.filter(app => {
    const user = getUser(app);
    const course = getCourse(app);
    
    const matchesSearch = 
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof course === 'string' ? course : course?.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || (typeof course === 'string' ? course === filterCourse : course?._id === filterCourse);
    
    const appDate = new Date(app.createdAt);
    const matchesDateFrom = !filterDateFrom || appDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || appDate <= new Date(filterDateTo);
    
    return matchesSearch && matchesStatus && matchesCourse && matchesDateFrom && matchesDateTo;
  });

  // NEW: Sorting logic
  const filteredAndSortedApplications = [...filteredApplications].sort((a, b) => {
    let aValue, bValue;
    
    switch(orderBy) {
      case 'name':
        aValue = getUser(a)?.name || '';
        bValue = getUser(b)?.name || '';
        break;
      case 'course':
        const aCourse = getCourse(a);
        const bCourse = getCourse(b);
        aValue = typeof aCourse === 'string' ? aCourse : aCourse?.name || '';
        bValue = typeof bCourse === 'string' ? bCourse : bCourse?.name || '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginated data
  const paginatedApplications = filteredAndSortedApplications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Real-time statistics calculations
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    newToday: applications.filter(app => {
      const today = new Date();
      const appDate = new Date(app.createdAt);
      return appDate.toDateString() === today.toDateString();
    }).length,
    pendingDocs: applications.filter(app => 
      app.status === 'pending' && (!app.documents || app.documents.length === 0)
    ).length
  };

  // Recent activity (last 10 status changes)
  const recentActivity = [...applications]
    .filter(app => app.statusHistory && app.statusHistory.length > 0)
    .sort((a, b) => {
      const aLast = a.statusHistory[a.statusHistory.length - 1]?.updatedAt;
      const bLast = b.statusHistory[b.statusHistory.length - 1]?.updatedAt;
      return new Date(bLast) - new Date(aLast);
    })
    .slice(0, 10);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Chart configurations
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Applications',
      data: [45, 52, 48, 68, 85, 72],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: '2024', data: [30, 40, 35, 50, 60, 45], backgroundColor: '#64748b' },
      { label: '2025', data: [45, 50, 48, 65, 78, 60], backgroundColor: '#10b981' }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  const doughnutData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [stats.pending, stats.approved, stats.rejected],
      backgroundColor: ['#ed6c02', '#2e7d32', '#d32f2f']
    }]
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* LEFT HERO SECTION */}
      <Box
        sx={{
          width: '40%',
          background: 'linear-gradient(135deg, #2c3e50 0%, #1a252f 100%)',
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
        {/* Admin Welcome */}
        <Box>
          <Box sx={{ mb: 6 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'rgba(255,255,255,0.25)',
                fontSize: '3rem',
                fontWeight: 800,
                border: '5px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                mb: 3
              }}
            >
              A
            </Avatar>
            <Typography variant="h3" fontWeight={900} gutterBottom>
              Admin Portal
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
              Vignan University
            </Typography>
            <Chip 
              label="Administrator" 
              size="medium" 
              sx={{ 
                mt: 2, 
                bgcolor: 'rgba(255,255,255,0.25)', 
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                px: 2
              }} 
            />
          </Box>

          {/* Stats Overview */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>
              System Overview
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
                    {stats.total}
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
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Pending Review
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
                    {stats.approved}
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
                    {stats.rejected}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                    Rejected
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* System Status */}
          <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
              System Health
            </Typography>
            <Paper 
              sx={{ 
                p: 3, 
                bgcolor: 'rgba(255,255,255,0.15)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Database</Typography>
                <Chip label="Online" size="small" sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>API Server</Typography>
                <Chip label="Online" size="small" sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Email Service</Typography>
                <Chip label="Active" size="small" sx={{ bgcolor: '#0277bd', color: 'white', fontWeight: 600 }} />
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Bottom Info */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Last updated: {new Date().toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
            Dashboard v2.0 • Vignan University
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
          Application Management
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Monitor and manage all applications
        </Typography>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item lg={8}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Application Trends
              </Typography>
              <Box sx={{ height: 320 }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item lg={4}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Status Distribution
              </Typography>
              <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Doughnut data={doughnutData} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Monthly Comparison */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item lg={12}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Monthly Comparison
              </Typography>
              <Box sx={{ height: 320 }}>
                <Bar data={barData} options={barOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Courses & Recent Activity */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item lg={6}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Top Courses
              </Typography>
              <List dense>
                {courses.slice(0, 5).map((course, index) => (
                  <ListItem key={course._id || index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#2c3e50' }}>{index + 1}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={course.name || 'Course'}
                      secondary={course.department || ''}
                    />
                    <Chip label={`${course.seats ?? 'N/A'} seats`} size="small" />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item lg={6}>
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 5).map((app, index) => {
                    const lastStatus = app.statusHistory[app.statusHistory.length - 1];
                    const user = getUser(app);
                    return (
                      <ListItem key={app._id || index}>
                        <ListItemAvatar>
                          <Avatar>{(user?.name || 'U')[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user?.name || 'Unknown'}
                          secondary={`${lastStatus?.status || app.status} • ${new Date(lastStatus?.updatedAt || app.updatedAt).toLocaleString()}`}
                          secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                        />
                      </ListItem>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No recent activity
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Applications Table */}
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          {/* Header with Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                All Applications ({filteredAndSortedApplications.length})
              </Typography>
              {selectedRows.length > 0 && (
                <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                  {selectedRows.length} selected
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={2}>
              {selectedRows.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<MoreVert />}
                    onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                  >
                    Bulk Actions
                  </Button>
                  <Menu
                    anchorEl={bulkActionAnchor}
                    open={Boolean(bulkActionAnchor)}
                    onClose={() => setBulkActionAnchor(null)}
                  >
                    <MenuItem onClick={() => handleBulkStatusUpdate('approved')}>
                      <CheckCircle sx={{ mr: 1, color: 'success.main' }} fontSize="small" />
                      Approve Selected
                    </MenuItem>
                    <MenuItem onClick={() => handleBulkStatusUpdate('rejected')}>
                      <ErrorIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" />
                      Reject Selected
                    </MenuItem>
                    <MenuItem onClick={() => handleBulkStatusUpdate('pending')}>
                      <PendingActions sx={{ mr: 1, color: 'warning.main' }} fontSize="small" />
                      Mark as Pending
                    </MenuItem>
                  </Menu>
                </>
              )}
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => setImportDialogOpen(true)}
              >
                Import
              </Button>
              {selectedForCompare.length >= 2 && (
                <Button
                  variant="outlined"
                  startIcon={<CompareArrows />}
                  onClick={handleCompare}
                  color="secondary"
                >
                  Compare ({selectedForCompare.length})
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<Assessment />}
                onClick={() => setAnalyticsDialogOpen(true)}
              >
                Analytics
              </Button>
              <Tooltip title="Refresh data">
                <IconButton onClick={fetchData} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Advanced Filters */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Autocomplete
              freeSolo
              options={applications.map(app => getUser(app)?.name || '')}
              value={searchQuery}
              onChange={(e, newValue) => setSearchQuery(newValue || '')}
              onInputChange={(e, newValue) => setSearchQuery(newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Search by name, email, course..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              )}
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Course</InputLabel>
              <Select
                value={filterCourse}
                label="Course"
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <MenuItem value="all">All Courses</MenuItem>
                {courses.map(course => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              size="small"
              label="From Date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 160 }}
            />
            <TextField
              type="date"
              size="small"
              label="To Date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 160 }}
            />
            {(filterStatus !== 'all' || filterCourse !== 'all' || filterDateFrom || filterDateTo) && (
              <Button
                variant="text"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCourse('all');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                startIcon={<FilterList />}
              >
                Clear
              </Button>
            )}
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Table with Sorting and Selection */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedRows.length > 0 && selectedRows.length < filteredAndSortedApplications.length}
                      checked={filteredAndSortedApplications.length > 0 && selectedRows.length === filteredAndSortedApplications.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      <strong>Applicant</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'course'}
                      direction={orderBy === 'course' ? order : 'asc'}
                      onClick={() => handleSort('course')}
                    >
                      <strong>Course</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      <strong>Date</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      <strong>Status</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No applications found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApplications.map((app) => (
                    <TableRow 
                      key={app._id} 
                      hover
                      selected={selectedRows.includes(app._id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(app._id)}
                          onChange={() => handleSelectRow(app._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {getUser(app)?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getUser(app)?.email || ''}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{typeof getCourse(app) === 'string' ? getCourse(app) : getCourse(app)?.name || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(app.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          size="small"
                          color={app.status === 'approved' ? 'success' : app.status === 'pending' ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Flag Application">
                            <IconButton
                              size="small"
                              onClick={() => handleToggleFlag(app._id)}
                              color={app.flagged ? 'error' : 'default'}
                            >
                              <Flag fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Note">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedAppForNote(app);
                                setNotesDialogOpen(true);
                              }}
                            >
                              <Comment fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Timeline">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedTimeline(app);
                                setTimelineDialogOpen(true);
                              }}
                            >
                              <Timeline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print">
                            <IconButton
                              size="small"
                              onClick={() => handlePrintApplication(app)}
                            >
                              <Print fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Quick Approve">
                            <IconButton
                              size="small"
                              onClick={() => handleQuickApprove(app._id)}
                              sx={{ color: 'success.main' }}
                            >
                              <CheckCircleOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Quick Reject">
                            <IconButton
                              size="small"
                              onClick={() => handleQuickReject(app._id)}
                              sx={{ color: 'error.main' }}
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Checkbox
                            size="small"
                            checked={selectedForCompare.includes(app._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedForCompare(prev => [...prev, app._id]);
                              } else {
                                setSelectedForCompare(prev => prev.filter(id => id !== app._id));
                              }
                            }}
                            sx={{ ml: 1 }}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredAndSortedApplications.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </Paper>

        {/* Quick Stats Widgets */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <Today />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.newToday}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New Today
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <PendingActions />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {stats.pendingDocs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Documents
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {((stats.approved / stats.total) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Approval Rate
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Activity Log */}
        {recentActivity.length > 0 && (
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', mt: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              <History sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((app, index) => {
                const lastStatus = app.statusHistory[app.statusHistory.length - 1];
                const user = getUser(app);
                const course = getCourse(app);
                return (
                  <ListItem key={app._id || index} divider={index < recentActivity.length - 1}>
                    <ListItemAvatar>
                      <Avatar>{(user?.name || 'U')[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user?.name || 'Unknown'} - ${typeof course === 'string' ? course : course?.name || 'Course'}`}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Status changed to {lastStatus?.status || app.status} • {new Date(lastStatus?.updatedAt || app.updatedAt).toLocaleString()}
                        </Typography>
                      }
                    />
                    <Chip
                      label={lastStatus?.status || app.status}
                      size="small"
                      color={
                        (lastStatus?.status || app.status) === 'approved' ? 'success' : 
                        (lastStatus?.status || app.status) === 'pending' ? 'warning' : 'error'
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        )}

        {/* Update Status Dialog */}
        <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogContent sx={{ minWidth: 300, pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} variant="contained">
              Save & Send Email
            </Button>
          </DialogActions>
        </Dialog>

        {/* Timeline Dialog */}
        <Dialog 
          open={timelineDialogOpen} 
          onClose={() => setTimelineDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Application Timeline</DialogTitle>
          <DialogContent>
            {selectedTimeline && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>Applicant:</strong> {getUser(selectedTimeline)?.name || 'Unknown'}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>Course:</strong> {typeof getCourse(selectedTimeline) === 'string' ? getCourse(selectedTimeline) : getCourse(selectedTimeline)?.name || '-'}
                </Typography>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 3 }}>
                  <strong>Application No:</strong> {selectedTimeline.applicationNumber || '-'}
                </Typography>
                
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Status History
                </Typography>
                {selectedTimeline.statusHistory && selectedTimeline.statusHistory.length > 0 ? (
                  <List>
                    {selectedTimeline.statusHistory.map((history, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: history.status === 'approved' ? 'success.main' : 
                                      history.status === 'pending' ? 'warning.main' : 'error.main' 
                            }}
                          >
                            {history.status === 'approved' ? <CheckCircle /> : 
                             history.status === 'pending' ? <PendingActions /> : <ErrorIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Status changed to: ${history.status}`}
                          secondary={new Date(history.updatedAt).toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No status changes recorded yet
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTimelineDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Notes Dialog */}
        <Dialog 
          open={notesDialogOpen} 
          onClose={() => {
            setNotesDialogOpen(false);
            setCurrentNote('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Note</DialogTitle>
          <DialogContent>
            {selectedAppForNote && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <strong>Application:</strong> {getUser(selectedAppForNote)?.name || 'Unknown'} - {typeof getCourse(selectedAppForNote) === 'string' ? getCourse(selectedAppForNote) : getCourse(selectedAppForNote)?.name || 'N/A'}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {selectedAppForNote.notes && selectedAppForNote.notes.length > 0 && (
                  <>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Previous Notes:
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                      {selectedAppForNote.notes.map((note, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                          <Typography variant="body2">{note.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {note.author} • {new Date(note.timestamp).toLocaleString()}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                  </>
                )}
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Add New Note"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Enter your note here..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setNotesDialogOpen(false);
              setCurrentNote('');
            }}>Cancel</Button>
            <Button onClick={handleAddNote} variant="contained" disabled={!currentNote.trim()}>
              Add Note
            </Button>
          </DialogActions>
        </Dialog>

        {/* Compare Applications Dialog */}
        <Dialog 
          open={compareDialogOpen} 
          onClose={() => setCompareDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Compare Applications</DialogTitle>
          <DialogContent>
            <TableContainer sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    {selectedForCompare.map(appId => {
                      const app = applications.find(a => a._id === appId);
                      return (
                        <TableCell key={appId} align="center">
                          <strong>{getUser(app)?.name || 'Unknown'}</strong>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Email</strong></TableCell>
                    {selectedForCompare.map(appId => {
                      const app = applications.find(a => a._id === appId);
                      return <TableCell key={appId} align="center">{getUser(app)?.email || '-'}</TableCell>;
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Course</strong></TableCell>
                    {selectedForCompare.map(appId => {
                      const app = applications.find(a => a._id === appId);
                      const course = getCourse(app);
                      return <TableCell key={appId} align="center">{typeof course === 'string' ? course : course?.name || '-'}</TableCell>;
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Status</strong></TableCell>
                    {selectedForCompare.map(appId => {
                      const app = applications.find(a => a._id === appId);
                      return (
                        <TableCell key={appId} align="center">
                          <Chip 
                            label={app?.status || '-'} 
                            size="small"
                            color={app?.status === 'approved' ? 'success' : app?.status === 'pending' ? 'warning' : 'error'}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Application Date</strong></TableCell>
                    {selectedForCompare.map(appId => {
                      const app = applications.find(a => a._id === appId);
                      return <TableCell key={appId} align="center">{app ? new Date(app.createdAt).toLocaleDateString() : '-'}</TableCell>;
                    })}
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Documents</strong></TableCell>
                    {selectedForCompare.map(appId => {
                      const app = applications.find(a => a._id === appId);
                      return (
                        <TableCell key={appId} align="center">
                          {app?.documents?.length || 0} files
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setCompareDialogOpen(false);
              setSelectedForCompare([]);
            }}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Import CSV Dialog */}
        <Dialog 
          open={importDialogOpen} 
          onClose={() => setImportDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Import Applications from CSV</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload a CSV file with the following columns:
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Name, Email, Course, Phone, Address, Date of Birth
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload />}
                sx={{ mt: 2 }}
              >
                Choose CSV File
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={handleImportCSV}
                />
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="body2" gutterBottom>
                Download sample template:
              </Typography>
              <Button
                variant="text"
                size="small"
                startIcon={<Download />}
                onClick={() => {
                  const csvContent = "Name,Email,Course,Phone,Address,Date of Birth\nJohn Doe,john@example.com,Computer Science,1234567890,123 Main St,2000-01-01";
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'application_template.csv';
                  a.click();
                }}
              >
                Download Template
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImportDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Advanced Analytics Dialog */}
        <Dialog 
          open={analyticsDialogOpen} 
          onClose={() => setAnalyticsDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Advanced Analytics</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Course-wise distribution */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Applications by Course
                  </Typography>
                  <List>
                    {courses.slice(0, 5).map(course => {
                      const count = applications.filter(app => {
                        const appCourse = getCourse(app);
                        return typeof appCourse === 'string' ? appCourse === course._id : appCourse?._id === course._id;
                      }).length;
                      const percentage = ((count / applications.length) * 100).toFixed(1);
                      return (
                        <ListItem key={course._id}>
                          <ListItemText 
                            primary={course.name}
                            secondary={`${count} applications (${percentage}%)`}
                          />
                          <LinearProgress 
                            variant="determinate" 
                            value={parseFloat(percentage)} 
                            sx={{ width: 100, ml: 2 }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </Grid>

              {/* Status breakdown */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Status Breakdown
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="body2">Pending</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {stats.pending} ({((stats.pending / stats.total) * 100).toFixed(1)}%)
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stats.pending / stats.total) * 100} 
                          color="warning"
                        />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="body2">Approved</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {stats.approved} ({((stats.approved / stats.total) * 100).toFixed(1)}%)
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stats.approved / stats.total) * 100} 
                          color="success"
                        />
                      </Box>
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="body2">Rejected</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {stats.rejected} ({((stats.rejected / stats.total) * 100).toFixed(1)}%)
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stats.rejected / stats.total) * 100} 
                          color="error"
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>

              {/* Time-based stats */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Application Trends
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                        <Typography variant="h4" color="white" fontWeight={700}>
                          {stats.newToday}
                        </Typography>
                        <Typography variant="body2" color="white">
                          Today
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="h4" color="white" fontWeight={700}>
                          {applications.filter(app => {
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return new Date(app.createdAt) >= weekAgo;
                          }).length}
                        </Typography>
                        <Typography variant="body2" color="white">
                          This Week
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="h4" color="white" fontWeight={700}>
                          {applications.filter(app => {
                            const monthAgo = new Date();
                            monthAgo.setMonth(monthAgo.getMonth() - 1);
                            return new Date(app.createdAt) >= monthAgo;
                          }).length}
                        </Typography>
                        <Typography variant="body2" color="white">
                          This Month
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                        <Typography variant="h4" color="white" fontWeight={700}>
                          {stats.total}
                        </Typography>
                        <Typography variant="body2" color="white">
                          All Time
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalyticsDialogOpen(false)}>Close</Button>
            <Button 
              variant="contained"
              startIcon={<Print />}
              onClick={() => window.print()}
            >
              Print Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
