import React from 'react'
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AttachFile as AttachIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'

interface LetterAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: string
  uploadedAt: string
}

interface LetterSender {
  name: string
  organization: string
  email: string
  phone: string
}

interface LetterAssignee {
  name: string
  role: string
  division: string
  assignedDate?: string
  assignedBy?: {
    name: string
    role: string
  }
}

interface LetterDivision {
  id: string
  name: string
  assignedDate: string
  assignedBy: {
    name: string
    role: string
  }
}

interface LetterDetailsGridProps {
  sender: LetterSender
  assignedDivision?: LetterDivision
  currentAssignee?: LetterAssignee
  category: string
  receivedDate: string
  originalAttachments: Array<LetterAttachment>
  formatTimestamp: (timestamp: string) => string
}

export const LetterDetailsGrid: React.FC<LetterDetailsGridProps> = ({
  sender,
  assignedDivision,
  currentAssignee,
  category,
  receivedDate,
  originalAttachments,
  formatTimestamp,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 3,
      }}
    >
      {/* Left Column - Sender & Assignment */}
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Sender Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              {sender.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {sender.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sender.organization}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sender.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sender.phone}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Division Assignment */}
        {assignedDivision && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Assigned Division
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: theme.palette.info.main,
                }}
              >
                {assignedDivision.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {assignedDivision.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned by: {assignedDivision.assignedBy.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTimestamp(assignedDivision.assignedDate)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Person Assignment */}
        {currentAssignee && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Assigned Person
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                {currentAssignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {currentAssignee.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentAssignee.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentAssignee.division}
                </Typography>
                {currentAssignee.assignedBy && (
                  <Typography variant="body2" color="text.secondary">
                    Assigned by: {currentAssignee.assignedBy.name}
                  </Typography>
                )}
                {currentAssignee.assignedDate && (
                  <Typography variant="body2" color="text.secondary">
                    {formatTimestamp(currentAssignee.assignedDate)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Right Column - Details & Attachments */}
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Letter Details
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1">{category}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Received Date
              </Typography>
              <Typography variant="body1">
                {formatTimestamp(receivedDate)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Days Open
              </Typography>
              <Typography
                variant="body1"
                color={
                  new Date().getTime() - new Date(receivedDate).getTime() >
                  7 * 24 * 60 * 60 * 1000
                    ? 'error.main'
                    : 'text.primary'
                }
              >
                {Math.floor(
                  (new Date().getTime() - new Date(receivedDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{' '}
                days
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Attachments */}
        {originalAttachments.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Attachments ({originalAttachments.length})
            </Typography>
            <Stack spacing={1}>
              {originalAttachments.map((attachment) => (
                <Box
                  key={attachment.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.grey[50],
                    },
                  }}
                  onClick={() => console.log('Download:', attachment.name)}
                >
                  <AttachIcon color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {attachment.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {attachment.size} • {attachment.type}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <DownloadIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  )
}
