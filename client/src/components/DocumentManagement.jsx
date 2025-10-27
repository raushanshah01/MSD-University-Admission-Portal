import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const DocumentUpload = ({ onUpload, acceptedTypes = '.pdf,.jpg,.jpeg,.png', maxSize = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit`);
        return;
      }

      // Simulate upload
      setUploading(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            onUpload?.(file);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    });
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          backgroundColor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedTypes}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or click to browse
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Accepted: {acceptedTypes} (Max {maxSize}MB)
          </Typography>
        </label>
      </Paper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading... {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Box>
  );
};

const DocumentPreview = ({ document, open, onClose }) => {
  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <PictureAsPdfIcon sx={{ fontSize: 48 }} />;
    if (type?.includes('image')) return <ImageIcon sx={{ fontSize: 48 }} />;
    return <DescriptionIcon sx={{ fontSize: 48 }} />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getFileIcon(document?.type)}
          <Typography variant="h6">{document?.name}</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {document?.type?.includes('pdf') ? (
          <iframe
            src={document.url}
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="PDF Preview"
          />
        ) : document?.type?.includes('image') ? (
          <img
            src={document.url}
            alt={document.name}
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <Alert severity="info">
            Preview not available for this file type. Click download to view.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => window.open(document?.url, '_blank')}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DocumentStatusTracker = ({ documents = [] }) => {
  const [previewDoc, setPreviewDoc] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircleIcon />;
      case 'pending': return <PendingIcon />;
      case 'rejected': return <CancelIcon />;
      default: return <DescriptionIcon />;
    }
  };

  const mockDocuments = documents.length > 0 ? documents : [
    { id: 1, name: '10th Marksheet.pdf', type: 'application/pdf', status: 'verified', uploadDate: '2024-01-15', url: '#' },
    { id: 2, name: '12th Marksheet.pdf', type: 'application/pdf', status: 'verified', uploadDate: '2024-01-15', url: '#' },
    { id: 3, name: 'Photo.jpg', type: 'image/jpeg', status: 'pending', uploadDate: '2024-01-16', url: '#' },
    { id: 4, name: 'ID Proof.pdf', type: 'application/pdf', status: 'rejected', uploadDate: '2024-01-16', url: '#', reason: 'Document not clear' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Document Verification Status
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {mockDocuments.filter(d => d.status === 'verified').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {mockDocuments.filter(d => d.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main">
                {mockDocuments.filter(d => d.status === 'rejected').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <List>
          {mockDocuments.map((doc) => (
            <ListItem key={doc.id} divider>
              <ListItemIcon>
                {doc.type?.includes('pdf') ? <PictureAsPdfIcon /> : <ImageIcon />}
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                secondary={
                  <>
                    Uploaded: {doc.uploadDate}
                    {doc.reason && (
                      <Typography variant="caption" color="error" display="block">
                        Reason: {doc.reason}
                      </Typography>
                    )}
                  </>
                }
              />
              <Chip
                icon={getStatusIcon(doc.status)}
                label={doc.status}
                color={getStatusColor(doc.status)}
                size="small"
                sx={{ mr: 1 }}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Preview">
                  <IconButton
                    edge="end"
                    onClick={() => setPreviewDoc(doc)}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton edge="end" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {previewDoc && (
        <DocumentPreview
          document={previewDoc}
          open={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </Box>
  );
};

export { DocumentUpload, DocumentPreview, DocumentStatusTracker };
