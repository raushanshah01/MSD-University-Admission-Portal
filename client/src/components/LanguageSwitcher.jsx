import React, { useState, useEffect } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { smartAPI } from '../services/api';
import { Box, Button, Paper, MenuList, MenuItem, Typography } from '@mui/material';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useAuth();
  const [languages, setLanguages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const { data } = await smartAPI.getLanguages();
      setLanguages(data.languages);
    } catch (error) {
      console.error('Failed to load languages:', error);
      // Fallback languages
      setLanguages([
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
      ]);
    }
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: '80px', 
        right: '20px', 
        zIndex: 1200 
      }}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="contained"
        startIcon={<FaGlobe />}
        sx={{
          bgcolor: '#1976d2',
          color: 'white',
          borderRadius: '24px',
          px: 2.5,
          py: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#1565c0',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
            transform: 'translateY(-2px)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        }}
      >
        {currentLang?.nativeName || 'English'}
      </Button>

      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 180,
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'slideDown 0.2s ease-out',
            '@keyframes slideDown': {
              from: {
                opacity: 0,
                transform: 'translateY(-10px)'
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <MenuList sx={{ py: 0.5 }}>
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                selected={language === lang.code}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontSize: '0.9rem',
                  fontWeight: language === lang.code ? 600 : 400,
                  bgcolor: language === lang.code ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  borderLeft: language === lang.code ? '3px solid #1976d2' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.12)',
                    borderLeftColor: '#1976d2'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.15)'
                    }
                  }
                }}
              >
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{lang.nativeName}</span>
                  {language === lang.code && (
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>✓</span>
                  )}
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      )}
    </Box>
  );
}
