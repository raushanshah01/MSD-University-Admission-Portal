import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';

const EmailVerificationDialog = ({ open, onClose, email }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const otpValue = otp.join('');
      if (otpValue === '123456') { // Mock verification
        setSuccess(true);
        setTimeout(() => onClose(true), 1500);
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  const handleResend = () => {
    setResendTimer(60);
    setError('');
    setOtp(['', '', '', '', '', '']);
    // Simulate resend
    alert('OTP sent to ' + email);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon color="primary" />
          <Typography variant="h6">Verify Your Email</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {!success ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold' },
                  }}
                  sx={{ width: 50 }}
                  disabled={loading}
                />
              ))}
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Didn't receive the code?{' '}
                <Button
                  size="small"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  sx={{ textTransform: 'none' }}
                >
                  Resend {resendTimer > 0 && `(${resendTimer}s)`}
                </Button>
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" color="success.main">
              Email Verified Successfully!
            </Typography>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions>
          <Button onClick={() => onClose(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            variant="contained"
            disabled={otp.some(d => !d) || loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            Verify
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

const TwoFactorAuthSetup = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('email');
  const [qrCode] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/UniversityPortal?secret=JBSWY3DPEHPK3PXP');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon color="primary" />
          <Typography variant="h6">Two-Factor Authentication</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {step === 1 && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add an extra layer of security to your account
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant={method === 'email' ? 'contained' : 'outlined'}
                onClick={() => setMethod('email')}
                startIcon={<EmailIcon />}
                fullWidth
              >
                Email Authentication
              </Button>
              
              <Button
                variant={method === 'app' ? 'contained' : 'outlined'}
                onClick={() => setMethod('app')}
                startIcon={<LockIcon />}
                fullWidth
              >
                Authenticator App (Google/Microsoft)
              </Button>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              You'll need to enter a verification code each time you log in
            </Alert>
          </>
        )}

        {step === 2 && method === 'app' && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Scan this QR code with your authenticator app
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img src={qrCode} alt="QR Code" style={{ border: '1px solid #ddd', padding: 8 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Or enter this code manually: JBSWY3DPEHPK3PXP
            </Typography>
          </Box>
        )}

        {step === 2 && method === 'email' && (
          <Typography variant="body2" color="text.secondary">
            A verification code will be sent to your registered email address each time you log in.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {step === 1 ? (
          <Button variant="contained" onClick={() => setStep(2)}>
            Continue
          </Button>
        ) : (
          <Button variant="contained" onClick={() => { alert('2FA Enabled!'); onClose(); }}>
            Enable 2FA
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export { EmailVerificationDialog, TwoFactorAuthSetup };
