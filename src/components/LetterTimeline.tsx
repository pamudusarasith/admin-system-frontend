import { Avatar, Box, Chip, Paper, Typography } from '@mui/material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import type { ChangeStatusEventDetails, LetterEvent, User } from '@/api'

interface LetterTimelineProps {
  events: Array<LetterEvent>
  getStatusColor: (status: string) => string
}

export function LetterTimeline({
  events,
  getStatusColor,
}: Readonly<LetterTimelineProps>) {
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
        sx={{
          fontWeight: 600,
          mb: 2,
          opacity: 0.75,
          letterSpacing: 0.5,
        }}
      >
        Timeline
      </Typography>
      <Timeline
        sx={{
          '& .MuiTimelineItem-root:before': {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {events.map((event) => {
          let element = null
          switch (event.eventType) {
            case 'ADD_NOTE':
            case 'ADD_ATTACHMENT':
            case 'REMOVE_ATTACHMENT':
            case 'REPLY':
              break
            case 'CHANGE_STATUS':
              element = (
                <ChangeStatusEvent
                  details={event.eventDetails as ChangeStatusEventDetails}
                  getStatusColor={getStatusColor}
                />
              )
              break
            case 'CHANGE_PRIORITY':
            case 'UPDATE_DETAILS':
            default:
              break
          }

          return (
            <TimelineItem key={event.id}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: 'primary.main',
                    width: 8,
                    height: 8,
                  }}
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ pb: 2 }}>
                <EventMeta user={event.user} createdAt={event.createdAt} />
                {element}
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Paper>
  )
}

interface EventMetaProps {
  user: User
  createdAt: string
}

function EventMeta({ user, createdAt }: Readonly<EventMetaProps>) {
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : ''

  const formatted = new Date(createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
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
          src={(user as any).avatar}
          sx={{
            width: 32,
            height: 32,
            fontSize: 13,
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mb: 0.25,
            }}
          >
            {user.fullName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: 11,
            }}
          >
            {user.role} • {user.division}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.primary"
        sx={{
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          ml: 2,
          backgroundColor: (t) => t.palette.action.selected,
          px: 1,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        {formatted}
      </Typography>
    </Box>
  )
}

interface ChangeStatusEventProps {
  details: ChangeStatusEventDetails
  getStatusColor: (status: string) => string
}

function ChangeStatusEvent({
  details,
  getStatusColor,
}: Readonly<ChangeStatusEventProps>) {
  if (details.newStatus === 'NEW') {
    return (
      <Box
        sx={{
          mt: 0.5,
          border: (t) => `1px solid ${t.palette.divider}`,
          p: 1,
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            my: 1,
            fontWeight: 500,
          }}
        >
          Letter registered in the system
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 0.5,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Status changed to
      </Typography>
      <Chip
        label={details.newStatus.replaceAll('_', ' ')}
        size="small"
        sx={{
          backgroundColor: getStatusColor(details.newStatus),
          color: 'white',
          fontWeight: 500,
          fontSize: 11,
        }}
      />
    </Box>
  )
}
