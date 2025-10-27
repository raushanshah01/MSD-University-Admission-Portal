import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { setupOfflineDetection } from '../utils/offline';

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const cleanup = setupOfflineDetection(
      // Online handler
      () => {
        setIsOffline(false);
        setShowOnlineMessage(true);
        setTimeout(() => setShowOnlineMessage(false), 3000);
      },
      // Offline handler
      () => {
        setIsOffline(true);
        setShowOnlineMessage(false);
      }
    );

    return cleanup;
  }, []);

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bgcolor: 'error.main',
            color: 'white',
            py: 1,
            px: 2,
            textAlign: 'center',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          ⚠️ You are offline. Some features may be limited.
        </Box>
      )}

      {/* Back Online Notification */}
      <Snackbar
        open={showOnlineMessage}
        autoHideDuration={3000}
        onClose={() => setShowOnlineMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          ✓ You are back online!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineIndicator;
