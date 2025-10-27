import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SocialLoginButtons = ({ onSocialLogin }) => {
  const [loading, setLoading] = useState(null);
  const [redirectDialog, setRedirectDialog] = useState(null);

  const handleSocialLogin = (provider) => {
    setLoading(provider);
    setRedirectDialog(provider);
    
    // Simulate OAuth redirect
    setTimeout(() => {
      setLoading(null);
      onSocialLogin?.(provider);
    }, 2000);
  };

  const socialProviders = [
    { id: 'google', name: 'Google', icon: <GoogleIcon />, color: '#DB4437' },
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon />, color: '#4267B2' },
    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
    { id: 'github', name: 'GitHub', icon: <GitHubIcon />, color: '#333' },
  ];

  return (
    <Box>
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outlined"
            size="large"
            fullWidth
            startIcon={loading === provider.id ? <CircularProgress size={20} /> : provider.icon}
            disabled={loading !== null}
            onClick={() => handleSocialLogin(provider.id)}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: provider.color,
                backgroundColor: `${provider.color}10`,
              },
            }}
          >
            Continue with {provider.name}
          </Button>
        ))}
      </Box>

      {/* Redirect Dialog */}
      <Dialog open={!!redirectDialog} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Redirecting to {redirectDialog}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be redirected to {redirectDialog} to authorize the login
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const SocialAccountLinking = ({ linkedAccounts = [], onLink, onUnlink }) => {
  const [linkDialog, setLinkDialog] = useState(null);
  const [unlinkDialog, setUnlinkDialog] = useState(null);

  const socialProviders = [
    { id: 'google', name: 'Google', icon: <GoogleIcon />, color: '#DB4437' },
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon />, color: '#4267B2' },
    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
    { id: 'github', name: 'GitHub', icon: <GitHubIcon />, color: '#333' },
  ];

  const handleLink = (provider) => {
    setLinkDialog(null);
    onLink?.(provider);
  };

  const handleUnlink = (provider) => {
    setUnlinkDialog(null);
    onUnlink?.(provider);
  };

  const isLinked = (providerId) => {
    return linkedAccounts.some(acc => acc.provider === providerId);
  };

  const getLinkedAccount = (providerId) => {
    return linkedAccounts.find(acc => acc.provider === providerId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Connected Accounts
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Link your social accounts for faster login
      </Typography>

      <List>
        {socialProviders.map((provider) => {
          const linked = isLinked(provider.id);
          const account = getLinkedAccount(provider.id);

          return (
            <Paper key={provider.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: provider.color }}>
                    {provider.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={provider.name}
                  secondary={
                    linked ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption">
                          Connected as {account?.email || account?.username}
                        </Typography>
                      </Box>
                    ) : (
                      'Not connected'
                    )
                  }
                />
                <ListItemSecondaryAction>
                  {linked ? (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<LinkOffIcon />}
                      onClick={() => setUnlinkDialog(provider)}
                    >
                      Unlink
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={() => setLinkDialog(provider)}
                    >
                      Link
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          );
        })}
      </List>

      {/* Link Confirmation Dialog */}
      <Dialog open={!!linkDialog} onClose={() => setLinkDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Link {linkDialog?.name} Account</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You will be redirected to {linkDialog?.name} to authorize linking your account
          </Alert>
          <Typography variant="body2" color="text.secondary">
            After linking, you'll be able to log in using your {linkDialog?.name} account
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleLink(linkDialog?.id)}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unlink Confirmation Dialog */}
      <Dialog open={!!unlinkDialog} onClose={() => setUnlinkDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Unlink {unlinkDialog?.name} Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to unlink your {unlinkDialog?.name} account?
          </Alert>
          <Typography variant="body2" color="text.secondary">
            You won't be able to log in using {unlinkDialog?.name} after unlinking
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnlinkDialog(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => handleUnlink(unlinkDialog?.id)}>
            Unlink Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { SocialLoginButtons, SocialAccountLinking };
