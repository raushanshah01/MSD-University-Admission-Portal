import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'Application Submitted',
      message: 'Your application for Computer Science has been submitted successfully',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 2,
      type: 'announcement',
      title: 'New Announcement',
      message: 'Admission deadline extended to March 31, 2024',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance',
      message: 'Portal will be under maintenance on Sunday 2 AM - 4 AM',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
    {
      id: 4,
      type: 'application',
      title: 'Document Verification',
      message: 'Your documents have been verified and approved',
      timestamp: new Date(Date.now() - 172800000),
      read: true,
    },
  ]);
  const [tabValue, setTabValue] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    announcements: true,
    systemAlerts: false,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application':
        return <AssignmentIcon color="primary" />;
      case 'announcement':
        return <AnnouncementIcon color="warning" />;
      case 'system':
        return <SystemUpdateIcon color="action" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const filterNotifications = () => {
    switch (tabValue) {
      case 0:
        return notifications;
      case 1:
        return notifications.filter(n => !n.read);
      case 2:
        return notifications.filter(n => n.type === 'application');
      case 3:
        return notifications.filter(n => n.type === 'announcement');
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications();
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <IconButton size="small" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" />
          <Tab label={`Unread (${unreadCount})`} />
          <Tab label="Applications" />
          <Tab label="Announcements" />
        </Tabs>

        <Box sx={{ p: 1 }}>
          {unreadCount > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={markAllAsRead}
                fullWidth
              >
                Mark all as read
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={clearAll}
                color="error"
                fullWidth
              >
                Clear all
              </Button>
            </Box>
          )}
        </Box>

        <Divider />

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            filteredNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                      {getIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">{notification.title}</Typography>
                        {!notification.read && (
                          <Chip label="New" color="primary" size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          display="block"
                          sx={{ mb: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </Typography>
                      </>
                    }
                  />
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          )}
        </List>

        {filteredNotifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button fullWidth size="small" onClick={handleClose}>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Popover>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notification Channels
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                />
              }
              label="Push Notifications"
            />
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notification Types
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.applicationUpdates}
                  onChange={(e) => setSettings({ ...settings, applicationUpdates: e.target.checked })}
                />
              }
              label="Application Updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.announcements}
                  onChange={(e) => setSettings({ ...settings, announcements: e.target.checked })}
                />
              }
              label="Announcements"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.systemAlerts}
                  onChange={(e) => setSettings({ ...settings, systemAlerts: e.target.checked })}
                />
              }
              label="System Alerts"
            />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              alert('Notification settings saved!');
              setSettingsOpen(false);
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
