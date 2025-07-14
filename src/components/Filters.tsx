import React from 'react'
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

interface FiltersProps {
  searchTerm: string
  statusFilter: string
  priorityFilter: string
  categoryFilter: string
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onCategoryFilterChange: (value: string) => void
  onClearAllFilters: () => void
}

export const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  statusFilter,
  priorityFilter,
  categoryFilter,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onCategoryFilterChange,
  onClearAllFilters,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const hasActiveFilters =
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All' ||
    searchTerm

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        <TextField
          placeholder="Search letters by subject, sender, or reference..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => onSearchChange('')}
                  edge="end"
                  size="small"
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            minWidth: { xs: '100%', md: 'auto' },
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All Priorities</MenuItem>
              <MenuItem value="High">High Priority</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
              <MenuItem value="Normal">Normal</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="All">All Categories</MenuItem>
              <MenuItem value="Policy Matter">Policy Matter</MenuItem>
              <MenuItem value="Financial Matter">Financial Matter</MenuItem>
              <MenuItem value="Legal Matter">Legal Matter</MenuItem>
              <MenuItem value="Training & Development">
                Training & Development
              </MenuItem>
              <MenuItem value="International Affairs">
                International Affairs
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => console.log('Advanced filters')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              minWidth: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {isMobile ? 'Filters' : 'More Filters'}
          </Button>
        </Box>
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{ mr: 1, fontWeight: 600, color: 'text.secondary' }}
          >
            Active filters:
          </Typography>
          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={() => onSearchChange('')}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
          {statusFilter !== 'All' && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => onStatusFilterChange('All')}
              color="secondary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
          {priorityFilter !== 'All' && (
            <Chip
              label={`Priority: ${priorityFilter}`}
              onDelete={() => onPriorityFilterChange('All')}
              color="info"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
          {categoryFilter !== 'All' && (
            <Chip
              label={`Category: ${categoryFilter}`}
              onDelete={() => onCategoryFilterChange('All')}
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
          <Button
            variant="text"
            size="small"
            onClick={onClearAllFilters}
            sx={{
              ml: 1,
              textTransform: 'none',
              fontSize: '0.75rem',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Clear all
          </Button>
        </Box>
      )}
    </Paper>
  )
}
