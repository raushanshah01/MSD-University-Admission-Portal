import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../utils/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Email, LockReset, ArrowBack } from '@mui/icons-material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fafafa',
          p: 3,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '450px' }}>
          <Box textAlign="center" mb={3}>
            <Email sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
              Check Your Email
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            If an account exists with that email, we've sent password reset instructions.
          </Alert>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Please check your email and follow the link to reset your password.
          </Typography>

          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
            startIcon={<ArrowBack />}
            sx={{ fontWeight: 600 }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fafafa',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '450px' }}>
        <Box textAlign="center" mb={4}>
          <LockReset sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
              mb: 3,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white'
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Email />}
            sx={{ mb: 2, fontWeight: 600, minHeight: '48px' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Box textAlign="center">
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ textDecoration: 'none', fontWeight: 600 }}
            >
              Back to Login
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
