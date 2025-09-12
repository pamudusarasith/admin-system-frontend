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
  Download as DownloadIcon,
  Forward as ForwardIcon,
  PersonAdd as PersonAddIcon,
  Reply as ReplyIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface LetterEventUser {
  fullName: string
  role: string
  division: string
  avatar?: string
}
interface LetterEvent {
  id: string
  user: LetterEventUser
  eventType:
    | 'ADD_NOTE'
    | 'ADD_ATTACHMENT'
    | 'REMOVE_ATTACHMENT'
    | 'REPLY'
    | 'CHANGE_STATUS'
    | 'CHANGE_PRIORITY'
    | 'UPDATE_DETAILS'
  eventDetails?: Record<string, any>
  createdAt: string
}
interface LetterTimelineProps {
  events: Array<LetterEvent>
  formatTimestamp: (timestamp: string) => string
  getStatusColor: (status: string) => string
}
export const LetterTimeline: React.FC<LetterTimelineProps> = ({
  events,
  formatTimestamp,
  getStatusColor,
}) => {
  const theme = useTheme()
  const getEventIcon = (type: LetterEvent['eventType']) => {
    switch (type) {
      case 'CHANGE_STATUS':
        return <VisibilityIcon />
      case 'CHANGE_PRIORITY':
        return <ForwardIcon />
      case 'REPLY':
        return <ReplyIcon />
      case 'ADD_ATTACHMENT':
      case 'REMOVE_ATTACHMENT':
        return <AttachIcon />
      case 'ADD_NOTE':
        return <PersonAddIcon />
      default:
        return <VisibilityIcon />
    }
  }

  return (
    <Paper
      sx={{
        p: 2.5,
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 2, opacity: 0.75, letterSpacing: 0.5 }}
      >
        Timeline
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 26,
            top: 4,
            bottom: 4,
            width: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.divider,
          }}
        />
        <Stack spacing={0}>
          {events.map((event, index) => {
            const details = event.eventDetails || {}
            const attachments = Array.isArray(details.attachments)
              ? details.attachments
              : []
            return (
              <Box
                key={event.id}
                sx={{
                  position: 'relative',
                  pb: index < events.length - 1 ? 3 : 0,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 18.5,
                    top: 8,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
                  }}
                />
                <Box sx={{ ml: 7, pl: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={event.user.avatar}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: theme.palette.secondary.main,
                          fontSize: 14,
                        }}
                      >
                        {event.user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {event.user.fullName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {event.user.role} • {event.user.division}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: 11 }}
                      >
                        {formatTimestamp(event.createdAt)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          justifyContent: 'flex-end',
                          mt: 0.25,
                        }}
                      >
                        {getEventIcon(event.eventType)}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 10, letterSpacing: 0.5 }}
                        >
                          {event.eventType.replaceAll('_', ' ')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {(details.note ||
                    details.message ||
                    event.eventType === 'CHANGE_STATUS' ||
                    event.eventType === 'CHANGE_PRIORITY' ||
                    attachments.length > 0) && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        backgroundColor: theme.palette.background.paper,
                        mb: 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                      }}
                    >
                      {details.note || details.message ? (
                        <Typography
                          variant="body2"
                          sx={{ lineHeight: 1.5, fontSize: 13 }}
                        >
                          {details.note || details.message}
                        </Typography>
                      ) : null}
                      {event.eventType === 'CHANGE_STATUS' &&
                        details.from &&
                        details.to && (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              mt: 1,
                              alignItems: 'center',
                            }}
                          >
                            <Chip label={details.from} size="small" />
                            <Typography variant="body2" color="text.secondary">
                              →
                            </Typography>
                            <Chip
                              label={details.to}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(details.to),
                                color: 'white',
                              }}
                            />
                          </Box>
                        )}
                      {event.eventType === 'CHANGE_PRIORITY' &&
                        details.from &&
                        details.to && (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              mt: 1,
                              alignItems: 'center',
                            }}
                          >
                            <Chip label={details.from} size="small" />
                            <Typography variant="body2" color="text.secondary">
                              →
                            </Typography>
                            <Chip
                              label={details.to}
                              size="small"
                              color="warning"
                            />
                          </Box>
                        )}
                      {attachments.length > 0 && (
                        <Box sx={{ mt: 1.5 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 0.75, display: 'block', fontSize: 11 }}
                          >
                            {attachments.length} attachment
                            {attachments.length > 1 ? 's' : ''}:
                          </Typography>
                          <Stack spacing={1}>
                            {attachments.map((attachment: any) => (
                              <Box
                                key={attachment.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  p: 0.75,
                                  backgroundColor:
                                    theme.palette.background.paper,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  transition:
                                    'background-color .2s, transform .15s',
                                  '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    transform: 'translateY(-2px)',
                                  },
                                }}
                                onClick={() =>
                                  console.log(
                                    'Download:',
                                    attachment.fileName || attachment.name,
                                  )
                                }
                              >
                                <AttachIcon fontSize="small" color="primary" />
                                <Typography variant="caption" sx={{ flex: 1 }}>
                                  {attachment.fileName || attachment.name}
                                </Typography>
                                <IconButton size="small">
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Paper>
  )
}
