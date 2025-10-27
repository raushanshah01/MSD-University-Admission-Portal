import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';

const ProfileCustomization = ({ currentProfile = {} }) => {
  const [profile, setProfile] = useState({
    profilePicture: currentProfile.profilePicture || null,
    bannerImage: currentProfile.bannerImage || null,
    bio: currentProfile.bio || '',
    socialLinks: {
      linkedin: currentProfile.socialLinks?.linkedin || '',
      github: currentProfile.socialLinks?.github || '',
      twitter: currentProfile.socialLinks?.twitter || '',
      website: currentProfile.socialLinks?.website || '',
    },
  });

  const [previewImage, setPreviewImage] = useState(currentProfile.profilePicture || null);
  const [previewBanner, setPreviewBanner] = useState(currentProfile.bannerImage || null);
  const [saved, setSaved] = useState(false);

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setPreviewImage(reader.result);
          setProfile({ ...profile, profilePicture: file });
        } else {
          setPreviewBanner(reader.result);
          setProfile({ ...profile, bannerImage: file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfile({
      ...profile,
      socialLinks: {
        ...profile.socialLinks,
        [platform]: value,
      },
    });
  };

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // In real implementation, send to backend
    console.log('Saving profile:', profile);
  };

  return (
    <Box>
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {/* Banner and Profile Picture */}
      <Paper sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}>
        {/* Banner Image */}
        <Box
          sx={{
            height: 200,
            backgroundColor: 'primary.main',
            backgroundImage: previewBanner ? `url(${previewBanner})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="banner-upload"
            type="file"
            onChange={(e) => handleImageUpload(e, 'banner')}
          />
          <label htmlFor="banner-upload">
            <IconButton
              component="span"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </label>
        </Box>

        {/* Profile Picture */}
        <Box sx={{ p: 3, pt: 0, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
          <Box sx={{ position: 'relative', mt: -8 }}>
            <Avatar
              src={previewImage}
              sx={{
                width: 150,
                height: 150,
                border: '4px solid white',
                boxShadow: 2,
              }}
            >
              {!previewImage && 'User'}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-upload"
              type="file"
              onChange={(e) => handleImageUpload(e, 'profile')}
            />
            <label htmlFor="profile-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              {currentProfile.name || 'Your Name'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentProfile.email || 'your.email@example.com'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Bio Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          About Me
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Tell us about yourself, your interests, academic goals, achievements..."
          helperText={`${profile.bio.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
        />
      </Paper>

      {/* Social Links */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Social Links
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Connect your social profiles to showcase your online presence
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn Profile"
              value={profile.socialLinks.linkedin}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkedInIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GitHub Profile"
              value={profile.socialLinks.github}
              onChange={(e) => handleSocialLinkChange('github', e.target.value)}
              placeholder="https://github.com/username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Twitter Profile"
              value={profile.socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="https://twitter.com/username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TwitterIcon color="info" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Personal Website"
              value={profile.socialLinks.website}
              onChange={(e) => handleSocialLinkChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Preview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Preview
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar src={previewImage} sx={{ width: 60, height: 60 }}>
              User
            </Avatar>
            <Box>
              <Typography variant="h6">{currentProfile.name || 'Your Name'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentProfile.email || 'your.email@example.com'}
              </Typography>
            </Box>
          </Box>

          {profile.bio && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {profile.bio}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {profile.socialLinks.linkedin && (
              <IconButton size="small" color="primary" href={profile.socialLinks.linkedin} target="_blank">
                <LinkedInIcon />
              </IconButton>
            )}
            {profile.socialLinks.github && (
              <IconButton size="small" href={profile.socialLinks.github} target="_blank">
                <GitHubIcon />
              </IconButton>
            )}
            {profile.socialLinks.twitter && (
              <IconButton size="small" color="info" href={profile.socialLinks.twitter} target="_blank">
                <TwitterIcon />
              </IconButton>
            )}
            {profile.socialLinks.website && (
              <IconButton size="small" href={profile.socialLinks.website} target="_blank">
                <LanguageIcon />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileCustomization;
