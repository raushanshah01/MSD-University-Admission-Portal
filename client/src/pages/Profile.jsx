import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Lock,
  Visibility,
  VisibilityOff,
  AccountCircle,
  Badge,
  CalendarMonth,
  Business,
} from '@mui/icons-material';

export default function Profile() {
  const { user } = useAuth();
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    gender: '',
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    // Load user profile data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call to update profile
      // await api.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setEditingPersonal(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // API call to change password
      // await api.changePassword(passwordData);
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setEditingPassword(false);
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #2c3e50 0%, #546e7a 100%)',
            color: 'white',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'rgba(255,255,255,0.05)',
            }
          }}
        >
          <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  boxShadow: 3,
                }}
              >
                {getInitials(profileData.name)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {profileData.name || 'User Profile'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, mb: 1 }}>
                {profileData.email}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<Badge />}
                  label={user?.role?.toUpperCase() || 'USER'}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                {profileData.city && (
                  <Chip
                    icon={<LocationOn />}
                    label={`${profileData.city}${profileData.state ? ', ' + profileData.state : ''}`}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Personal Information Card */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 0, borderRadius: 2 }}>
              <CardContent sx={{ p: 0 }}>
                {/* Card Header */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#fafafa',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AccountCircle sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Personal Information
                    </Typography>
                  </Box>
                  {!editingPersonal ? (
                    <Button
                      startIcon={<Edit />}
                      onClick={() => setEditingPersonal(true)}
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        variant="contained"
                        size="small"
                        disabled={loading}
                        sx={{ fontWeight: 600 }}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        onClick={() => {
                          setEditingPersonal(false);
                          // Reset form data
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </Box>

                {/* Card Content */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Full Name */}
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Full Name
                      </Typography>
                      <TextField
                        fullWidth
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        placeholder="Enter your full name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        name="email"
                        value={profileData.email}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#f5f5f5',
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Email cannot be changed
                      </Typography>
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        placeholder="+91 XXXXX XXXXX"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>

                    {/* Date of Birth */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Date of Birth
                      </Typography>
                      <TextField
                        fullWidth
                        name="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonth color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>

                    {/* Gender */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Gender
                      </Typography>
                      <TextField
                        fullWidth
                        name="gender"
                        select
                        SelectProps={{ native: true }}
                        value={profileData.gender}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
                        Address Details
                      </Typography>
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        Street Address
                      </Typography>
                      <TextField
                        fullWidth
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        multiline
                        rows={2}
                        placeholder="House No., Street, Area"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                              <LocationOn color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        City
                      </Typography>
                      <TextField
                        fullWidth
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        placeholder="Enter city"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        State
                      </Typography>
                      <TextField
                        fullWidth
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        placeholder="Enter state"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>

                    {/* PIN Code */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                        PIN Code
                      </Typography>
                      <TextField
                        fullWidth
                        name="pincode"
                        value={profileData.pincode}
                        onChange={handleProfileChange}
                        disabled={!editingPersonal}
                        placeholder="6-digit PIN code"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: editingPersonal ? 'white' : '#fafafa',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Security & Password Card */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 0, borderRadius: 2, mb: 3 }}>
              <CardContent sx={{ p: 0 }}>
                {/* Card Header */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#fafafa',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Lock sx={{ color: 'primary.main', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Security Settings
                    </Typography>
                  </Box>
                </Box>

                {/* Card Content */}
                <Box sx={{ p: 3 }}>
                  {!editingPassword ? (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Keep your account secure by using a strong password and changing it regularly.
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Lock />}
                        onClick={() => setEditingPassword(true)}
                        fullWidth
                        sx={{ fontWeight: 600 }}
                      >
                        Change Password
                      </Button>
                    </Box>
                  ) : (
                    <form onSubmit={handleChangePassword}>
                      <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                            Current Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Enter current password"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                                    }
                                    edge="end"
                                  >
                                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: 'white',
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                            New Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="At least 6 characters"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                                    }
                                    edge="end"
                                  >
                                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: 'white',
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
                            Confirm New Password
                          </Typography>
                          <TextField
                            fullWidth
                            name="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            placeholder="Re-enter new password"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                                    }
                                    edge="end"
                                  >
                                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: 'white',
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                              disabled={loading}
                              fullWidth
                              sx={{ fontWeight: 600 }}
                            >
                              {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setEditingPassword(false);
                                setPasswordData({
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: '',
                                });
                              }}
                              sx={{ fontWeight: 600 }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card sx={{ border: '1px solid #e0e0e0', boxShadow: 0, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Account Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Account Type
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Member Since
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Account Status
                    </Typography>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: '#4caf50',
                        color: 'white',
                        fontWeight: 600,
                        mt: 0.5,
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
