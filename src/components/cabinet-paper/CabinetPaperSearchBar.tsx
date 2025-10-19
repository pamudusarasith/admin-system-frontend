import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material'

interface CabinetPaperSearchBarProps {
  readonly searchQuery: string
  readonly onSearch: (query: string) => void
  readonly onClear: () => void
}

export function CabinetPaperSearchBar({
  searchQuery,
  onSearch,
  onClear,
}: CabinetPaperSearchBarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [localQuery, setLocalQuery] = useState(searchQuery || '')

  const handleSearch = () => {
    onSearch(localQuery.trim())
  }

  const handleClear = () => {
    setLocalQuery('')
    onClear()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search by subject, reference ID, or category..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: localQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setLocalQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: isMobile ? '100%' : 120,
              }}
            >
              Search
            </Button>
            <Tooltip title="Clear all filters">
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: isMobile ? '100%' : 100,
                }}
              >
                Clear
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Card>
  )
}
