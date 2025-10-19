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
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material'
import type { Letter } from '@/api'
import { useAuth } from '@/core'

interface LetterHeaderProps {
  letter: Letter
  onReply: () => void
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}

export const LetterHeader: React.FC<LetterHeaderProps> = ({
  letter,
  onReply,
  onMenuClick,
  getPriorityColor,
  getStatusColor,
}) => {
  const { user } = useAuth()

  const canReply =
    user?.id &&
    user.id === letter.assignedUser?.id &&
    letter.status !== 'CLOSED'

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
        <Typography color="text.primary">{letter.reference}</Typography>
      </Breadcrumbs>

      {/* Letter Title Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          backgroundColor: (t) => t.palette.background.paper,
          borderRadius: 3,
        }}
      >
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
              variant="h5"
              sx={{ fontWeight: 600, mb: 1, lineHeight: 1.25 }}
            >
              {letter.subject}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Reference: {letter.reference}
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
                label={letter.priority.replace('_', ' ')}
                size="small"
                sx={{
                  px: 1,
                  fontSize: 11,
                  letterSpacing: 0.4,
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: getPriorityColor(letter.priority),
                }}
              />
              <Chip
                label={letter.status.replaceAll('_', ' ')}
                size="small"
                sx={{
                  px: 1,
                  fontSize: 11,
                  letterSpacing: 0.4,
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: getStatusColor(letter.status),
                }}
              />
            </Box>
          </Box>

          {/* Primary Actions */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            {canReply && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ReplyIcon />}
                onClick={onReply}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Add Reply
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={onMenuClick}
              sx={{ minWidth: 40, borderRadius: 2 }}
            >
              <MoreVertIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
