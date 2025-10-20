import { useEffect, useState } from 'react'
import { ExpandLess, ExpandMore, Search } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Collapse,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material'
import type { UserSearchParams } from '@/schemas'

interface UserSearchBarProps {
  searchParams: UserSearchParams
  onSearch: (params: UserSearchParams) => void
  onClear?: () => void
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchParams,
  onSearch,
  onClear,
}) => {
  const theme = useTheme()
  const [query, setQuery] = useState(searchParams.query || '')
  const [role, setRole] = useState(searchParams.role || '')
  const [division, setDivision] = useState(searchParams.division || '')
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search effect for query field
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch({ 
        query: query || undefined, 
        role: role || undefined, 
        division: division || undefined 
      })
    }, 500) // 500ms debounce delay

    return () => clearTimeout(debounceTimer)
  }, [query]) // Only debounce the main query field

  // Immediate search for role and division filters
  useEffect(() => {
    onSearch({ 
      query: query || undefined, 
      role: role || undefined, 
      division: division || undefined 
    })
  }, [role, division])

  const handleSearch = () => {
    onSearch({ 
      query: query || undefined, 
      role: role || undefined, 
      division: division || undefined 
    })
  }

  const handleClear = () => {
    setQuery('')
    setRole('')
    setDivision('')
    if (onClear) {
      onClear()
    } else {
      onSearch({ query: undefined, role: undefined, division: undefined })
    }
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value)
  }

  const handleDivisionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDivision(event.target.value)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const activeFilterCount = [role, division].filter(Boolean).length

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          size="small"
          placeholder="Search users..."
          value={query}
          onChange={handleQueryChange}
          onKeyPress={handleKeyPress}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: 200,
            flex: { xs: '1 1 100%', sm: '1 1 auto' },
          }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
          endIcon={
            activeFilterCount > 0 ? (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                sx={{ height: 18, minWidth: 18, fontSize: '0.7rem' }}
              />
            ) : null
          }
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            textTransform: 'none',
          }}
        >
          Filters
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            gap: 1.5,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            label="Role"
            placeholder="Filter by role..."
            value={role}
            onChange={handleRoleChange}
            onKeyPress={handleKeyPress}
            sx={{ minWidth: 180, flex: '1 1 auto' }}
          />
          <TextField
            size="small"
            label="Division"
            placeholder="Filter by division..."
            value={division}
            onChange={handleDivisionChange}
            onKeyPress={handleKeyPress}
            sx={{ minWidth: 180, flex: '1 1 auto' }}
          />
          <Button
            variant="text"
            size="small"
            onClick={handleClear}
            sx={{ textTransform: 'none' }}
          >
            Clear All
          </Button>
        </Box>
      </Collapse>
    </Box>
  )
}
