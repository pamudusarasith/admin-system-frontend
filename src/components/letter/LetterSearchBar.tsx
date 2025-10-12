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
  LetterPriority,
  LetterSearchParams,
  LetterStatus,
  ModeOfArrival,
} from '@/schemas'

interface LetterSearchBarProps {
  searchParams: LetterSearchParams
  onSearch: (params: LetterSearchParams) => void
  onClear?: () => void
}

export const LetterSearchBar: React.FC<LetterSearchBarProps> = ({
  searchParams,
  onSearch,
  onClear,
}) => {
  const theme = useTheme()

  // Local state for filters before applying
  const [query, setQuery] = useState(searchParams.query || '')
  const [status, setStatus] = useState<LetterStatus | ''>(
    searchParams.status || '',
  )
  const [priority, setPriority] = useState<LetterPriority | ''>(
    searchParams.priority || '',
  )
  const [modeOfArrival, setModeOfArrival] = useState<ModeOfArrival | ''>(
    searchParams.modeOfArrival || '',
  )
  const [sender, setSender] = useState(searchParams.sender || '')
  const [receiver, setReceiver] = useState(searchParams.receiver || '')
  const [assignedUser, setAssignedUser] = useState(
    searchParams.assignedUser || '',
  )
  const [assignedDivision, setAssignedDivision] = useState(
    searchParams.assignedDivision || '',
  )
  const [sentDateFrom, setSentDateFrom] = useState(
    searchParams.sentDateFrom || '',
  )
  const [sentDateTo, setSentDateTo] = useState(searchParams.sentDateTo || '')
  const [receivedDateFrom, setReceivedDateFrom] = useState(
    searchParams.receivedDateFrom || '',
  )
  const [receivedDateTo, setReceivedDateTo] = useState(
    searchParams.receivedDateTo || '',
  )

  const [expandedFilters, setExpandedFilters] = useState(false)

  // Count active filters (excluding query)
  const activeFilterCount = [
    status,
    priority,
    modeOfArrival,
    sender,
    receiver,
    assignedUser,
    assignedDivision,
    sentDateFrom,
    sentDateTo,
    receivedDateFrom,
    receivedDateTo,
  ].filter(Boolean).length

  const handleSearch = () => {
    onSearch({
      ...searchParams,
      query: query || undefined,
      status: status || undefined,
      priority: priority || undefined,
      modeOfArrival: modeOfArrival || undefined,
      sender: sender || undefined,
      receiver: receiver || undefined,
      assignedUser: assignedUser || undefined,
      assignedDivision: assignedDivision || undefined,
      sentDateFrom: sentDateFrom || undefined,
      sentDateTo: sentDateTo || undefined,
      receivedDateFrom: receivedDateFrom || undefined,
      receivedDateTo: receivedDateTo || undefined,
    } as LetterSearchParams)
  }

  const handleClear = () => {
    setQuery('')
    setStatus('')
    setPriority('')
    setModeOfArrival('')
    setSender('')
    setReceiver('')
    setAssignedUser('')
    setAssignedDivision('')
    setSentDateFrom('')
    setSentDateTo('')
    setReceivedDateFrom('')
    setReceivedDateTo('')
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
            placeholder="Search letters..."
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
                onChange={(e) => setStatus(e.target.value as LetterStatus | '')}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="ASSIGNED_TO_DIVISION">
                  Assigned to Division
                </MenuItem>
                <MenuItem value="PENDING_ACCEPTANCE">
                  Pending Acceptance
                </MenuItem>
                <MenuItem value="ASSIGNED_TO_OFFICER">
                  Assigned to Officer
                </MenuItem>
                <MenuItem value="RETURNED_FROM_OFFICER">
                  Returned from Officer
                </MenuItem>
                <MenuItem value="RETURNED_FROM_DIVISION">
                  Returned from Division
                </MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as LetterPriority | '')
                }
                label="Priority"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Mode</InputLabel>
              <Select
                value={modeOfArrival}
                onChange={(e) =>
                  setModeOfArrival(e.target.value as ModeOfArrival | '')
                }
                label="Mode"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="REGISTERED_POST">Registered Post</MenuItem>
                <MenuItem value="UNREGISTERED_POST">Unregistered Post</MenuItem>
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="WHATSAPP">WhatsApp</MenuItem>
                <MenuItem value="HAND_DELIVERED">Hand Delivered</MenuItem>
                <MenuItem value="FAX">Fax</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Assigned User"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            />

            <TextField
              fullWidth
              size="small"
              label="Assigned Division"
              value={assignedDivision}
              onChange={(e) => setAssignedDivision(e.target.value)}
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Sent From"
              value={sentDateFrom}
              onChange={(e) => setSentDateFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Sent To"
              value={sentDateTo}
              onChange={(e) => setSentDateTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Received From"
              value={receivedDateFrom}
              onChange={(e) => setReceivedDateFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              size="small"
              type="date"
              label="Received To"
              value={receivedDateTo}
              onChange={(e) => setReceivedDateTo(e.target.value)}
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
              {sentDateFrom && (
                <Chip
                  label={`Sent From: ${sentDateFrom}`}
                  size="small"
                  onDelete={() => setSentDateFrom('')}
                />
              )}
              {sentDateTo && (
                <Chip
                  label={`Sent To: ${sentDateTo}`}
                  size="small"
                  onDelete={() => setSentDateTo('')}
                />
              )}
              {receivedDateFrom && (
                <Chip
                  label={`Received From: ${receivedDateFrom}`}
                  size="small"
                  onDelete={() => setReceivedDateFrom('')}
                />
              )}
              {receivedDateTo && (
                <Chip
                  label={`Received To: ${receivedDateTo}`}
                  size="small"
                  onDelete={() => setReceivedDateTo('')}
                />
              )}
              {status && (
                <Chip
                  label={status.replace(/_/g, ' ')}
                  size="small"
                  onDelete={() => setStatus('')}
                />
              )}
              {priority && (
                <Chip
                  label={priority}
                  size="small"
                  onDelete={() => setPriority('')}
                />
              )}
              {modeOfArrival && (
                <Chip
                  label={modeOfArrival.replace(/_/g, ' ')}
                  size="small"
                  onDelete={() => setModeOfArrival('')}
                />
              )}
              {sender && (
                <Chip
                  label={sender}
                  size="small"
                  onDelete={() => setSender('')}
                />
              )}
              {receiver && (
                <Chip
                  label={receiver}
                  size="small"
                  onDelete={() => setReceiver('')}
                />
              )}
              {assignedUser && (
                <Chip
                  label={assignedUser}
                  size="small"
                  onDelete={() => setAssignedUser('')}
                />
              )}
              {assignedDivision && (
                <Chip
                  label={assignedDivision}
                  size="small"
                  onDelete={() => setAssignedDivision('')}
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
