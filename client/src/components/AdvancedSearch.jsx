import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Collapse,
  Button,
  Slider,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';

const AdvancedSearch = ({ onSearch, onFilterChange, type = 'courses' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    feeRange: [0, 500000],
    status: '',
    sortBy: 'relevance',
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      level: '',
      duration: '',
      feeRange: [0, 500000],
      status: '',
      sortBy: 'relevance',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    v && v !== 'relevance' && !(Array.isArray(v) && v[0] === 0 && v[1] === 500000)
  ).length;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder={`Search ${type}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearchTerm(''); onSearch(''); }}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant={showFilters ? 'contained' : 'outlined'}
          startIcon={<TuneIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ minWidth: 120 }}
        >
          Filters
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </Button>
      </Box>

      {/* Filters Panel */}
      <Collapse in={showFilters}>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <Button size="small" onClick={clearFilters}>Clear All</Button>
          </Box>

          <Grid container spacing={2}>
            {/* Category Filter */}
            {type === 'courses' && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Management">Management</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="Arts">Arts</MenuItem>
                    <MenuItem value="Commerce">Commerce</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Level Filter */}
            {type === 'courses' && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={filters.level}
                    label="Level"
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                    <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                    <MenuItem value="Doctorate">Doctorate</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Duration Filter */}
            {type === 'courses' && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={filters.duration}
                    label="Duration"
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">1 Year</MenuItem>
                    <MenuItem value="2">2 Years</MenuItem>
                    <MenuItem value="3">3 Years</MenuItem>
                    <MenuItem value="4">4 Years</MenuItem>
                    <MenuItem value="5+">5+ Years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Status Filter */}
            {type === 'applications' && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="under_review">Under Review</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Sort By */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                  <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                  <MenuItem value="date_asc">Date (Oldest)</MenuItem>
                  <MenuItem value="date_desc">Date (Newest)</MenuItem>
                  {type === 'courses' && <MenuItem value="fee_asc">Fee (Low to High)</MenuItem>}
                  {type === 'courses' && <MenuItem value="fee_desc">Fee (High to Low)</MenuItem>}
                </Select>
              </FormControl>
            </Grid>

            {/* Fee Range Slider */}
            {type === 'courses' && (
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Fee Range: ₹{filters.feeRange[0].toLocaleString()} - ₹{filters.feeRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={filters.feeRange}
                  onChange={(e, newValue) => handleFilterChange('feeRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500000}
                  step={10000}
                  marks={[
                    { value: 0, label: '₹0' },
                    { value: 250000, label: '₹2.5L' },
                    { value: 500000, label: '₹5L' },
                  ]}
                />
              </Grid>
            )}
          </Grid>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
                Active Filters:
              </Typography>
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => handleFilterChange('category', '')}
                  size="small"
                />
              )}
              {filters.level && (
                <Chip
                  label={`Level: ${filters.level}`}
                  onDelete={() => handleFilterChange('level', '')}
                  size="small"
                />
              )}
              {filters.duration && (
                <Chip
                  label={`Duration: ${filters.duration} Year(s)`}
                  onDelete={() => handleFilterChange('duration', '')}
                  size="small"
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onDelete={() => handleFilterChange('status', '')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default AdvancedSearch;
