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
import type { LetterSearchParams } from '@/schemas/letter'

type StatusEnum =
  | 'NEW'
  | 'ASSIGNED_TO_DIVISION'
  | 'PENDING_ACCEPTANCE'
  | 'ASSIGNED_TO_OFFICER'
  | 'RETURNED_FROM_OFFICER'
  | 'RETURNED_FROM_DIVISION'
  | 'CLOSED'
type PriorityEnum = 'NORMAL' | 'HIGH' | 'URGENT'
type ModeOfArrivalEnum =
  | 'REGISTERED_POST'
  | 'UNREGISTERED_POST'
  | 'EMAIL'
  | 'WHATSAPP'
  | 'HAND_DELIVERED'
  | 'FAX'
  | 'OTHER'

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
  const [status, setStatus] = useState<StatusEnum | ''>(
    searchParams.status || '',
  )
  const [priority, setPriority] = useState<PriorityEnum | ''>(
    searchParams.priority || '',
  )
  const [modeOfArrival, setModeOfArrival] = useState<ModeOfArrivalEnum | ''>(
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      }}
    >
      {/* Main Search Bar - Always Visible */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search letters by subject, reference, or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            size="medium"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setQuery('')}
                      sx={{ color: 'text.secondary' }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.background.paper,
                },
                '&.Mui-focused': {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
            sx={{
              minWidth: { xs: '100px', sm: '120px' },
              height: '56px',
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Search
          </Button>

          <IconButton
            onClick={() => setExpandedFilters(!expandedFilters)}
            sx={{
              height: '56px',
              width: '56px',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
              backgroundColor: expandedFilters
                ? 'primary.main'
                : 'background.paper',
              color: expandedFilters ? 'white' : 'text.primary',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: expandedFilters
                  ? 'primary.dark'
                  : 'action.hover',
              },
            }}
          >
            {activeFilterCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                }}
              >
                {activeFilterCount}
              </Box>
            )}
            <FilterAltIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Advanced Filters - Expandable */}
      <Collapse in={expandedFilters}>
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            p: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="primary">
              Advanced Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={handleClear}
                startIcon={<ClearIcon />}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                }}
              >
                Clear All
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
              gap: 2,
            }}
          >
            {/* Status */}
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusEnum | '')}
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

            {/* Priority */}
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as PriorityEnum | '')
                }
                label="Priority"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>

            {/* Mode of Arrival */}
            <FormControl fullWidth size="small">
              <InputLabel>Mode of Arrival</InputLabel>
              <Select
                value={modeOfArrival}
                onChange={(e) =>
                  setModeOfArrival(e.target.value as ModeOfArrivalEnum | '')
                }
                label="Mode of Arrival"
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

            {/* Sender */}
            <TextField
              fullWidth
              size="small"
              label="Sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Search by sender name"
            />

            {/* Receiver */}
            <TextField
              fullWidth
              size="small"
              label="Receiver"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Search by receiver name"
            />

            {/* Assigned User */}
            <TextField
              fullWidth
              size="small"
              label="Assigned User"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              placeholder="Search by assigned user"
            />

            {/* Assigned Division */}
            <TextField
              fullWidth
              size="small"
              label="Assigned Division"
              value={assignedDivision}
              onChange={(e) => setAssignedDivision(e.target.value)}
              placeholder="Search by division"
            />

            {/* Sent Date From */}
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Sent Date From"
              value={sentDateFrom}
              onChange={(e) => setSentDateFrom(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            {/* Sent Date To */}
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Sent Date To"
              value={sentDateTo}
              onChange={(e) => setSentDateTo(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            {/* Received Date From */}
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Received Date From"
              value={receivedDateFrom}
              onChange={(e) => setReceivedDateFrom(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            {/* Received Date To */}
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Received Date To"
              value={receivedDateTo}
              onChange={(e) => setReceivedDateTo(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 1, lineHeight: '32px' }}
              >
                Active Filters:
              </Typography>
              {status && (
                <Chip
                  label={`Status: ${status.replace(/_/g, ' ')}`}
                  size="small"
                  onDelete={() => setStatus('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {priority && (
                <Chip
                  label={`Priority: ${priority}`}
                  size="small"
                  onDelete={() => setPriority('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {modeOfArrival && (
                <Chip
                  label={`Mode: ${modeOfArrival.replace(/_/g, ' ')}`}
                  size="small"
                  onDelete={() => setModeOfArrival('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {sender && (
                <Chip
                  label={`Sender: ${sender}`}
                  size="small"
                  onDelete={() => setSender('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {receiver && (
                <Chip
                  label={`Receiver: ${receiver}`}
                  size="small"
                  onDelete={() => setReceiver('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {assignedUser && (
                <Chip
                  label={`User: ${assignedUser}`}
                  size="small"
                  onDelete={() => setAssignedUser('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {assignedDivision && (
                <Chip
                  label={`Division: ${assignedDivision}`}
                  size="small"
                  onDelete={() => setAssignedDivision('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {sentDateFrom && (
                <Chip
                  label={`Sent From: ${sentDateFrom}`}
                  size="small"
                  onDelete={() => setSentDateFrom('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {sentDateTo && (
                <Chip
                  label={`Sent To: ${sentDateTo}`}
                  size="small"
                  onDelete={() => setSentDateTo('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {receivedDateFrom && (
                <Chip
                  label={`Received From: ${receivedDateFrom}`}
                  size="small"
                  onDelete={() => setReceivedDateFrom('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {receivedDateTo && (
                <Chip
                  label={`Received To: ${receivedDateTo}`}
                  size="small"
                  onDelete={() => setReceivedDateTo('')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Apply Filters Button */}
          <Box
            sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearIcon />}
              sx={{ textTransform: 'none' }}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  )
}
