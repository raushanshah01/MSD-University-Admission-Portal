import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
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
import { LockReset, CheckCircle, ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(token, password);
      toast.success('Password reset successful! You can now login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
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
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your new password below.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
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
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
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
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{ mb: 2, fontWeight: 600, minHeight: '48px' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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
