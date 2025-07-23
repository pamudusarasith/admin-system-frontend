import React from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Paper,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Forward as ForwardIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material'

interface Letter {
  id: string
  referenceNumber: string
  subject: string
  priority: 'Normal' | 'Urgent' | 'High'
  status:
    | 'Pending'
    | 'Assigned to Division'
    | 'Assigned to Person'
    | 'In Progress'
    | 'Completed'
    | 'Returned'
  confidentialityLevel: 'Public' | 'Confidential' | 'Restricted' | 'Secret'
}

interface LetterHeaderProps {
  letter: Letter
  onReply: () => void
  onForward: () => void
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}

export const LetterHeader: React.FC<LetterHeaderProps> = ({
  letter,
  onReply,
  onForward,
  onMenuClick,
  getPriorityColor,
  getStatusColor,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => window.history.back()}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Letters
      </Button>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/letters">
          Letters
        </Link>
        <Typography color="text.primary">{letter.referenceNumber}</Typography>
      </Breadcrumbs>

      {/* Letter Title Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}
            >
              {letter.subject}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Reference: {letter.referenceNumber}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Chip
                label={letter.priority}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(letter.priority),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Chip
                label={letter.status}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(letter.status),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Chip
                label={letter.confidentialityLevel}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>

          {/* Primary Actions */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="contained"
              startIcon={<ReplyIcon />}
              onClick={onReply}
              size="large"
            >
              Reply
            </Button>
            <Button
              variant="outlined"
              startIcon={<ForwardIcon />}
              onClick={onForward}
              size="large"
            >
              Forward
            </Button>
            <Button
              variant="outlined"
              onClick={onMenuClick}
              size="large"
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <MoreVertIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
