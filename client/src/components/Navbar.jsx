import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, Container,
  Avatar, Button, Tooltip, MenuItem, Divider, Chip, Badge,
} from '@mui/material';
import {
  School, Dashboard, Assignment, Article,
  HelpOutline, Login as LoginIcon, PersonAdd, Logout, AccountCircle, Home,
  Notifications, Circle,
} from '@mui/icons-material';

const publicPages = [
  { name: 'Home', path: '/home', icon: <Home /> },
  { name: 'Courses', path: '/courses', icon: <School /> },
  { name: 'Help', path: '/help', icon: <HelpOutline /> },
];

const applicantPages = [
  { name: 'Dashboard', path: '/applicant', icon: <Dashboard /> },
  { name: 'My Applications', path: '/applicant/applications', icon: <Article /> },
];

const adminPages = [
  { name: 'Admin Dashboard', path: '/admin', icon: <Dashboard /> },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.slice(0, 5));
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNotifications = (event) => setAnchorElNotifications(event.currentTarget);
  const handleCloseNotifications = () => setAnchorElNotifications(null);
  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const getNavPages = () => {
    if (!user) return publicPages;
    if (user.role === 'admin') return [...publicPages, ...adminPages];
    return [...publicPages, ...applicantPages];
  };

  const navPages = getNavPages();

  return (
    <AppBar 
      position='sticky' 
      elevation={scrolled ? 4 : 0} 
      sx={{ 
        bgcolor: scrolled ? 'rgba(44, 62, 80, 0.98)' : 'primary.main', 
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid', 
        borderColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'divider',
        transition: 'all 0.3s ease-in-out',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ py: scrolled ? 0.5 : 1, transition: 'padding 0.3s ease-in-out' }}>
          {/* Logo and Brand */}
          <School sx={{ mr: 1, fontSize: scrolled ? 28 : 32, transition: 'font-size 0.3s ease-in-out' }} />
          <Typography 
            variant='h6' 
            noWrap 
            component={Link} 
            to='/' 
            sx={{ 
              mr: 2, 
              fontWeight: 700, 
              color: 'inherit', 
              textDecoration: 'none',
              fontSize: scrolled ? '1.15rem' : '1.25rem',
              transition: 'font-size 0.3s ease-in-out',
            }}
          >
            Vignan University
          </Typography>

          {/* Desktop Navigation - Always visible */}
          <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
            {navPages.map((page) => (
              <Button 
                key={page.name} 
                component={Link} 
                to={page.path} 
                startIcon={page.icon} 
                sx={{ 
                  my: 2, 
                  mx: 0.5, 
                  color: 'white', 
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }, 
                  '&::after': isActive(page.path) ? { 
                    content: '""', 
                    position: 'absolute', 
                    bottom: 0, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '80%', 
                    height: '2px', 
                    bgcolor: 'white' 
                  } : {}, 
                  fontWeight: isActive(page.path) ? 700 : 500 
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          {user ? (
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <Tooltip title='Notifications'>
                <IconButton onClick={handleOpenNotifications} sx={{ color: 'white' }}>
                  <Badge badgeContent={unreadCount} color='error'>
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElNotifications}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotifications}
                PaperProps={{
                  sx: { width: 360, maxHeight: 400 }
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant='subtitle1' fontWeight={700}>Notifications</Typography>
                  {unreadCount > 0 && (
                    <Chip label={`${unreadCount} new`} size='small' color='primary' sx={{ mt: 0.5 }} />
                  )}
                </Box>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>No notifications</Typography>
                  </Box>
                ) : (
                  notifications.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderLeft: '3px solid',
                        borderColor: !notif.isRead ? 'primary.main' : 'transparent',
                        bgcolor: !notif.isRead ? 'action.hover' : 'transparent',
                        '&:hover': { bgcolor: 'action.selected' },
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          {!notif.isRead && <Circle sx={{ fontSize: 8, color: 'primary.main' }} />}
                          <Typography variant='body2' fontWeight={!notif.isRead ? 600 : 400}>
                            {notif.message}
                          </Typography>
                        </Box>
                        <Typography variant='caption' color='text.secondary'>
                          {new Date(notif.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Menu>

              {/* User Avatar */}
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', border: '2px solid white' }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant='subtitle1' fontWeight={600}>{user.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>{user.email}</Typography>
                  <Chip label={user.role?.toUpperCase() || 'USER'} size='small' color={user.role === 'admin' ? 'error' : 'primary'} sx={{ mt: 0.5 }} />
                </Box>
                <Divider />
                <MenuItem component={Link} to='/profile' onClick={handleCloseUserMenu}><AccountCircle sx={{ mr: 1 }} /> Profile</MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><Logout sx={{ mr: 1 }} /> Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0, display: 'flex' }}>
              <Button 
                component={Link} 
                to='/login' 
                variant='outlined' 
                startIcon={<LoginIcon />} 
                sx={{ 
                  color: 'white', 
                  borderColor: 'white', 
                  mr: 1, 
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to='/register' 
                variant='contained' 
                startIcon={<PersonAdd />} 
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main', 
                  '&:hover': { bgcolor: 'grey.100' } 
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
