import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { showKeyboardShortcutsHelp } from '../utils/shortcuts';

const KeyboardShortcutsDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Listen for Shift + ? to open shortcuts dialog
    const handleKeyPress = (event) => {
      if (event.shiftKey && event.key === '?') {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const shortcuts = showKeyboardShortcutsHelp();

  return (
    <>
      {/* Floating button to show shortcuts */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
          zIndex: 1000,
        }}
        aria-label="Keyboard shortcuts"
        title="Keyboard Shortcuts (Shift + ?)"
      >
        <KeyboardIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <KeyboardIcon />
              <Typography variant="h6">Keyboard Shortcuts</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Press <Chip label="Shift + ?" size="small" /> to open this dialog anytime
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Keys</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortcuts.map((shortcut, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Chip
                        label={shortcut.keys}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>{shortcut.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="info.main">
              💡 <strong>Tip:</strong> These shortcuts work anywhere in the application
              to help you navigate faster!
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KeyboardShortcutsDialog;
