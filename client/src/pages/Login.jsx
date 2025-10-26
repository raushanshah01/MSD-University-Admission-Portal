import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, School } from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      if (result.role === 'admin' || result.role === 'reviewer') {
        navigate('/admin');
      } else {
        navigate('/applicant');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left Hero Section */}
      <Box
        sx={{
          flex: { xs: 0, md: 1 },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.1)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '500px' }}>
          <School sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Vignan University
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Begin Your Journey to Excellence
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
            Access your admission portal and take the next step towards a world-class education. 
            Join thousands of students who have transformed their future with us.
          </Typography>
        </Box>
      </Box>

      {/* Right Form Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fafafa',
          p: { xs: 3, sm: 4 },
          overflowY: 'auto',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '450px' }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
              <School sx={{ fontSize: 50, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to your Vignan University account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              sx={{ 
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white'
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              sx={{ 
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right" mb={3}>
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{ 
                mb: 2.5,
                minHeight: '48px',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  fontWeight={600}
                  sx={{ textDecoration: 'none' }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
