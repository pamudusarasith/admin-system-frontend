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
  query?: string
  statusFilter: string
  priorityFilter: string
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onClearAllFilters: () => void
}

export const Filters: React.FC<FiltersProps> = ({
  query,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onClearAllFilters,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const hasActiveFilters =
    statusFilter !== 'All' || priorityFilter !== 'All' || query

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
          value={query}
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
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: query && (
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
            },
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
          {query && (
            <Chip
              label={`Search: ${query}`}
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
