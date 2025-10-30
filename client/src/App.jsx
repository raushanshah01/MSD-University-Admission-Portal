import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/professional-enhancements.css';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { setupKeyboardShortcuts } from './utils/shortcuts';
import { requestNotificationPermission } from './utils/notifications';

// Components (loaded immediately - small size)
import Navbar from './components/Navbar';
import SkipLink from './components/SkipLink';
import OfflineIndicator from './components/OfflineIndicator';
import KeyboardShortcutsDialog from './components/KeyboardShortcutsDialog';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ApplicantDashboard = lazy(() => import('./pages/ApplicantDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'));
const MyApplications = lazy(() => import('./pages/MyApplications'));
const CourseRecommendations = lazy(() => import('./pages/CourseRecommendations'));
const Courses = lazy(() => import('./pages/Courses'));
const Help = lazy(() => import('./pages/Help'));
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const LanguageSwitcher = lazy(() => import('./components/LanguageSwitcher'));

// Enhanced Loading Component
const LoadingFallback = () => (
  <Box
    className="fade-in"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: 3,
      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
    }}
  >
    <Box sx={{ position: 'relative' }}>
      <CircularProgress 
        size={56} 
        thickness={4}
        sx={{
          color: 'primary.main',
          animationDuration: '1s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2c3e50 0%, #546e7a 100%)',
          }}
        />
      </Box>
    </Box>
    <Box 
      sx={{ 
        fontSize: '0.9375rem', 
        color: 'text.secondary',
        fontWeight: 500,
        letterSpacing: '0.5px',
      }}
      className="pulse"
    >
      Loading your content...
    </Box>
  </Box>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Main App Routes
function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isApplicationForm = location.pathname === '/applicant/apply';

  // Setup keyboard shortcuts
  useEffect(() => {
    const cleanup = setupKeyboardShortcuts(navigate);
    return cleanup;
  }, [navigate]);

  // Request notification permission for logged-in users
  useEffect(() => {
    if (user) {
      requestNotificationPermission();
    }
  }, [user]);

  return (
    <>
      <SkipLink />
      <OfflineIndicator />
      {!isApplicationForm && <Navbar />}
      <Box
        component="main"
        id="main-content"
        sx={{ 
          minHeight: '100vh',
          paddingTop: !isApplicationForm ? '64px' : '0', // Add padding when navbar is shown
        }}
        role="main"
        aria-label="Main content"
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/applicant'} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/applicant" /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Applicant Routes */}
            <Route
              path="/applicant"
              element={
                <ProtectedRoute allowedRoles={['applicant']}>
                  <ApplicantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicant/apply"
              element={
                <ProtectedRoute allowedRoles={['applicant']}>
                  <ApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicant/applications"
              element={
                <ProtectedRoute allowedRoles={['applicant']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applicant/recommendations"
              element={
                <ProtectedRoute allowedRoles={['applicant']}>
                  <CourseRecommendations />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'reviewer']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </Box>

      {/* Global Components */}
      <Suspense fallback={null}>
        <LanguageSwitcher />
        <KeyboardShortcutsDialog />
      </Suspense>
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={3}
            transition:Slide
            toastClassName="slide-in-right"
            style={{
              zIndex: 9999,
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
