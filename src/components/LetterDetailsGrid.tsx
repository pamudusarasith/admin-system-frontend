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
  AccessTime as AccessTimeIcon,
  AttachFile as AttachIcon,
  Download as DownloadIcon,
  Event as EventIcon,
  MailOutline as MailIcon,
  Outbox as SentIcon,
} from '@mui/icons-material'
import type {
  Attachment,
  Division,
  ReceiverDetails,
  SenderDetails,
  User,
} from '@/api'

interface LetterDetailsGridProps {
  sender: SenderDetails
  receiver: ReceiverDetails
  assignedDivision?: Division
  assignedUser?: User
  modeOfArrival: string
  sentDate?: string
  receivedDate: string
  attachments: Array<Attachment>
  content?: string
}

export const LetterDetailsGrid: React.FC<LetterDetailsGridProps> = ({
  sender,
  receiver,
  assignedDivision,
  assignedUser,
  modeOfArrival,
  sentDate,
  receivedDate,
  attachments,
  content,
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
      {content && (
        <Paper
          sx={{
            p: 2.5,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 3,
            gridColumn: '1 / -1',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, opacity: 0.75, letterSpacing: 0.5 }}
          >
            Content
          </Typography>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}
            color="text.primary"
          >
            {content}
          </Typography>
        </Paper>
      )}

      {/* Sender Card */}
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
          Sender
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {sender.name}
            </Typography>
            {sender.address && (
              <Typography variant="body2" color="text.secondary">
                {sender.address}
              </Typography>
            )}
            {sender.email && (
              <Typography variant="body2" color="text.secondary">
                {sender.email}
              </Typography>
            )}
            {sender.phoneNumber && (
              <Typography variant="body2" color="text.secondary">
                {sender.phoneNumber}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Receiver Card */}
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
          Receiver
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: theme.palette.secondary.main,
            }}
          >
            {receiver.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {receiver.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {receiver.designation || 'No designation specified'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {receiver.divisionName || 'No division specified'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Assigned Division Card */}
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
          Assigned Division
        </Typography>
        {assignedDivision ? (
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
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {assignedDivision.name}
              </Typography>
              {assignedDivision.description && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {assignedDivision.description}
                </Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not assigned to a division.
          </Typography>
        )}
      </Paper>

      {/* Assignee Card */}
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
          Assigned User
        </Typography>
        {assignedUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              {assignedUser.fullName
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {assignedUser.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assignedUser.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assignedUser.division}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not assigned to a user.
          </Typography>
        )}
      </Paper>

      <Paper
        sx={{
          p: 2.5,
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 3,
          position: 'relative',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1.5, opacity: 0.8, letterSpacing: 0.5 }}
        >
          Details
        </Typography>
        {(() => {
          const days = Math.floor(
            (new Date().getTime() - new Date(receivedDate).getTime()) /
              (1000 * 60 * 60 * 24),
          )
          const urgent = days > 7
          const formatDate = (d: string) =>
            new Date(d).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          return (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Days Open */}
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Box
                  sx={{
                    mt: 0.25,
                    color: urgent ? 'error.main' : 'warning.main',
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
                  >
                    Days Open
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.1,
                      mt: 0.4,
                      color: urgent ? 'error.main' : 'text.primary',
                    }}
                  >
                    {days}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ ml: 0.5, fontWeight: 400, color: 'text.secondary' }}
                    >
                      day{days !== 1 ? 's' : ''}
                    </Typography>
                  </Typography>
                </Box>
              </Box>

              {/* Received Date */}
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Box sx={{ mt: 0.25, color: 'success.main' }}>
                  <EventIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
                  >
                    Received
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.6 }}>
                    {formatDate(receivedDate)}
                  </Typography>
                </Box>
              </Box>

              {/* Mode of Arrival */}
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                <Box sx={{ mt: 0.25, color: 'primary.main' }}>
                  <MailIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      display: 'block',
                    }}
                  >
                    Mode
                  </Typography>
                  <Chip
                    size="small"
                    label={modeOfArrival.replace(/_/g, ' ')}
                    sx={{
                      mt: 0.8,
                      fontWeight: 500,
                      borderRadius: 1,
                      px: 0.75,
                      display: 'inline-flex',
                    }}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              </Box>

              {/* Sent Date (optional) */}
              {sentDate && (
                <Box sx={{ display: 'flex', gap: 1.25 }}>
                  <Box sx={{ mt: 0.25, color: 'text.secondary' }}>
                    <SentIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
                    >
                      Sent
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mt: 0.6 }}
                    >
                      {formatDate(sentDate)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )
        })()}
      </Paper>

      {attachments.length > 0 && (
        <Paper
          sx={{
            p: 2.5,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, opacity: 0.75, letterSpacing: 0.5 }}
          >
            Attachments ({attachments.length})
          </Typography>
          <Stack spacing={1}>
            {attachments.map((attachment: any) => (
              <Box
                key={attachment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: 2,
                  backgroundColor: (t) => t.palette.background.paper,
                  border: (t) => `1px solid ${t.palette.divider}`,
                  transition: 'background-color .2s, transform .15s',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: (t) => t.palette.action.hover,
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => console.log('Download:', attachment.name)}
              >
                <AttachIcon color="primary" fontSize="small" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                    {attachment.fileName || attachment.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {(attachment.size || '').toString()}{' '}
                    {attachment.size ? '•' : ''}{' '}
                    {attachment.fileType || attachment.type || ''}
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  )
}
