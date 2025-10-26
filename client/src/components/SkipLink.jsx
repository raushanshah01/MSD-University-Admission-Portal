import React from 'react';
import { Box, Link } from '@mui/material';

export default function SkipLink() {
  return (
    <Link
      href="#main-content"
      sx={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '1rem',
        backgroundColor: 'primary.main',
        color: 'white',
        textDecoration: 'none',
        fontWeight: 600,
        '&:focus': {
          left: '50%',
          top: '10px',
          transform: 'translateX(-50%)',
          boxShadow: 3,
          borderRadius: 1,
        },
      }}
    >
      Skip to main content
    </Link>
  );
}
