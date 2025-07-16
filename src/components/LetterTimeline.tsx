import React from 'react'
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AttachFile as AttachIcon,
  Business as BusinessIcon,
  Download as DownloadIcon,
  Forward as ForwardIcon,
  PersonAdd as PersonAddIcon,
  Reply as ReplyIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface LetterAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedBy: string
  uploadedAt: string
}

interface LetterAction {
  id: string
  type:
    | 'received'
    | 'assigned_to_division'
    | 'assigned_to_person'
    | 'forwarded'
    | 'replied'
    | 'returned'
    | 'status_change'
  description: string
  performedBy: {
    name: string
    role: string
    division: string
    avatar?: string
  }
  timestamp: string
  content?: string
  attachments?: Array<LetterAttachment>
  fromDivision?: string
  toDivision?: string
  assignedTo?: {
    type: 'division' | 'person'
    name: string
    id?: string
  }
  statusFrom?: string
  statusTo?: string
  priority?: 'Normal' | 'Urgent' | 'High'
}

interface LetterTimelineProps {
  actions: Array<LetterAction>
  formatTimestamp: (timestamp: string) => string
  getStatusColor: (status: string) => string
}

export const LetterTimeline: React.FC<LetterTimelineProps> = ({
  actions,
  formatTimestamp,
  getStatusColor,
}) => {
  const theme = useTheme()

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'assigned_to_division':
        return <BusinessIcon />
      case 'assigned_to_person':
        return <PersonAddIcon />
      case 'forwarded':
        return <ForwardIcon />
      case 'replied':
        return <ReplyIcon />
      default:
        return <VisibilityIcon />
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Activity Timeline
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: 28,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: theme.palette.divider,
          }}
        />

        <Stack spacing={0}>
          {actions.map((action, index) => (
            <Box
              key={action.id}
              sx={{
                position: 'relative',
                pb: index < actions.length - 1 ? 4 : 0,
              }}
            >
              {/* Timeline dot */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: 8,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  border: `3px solid ${theme.palette.background.paper}`,
                  zIndex: 1,
                }}
              />

              {/* Action content */}
              <Box sx={{ ml: 8, pl: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={action.performedBy.avatar}
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: theme.palette.secondary.main,
                      }}
                    >
                      {action.performedBy.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {action.performedBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.performedBy.role} •{' '}
                        {action.performedBy.division}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(action.timestamp)}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        justifyContent: 'flex-end',
                      }}
                    >
                      {getActionIcon(action.type)}
                      <Typography variant="caption" color="text.secondary">
                        {action.type.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {action.description}
                </Typography>

                {action.content && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.background.paper,
                      mb: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {action.content}
                    </Typography>
                  </Paper>
                )}

                {action.assignedTo && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label="Assigned to"
                      size="small"
                      variant="outlined"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Chip
                      label={action.assignedTo.name}
                      size="small"
                      color={
                        action.assignedTo.type === 'division'
                          ? 'info'
                          : 'secondary'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                )}

                {action.fromDivision && action.toDivision && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={action.fromDivision}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Chip
                      label={action.toDivision}
                      size="small"
                      color="primary"
                    />
                  </Box>
                )}

                {action.statusFrom && action.statusTo && (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mb: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={action.statusFrom}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.grey[300],
                        color: theme.palette.grey[700],
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      →
                    </Typography>
                    <Chip
                      label={action.statusTo}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(action.statusTo),
                        color: 'white',
                      }}
                    />
                  </Box>
                )}

                {action.attachments && action.attachments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1, display: 'block' }}
                    >
                      {action.attachments.length} attachment
                      {action.attachments.length > 1 ? 's' : ''}:
                    </Typography>
                    <Stack spacing={1}>
                      {action.attachments.map((attachment) => (
                        <Box
                          key={attachment.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: `${theme.palette.background.default}a0`,
                            },
                          }}
                          onClick={() =>
                            console.log('Download:', attachment.name)
                          }
                        >
                          <AttachIcon fontSize="small" color="primary" />
                          <Typography variant="caption" sx={{ flex: 1 }}>
                            {attachment.name} ({attachment.size})
                          </Typography>
                          <IconButton size="small">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  )
}
