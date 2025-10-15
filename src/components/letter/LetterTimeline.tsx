import {
  Avatar,
  Box,
  Chip,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import {
  Apartment as ApartmentIcon,
  AttachFile as AttachFileIcon,
  FiberNew as FiberNewIcon,
  NoteAlt as NoteAltIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import mime from 'mime'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import type {
  AddNoteEventDetails,
  ChangeStatusEventDetails,
  Division,
  LetterEvent,
  User,
} from '@/api'

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
              element = (
                <AddNoteEvent
                  details={event.eventDetails as AddNoteEventDetails}
                />
              )
              break
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
  switch (details.newStatus) {
    case 'NEW':
      return <NewStatusEvent />
    case 'ASSIGNED_TO_DIVISION':
      return details.division ? (
        <AssignedDivisionStatusEvent division={details.division} />
      ) : null
    case 'PENDING_ACCEPTANCE':
      return details.user ? (
        <AssignedToOfficerStatusEvent user={details.user} />
      ) : null
    case 'ASSIGNED_TO_OFFICER':
      return details.user ? (
        <AcceptedByOfficerStatusEvent user={details.user} />
      ) : null
    default:
      return (
        <GenericStatusEvent
          status={details.newStatus}
          getStatusColor={getStatusColor}
        />
      )
  }
}

interface GenericStatusEventProps {
  status: string
  getStatusColor: (status: string) => string
  message?: string
}

function GenericStatusEvent({
  status,
  getStatusColor,
  message = 'Status changed to',
}: Readonly<GenericStatusEventProps>) {
  return (
    <StatusMessageEvent
      message={message}
      status={status}
      getStatusColor={getStatusColor}
    />
  )
}

interface StatusMessageEventProps {
  message: string
  status: string
  getStatusColor: (status: string) => string
}

function StatusMessageEvent({
  message,
  status,
  getStatusColor,
}: Readonly<StatusMessageEventProps>) {
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
        {message}
      </Typography>
      <Chip
        label={formatStatus(status)}
        size="small"
        sx={{
          backgroundColor: getStatusColor(status),
          color: 'white',
          fontWeight: 500,
          fontSize: 11,
        }}
      />
    </Box>
  )
}

function formatStatus(status: string) {
  return status.replaceAll('_', ' ')
}

function NewStatusEvent() {
  return (
    <TimelineCard
      icon={<FiberNewIcon sx={{ fontSize: 16, color: 'success.main' }} />}
      title="Letter registered"
      borderColor={(t) => `${t.palette.success.main}40`}
      headerColor={(t) => t.palette.success.main}
    >
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.6,
          fontWeight: 500,
        }}
      >
        Letter registered in the system
      </Typography>
    </TimelineCard>
  )
}

interface AssignedDivisionStatusEventProps {
  readonly division: Division
}

function AssignedDivisionStatusEvent({
  division,
}: AssignedDivisionStatusEventProps) {
  const initials = division.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <TimelineCard
      icon={<ApartmentIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
      title="Assigned to division"
      borderColor={(t) => `${t.palette.primary.main}40`}
      headerColor={(t) => t.palette.primary.main}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          sx={{
            width: 40,
            height: 40,
            fontSize: 16,
            fontWeight: 600,
            backgroundColor: (t) => t.palette.primary.main,
            color: 'white',
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {division.name}
          </Typography>
          {division.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {division.description}
            </Typography>
          )}
        </Box>
      </Stack>
    </TimelineCard>
  )
}

interface AssignedToOfficerStatusEventProps {
  user: User
}

function AssignedToOfficerStatusEvent({
  user,
}: Readonly<AssignedToOfficerStatusEventProps>) {
  return (
    <TimelineCard
      icon={<PersonIcon sx={{ fontSize: 16, color: 'secondary.main' }} />}
      title="Assigned to officer"
      borderColor={(t) => `${t.palette.secondary.main}40`}
      headerColor={(t) => t.palette.secondary.main}
    >
      <UserDetails user={user} />
    </TimelineCard>
  )
}

interface AcceptedByOfficerStatusEventProps {
  user: User
}

function AcceptedByOfficerStatusEvent({
  user,
}: Readonly<AcceptedByOfficerStatusEventProps>) {
  return (
    <TimelineCard
      icon={<PersonIcon sx={{ fontSize: 16, color: 'secondary.main' }} />}
      title="Accepted by officer"
      borderColor={(t) => `${t.palette.secondary.main}40`}
      headerColor={(t) => t.palette.secondary.main}
    >
      <UserDetails user={user} />
    </TimelineCard>
  )
}

interface AddNoteEventProps {
  details: AddNoteEventDetails
}

function AddNoteEvent({ details }: Readonly<AddNoteEventProps>) {
  return (
    <TimelineCard
      icon={<NoteAltIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
      title="Added a note"
      borderColor={(t) => t.palette.divider}
      headerColor={(t) => t.palette.primary.main}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'text.primary',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.6,
        }}
      >
        {details.content}
      </Typography>

      {details.attachments && details.attachments.length > 0 && (
        <Stack spacing={0.5} sx={{ mt: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: 10,
            }}
          >
            Attachments ({details.attachments.length})
          </Typography>
          {details.attachments.map((attachment) => (
            <Link
              key={attachment.id}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 1,
                backgroundColor: (t) => t.palette.action.hover,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: (t) => t.palette.action.selected,
                },
              }}
            >
              <AttachFileIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              >
                {attachment.fileName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  ml: 'auto',
                }}
              >
                {mime.getExtension(attachment.fileType)?.toUpperCase() ||
                  'FILE'}
              </Typography>
            </Link>
          ))}
        </Stack>
      )}
    </TimelineCard>
  )
}

type ThemeColor = string | ((theme: Theme) => string)

interface TimelineCardProps {
  icon: ReactNode
  title: string
  borderColor?: ThemeColor
  headerColor?: ThemeColor
  children: ReactNode
}

function resolveThemeColor(color: ThemeColor | undefined, theme: Theme) {
  if (!color) {
    return undefined
  }

  return typeof color === 'function' ? color(theme) : color
}

function TimelineCard({
  icon,
  title,
  borderColor,
  headerColor,
  children,
}: Readonly<TimelineCardProps>) {
  const theme = useTheme()
  const resolvedBorderColor =
    resolveThemeColor(borderColor, theme) ?? theme.palette.divider
  const resolvedHeaderColor =
    resolveThemeColor(headerColor, theme) ?? theme.palette.text.primary
  const headerBackground = alpha(resolvedHeaderColor, 0.08)

  return (
    <Box
      sx={{
        mt: 0.5,
        border: `1px solid ${resolvedBorderColor}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          backgroundColor: headerBackground,
        }}
      >
        {icon}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: resolvedHeaderColor,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ px: 2, py: 1.5 }}>{children}</Box>
    </Box>
  )
}

interface UserDetailsProps {
  user: User
}

function UserDetails({ user }: Readonly<UserDetailsProps>) {
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase() || '??'

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        sx={{
          width: 40,
          height: 40,
          fontSize: 16,
          fontWeight: 600,
          backgroundColor: (t) => t.palette.secondary.main,
          color: 'white',
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user.fullName || user.username}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
          {user.email && (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
          {user.role && (
            <Chip
              label={user.role}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            />
          )}
          {user.division && (
            <Chip
              label={user.division}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
