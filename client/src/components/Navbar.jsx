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
  Notifications, Circle, Explore,
} from '@mui/icons-material';
import NotificationCenter from './NotificationCenter';

const publicPages = [
  { name: 'Home', path: '/home', icon: <Home /> },
  { name: 'Courses', path: '/courses', icon: <School /> },
  { name: 'Help', path: '/help', icon: <HelpOutline /> },
];

const applicantPages = [
  { name: 'Dashboard', path: '/applicant', icon: <Dashboard /> },
  { name: 'Apply for Course', path: '/applicant/apply', icon: <Assignment /> },
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
  const [scrolled, setScrolled] = useState(false);

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
      position='fixed' 
      elevation={scrolled ? 4 : 0} 
      sx={{ 
        bgcolor: scrolled ? 'rgba(44, 62, 80, 0.98)' : 'primary.main', 
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid', 
        borderColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'divider',
        transition: 'all 0.3s ease-in-out',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
        zIndex: 1200,
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ py: scrolled ? 0.5 : 1, transition: 'padding 0.3s ease-in-out' }}>
          {/* Logo and Brand */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 1,
            position: 'relative',
          }}>
            <School sx={{ 
              fontSize: scrolled ? 28 : 32, 
              transition: 'font-size 0.3s ease-in-out',
              position: 'relative',
              zIndex: 1,
            }} />
            <Explore sx={{ 
              fontSize: scrolled ? 18 : 22, 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.3s ease-in-out',
              opacity: 0.3,
            }} />
          </Box>
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
              background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.5px',
            }}
          >
            EduVoyage
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
              <NotificationCenter />

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
