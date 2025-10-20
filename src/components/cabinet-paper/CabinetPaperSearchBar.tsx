import React, { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Clear as ClearIcon,
  FilterAlt as FilterAltIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import type {
  CabinetPaperSearchParams,
  CabinetPaperStatus,
} from '@/schemas'

interface CabinetPaperSearchBarProps {
  searchParams: CabinetPaperSearchParams
  onSearch: (params: CabinetPaperSearchParams) => void
  onClear?: () => void
}

export const CabinetPaperSearchBar: React.FC<CabinetPaperSearchBarProps> = ({
  searchParams,
  onSearch,
  onClear,
}) => {
  const theme = useTheme()

  // Local state for filters before applying
  const [query, setQuery] = useState(searchParams.query || '')
  const [status, setStatus] = useState<CabinetPaperStatus | ''>(
    searchParams.status || '',
  )
  const [categoryName, setCategoryName] = useState(
    searchParams.categoryName || '',
  )
  const [submittedByUser, setSubmittedByUser] = useState(
    searchParams.submittedByUser || '',
  )
  const [createdAtFrom, setCreatedAtFrom] = useState(
    searchParams.createdAtFrom || '',
  )
  const [createdAtTo, setCreatedAtTo] = useState(
    searchParams.createdAtTo || '',
  )
  const [updatedAtFrom, setUpdatedAtFrom] = useState(
    searchParams.updatedAtFrom || '',
  )
  const [updatedAtTo, setUpdatedAtTo] = useState(
    searchParams.updatedAtTo || '',
  )

  const [expandedFilters, setExpandedFilters] = useState(false)

  // Count active filters (excluding query)
  const activeFilterCount = [
    status,
    categoryName,
    submittedByUser,
    createdAtFrom,
    createdAtTo,
    updatedAtFrom,
    updatedAtTo,
  ].filter(Boolean).length

  const handleSearch = () => {
    onSearch({
      ...searchParams,
      query: query || undefined,
      status: status || undefined,
      categoryName: categoryName || undefined,
      submittedByUser: submittedByUser || undefined,
      createdAtFrom: createdAtFrom || undefined,
      createdAtTo: createdAtTo || undefined,
      updatedAtFrom: updatedAtFrom || undefined,
      updatedAtTo: updatedAtTo || undefined,
    } as CabinetPaperSearchParams)
  }

  const handleClear = () => {
    setQuery('')
    setStatus('')
    setCategoryName('')
    setSubmittedByUser('')
    setCreatedAtFrom('')
    setCreatedAtTo('')
    setUpdatedAtFrom('')
    setUpdatedAtTo('')
    onClear?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        background: 'transparent',
      }}
    >
      {/* Main Search Bar - Compact */}
      <Box sx={{ p: 1, px: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search cabinet papers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setQuery('')}
                      sx={{ color: 'text.secondary' }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 40,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
                '& fieldset': { borderColor: theme.palette.divider },
              },
              '& .MuiInputBase-input': { padding: '8px 10px' },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            size="small"
            aria-label="Search"
            sx={{
              minWidth: 88,
              height: 40,
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            <SearchIcon fontSize="small" />
          </Button>

          <IconButton
            onClick={() => setExpandedFilters(!expandedFilters)}
            size="small"
            aria-label="Toggle filters"
            sx={{
              height: 36,
              width: 36,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: expandedFilters ? 'primary.main' : 'transparent',
              color: expandedFilters ? 'white' : 'text.primary',
            }}
          >
            {activeFilterCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  backgroundColor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                }}
              >
                {activeFilterCount}
              </Box>
            )}
            <FilterAltIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Advanced Filters - Compact */}
      <Collapse in={expandedFilters}>
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={handleClear}
                sx={{ textTransform: 'none' }}
              >
                Clear
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 1,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as CabinetPaperStatus | '')
                }
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="SUBMITTED">Submitted</MenuItem>
                <MenuItem value="APPROVED_FOR_CABINET">
                  Approved for Cabinet
                </MenuItem>
                <MenuItem value="CONSIDERED">Considered</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
            />

            <TextField
              fullWidth
              size="small"
              label="Submitted By"
              value={submittedByUser}
              onChange={(e) => setSubmittedByUser(e.target.value)}
              placeholder="Username or name"
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Created From"
              value={createdAtFrom}
              onChange={(e) => setCreatedAtFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Created To"
              value={createdAtTo}
              onChange={(e) => setCreatedAtTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Updated From"
              value={updatedAtFrom}
              onChange={(e) => setUpdatedAtFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Updated To"
              value={updatedAtTo}
              onChange={(e) => setUpdatedAtTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          {activeFilterCount > 0 && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                Active:
              </Typography>
              {status && (
                <Chip
                  label={status.replaceAll('_', ' ')}
                  size="small"
                  onDelete={() => setStatus('')}
                />
              )}
              {categoryName && (
                <Chip
                  label={`Category: ${categoryName}`}
                  size="small"
                  onDelete={() => setCategoryName('')}
                />
              )}
              {submittedByUser && (
                <Chip
                  label={`Submitted By: ${submittedByUser}`}
                  size="small"
                  onDelete={() => setSubmittedByUser('')}
                />
              )}
              {createdAtFrom && (
                <Chip
                  label={`Created From: ${createdAtFrom}`}
                  size="small"
                  onDelete={() => setCreatedAtFrom('')}
                />
              )}
              {createdAtTo && (
                <Chip
                  label={`Created To: ${createdAtTo}`}
                  size="small"
                  onDelete={() => setCreatedAtTo('')}
                />
              )}
              {updatedAtFrom && (
                <Chip
                  label={`Updated From: ${updatedAtFrom}`}
                  size="small"
                  onDelete={() => setUpdatedAtFrom('')}
                />
              )}
              {updatedAtTo && (
                <Chip
                  label={`Updated To: ${updatedAtTo}`}
                  size="small"
                  onDelete={() => setUpdatedAtTo('')}
                />
              )}
            </Box>
          )}

          <Box
            sx={{
              mt: 1.5,
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="text" onClick={handleClear} size="small">
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleSearch}
              size="small"
              sx={{ fontWeight: 600 }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  )
}

