import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Forward as ForwardIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'

interface LetterSummary {
  id: number
  reference: string
  senderDetails: {
    name: string
    email: string | null
    address: string | null
    phone_number: string | null
  }
  sentDate: string | null
  receivedDate: string
  modeOfArrival:
    | 'REGISTERED_POST'
    | 'UNREGISTERED_POST'
    | 'EMAIL'
    | 'WHATSAPP'
    | 'HAND_DELIVERED'
    | 'FAX'
    | 'OTHER'
  subject: string
  content: string | null
  priority: 'NORMAL' | 'HIGH' | 'URGENT'
  status:
    | 'NEW'
    | 'ASSIGNED_TO_DIVISION'
    | 'PENDING_ACCEPTANCE'
    | 'ASSIGNED_TO_OFFICER'
    | 'RETURNED_FROM_OFFICER'
    | 'RETURNED_FROM_DIVISION'
    | 'CLOSED'
  assignedDivision: string | null
  assignedUser: string | null
  isAcceptedByUser: boolean
  category?: string
  daysOpen?: number
  hasAttachments?: boolean
  replyCount?: number
}

interface LetterCardProps {
  letter: LetterSummary
  index: number
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  formatDate: (dateString: string) => string
  formatTimeAgo: (dateString: string) => string
  onCardClick: (id: number) => void
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  index,
  getPriorityColor,
  getStatusColor,
  formatDate,
  formatTimeAgo,
  onCardClick,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMenuAction = (action: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setAnchorEl(null)

    // Handle different actions
    switch (action) {
      case 'view':
        onCardClick(letter.id)
        break
      case 'reply':
        console.log('Reply to letter:', letter.id)
        break
      case 'forward':
        console.log('Forward letter:', letter.id)
        break
      case 'assign':
        console.log('Assign letter:', letter.id)
        break
      default:
        break
    }
  }

  return (
    <Zoom in timeout={400 + index * 100}>
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          '&:hover': {
            boxShadow: theme.shadows[12],
            transform: 'translateY(-4px)',
            borderColor: theme.palette.primary.light,
          },
        }}
        onClick={() => onCardClick(letter.id)}
      >
        {/* Header Section with Status Indicators */}
        <Box
          className="letter-card-header"
          sx={{
            p: 2.5,
            pb: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              {letter.reference}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={letter.priority}
                  size="small"
                  sx={{
                    backgroundColor: getPriorityColor(letter.priority),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
                <Chip
                  label={letter.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(letter.status),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  ml: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={(e) => handleMenuAction('view', e)}>
                  <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
                  View Details
                </MenuItem>
                <MenuItem onClick={(e) => handleMenuAction('reply', e)}>
                  <ReplyIcon sx={{ mr: 1, fontSize: 18 }} />
                  Reply
                </MenuItem>
                <MenuItem onClick={(e) => handleMenuAction('forward', e)}>
                  <ForwardIcon sx={{ mr: 1, fontSize: 18 }} />
                  Forward
                </MenuItem>
                {letter.status === 'NEW' && (
                  <MenuItem onClick={(e) => handleMenuAction('assign', e)}>
                    <AssignmentIcon sx={{ mr: 1, fontSize: 18 }} />
                    Assign
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {letter.hasAttachments && (
              <Tooltip title="Has attachments">
                <Chip
                  icon={<AttachFileIcon sx={{ fontSize: 12 }} />}
                  label="Attachments"
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.7rem' }}
                />
              </Tooltip>
            )}
            {(letter.replyCount ?? 0) > 0 && (
              <Tooltip title={`${letter.replyCount} replies/comments`}>
                <Chip
                  icon={<ReplyIcon sx={{ fontSize: 12 }} />}
                  label={`${letter.replyCount} replies`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.7rem' }}
                />
              </Tooltip>
            )}
            <Chip
              label={`${letter.daysOpen ?? 0} days open`}
              size="small"
              icon={<ScheduleIcon sx={{ fontSize: 12 }} />}
              color={(letter.daysOpen ?? 0) > 7 ? 'error' : 'default'}
              variant={(letter.daysOpen ?? 0) > 7 ? 'filled' : 'outlined'}
              sx={{ height: 22, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Main Content */}
          <Box sx={{ mb: 3 }}>
            {/* Subject */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                color: 'text.primary',
              }}
            >
              {letter.subject}
            </Typography>

            {/* Category */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AssignmentIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Category:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {letter.category}
              </Typography>
            </Box>
          </Box>

          {/* Two Column Layout for Contact Info */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* From Section */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold', mb: 1.5, color: 'primary.main' }}
              >
                📨 FROM
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}
                >
                  {letter.senderDetails.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {letter.senderDetails.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {letter.senderDetails.email || 'No email provided'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon
                      sx={{ fontSize: 12, color: 'text.secondary' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatTimeAgo(letter.receivedDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Assigned To Section */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold', mb: 1.5, color: 'secondary.main' }}
              >
                👤 ASSIGNMENT STATUS
              </Typography>
              {letter.assignedUser ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.palette.secondary.main,
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {letter.assignedUser
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {letter.assignedUser}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {letter.assignedDivision || 'Unknown Division'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Status:{' '}
                      {letter.isAcceptedByUser
                        ? 'Accepted'
                        : 'Pending Acceptance'}
                    </Typography>
                  </Box>
                </Box>
              ) : letter.assignedDivision ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    <AssignmentIcon />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {letter.assignedDivision}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Division Assignment
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mode: {letter.modeOfArrival.replace(/_/g, ' ')}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.palette.warning.main,
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    <ScheduleIcon />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 'bold',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Pending Assignment
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Awaiting Division Assignment
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Received: {formatDate(letter.receivedDate)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Action Button for Mobile */}
          {isMobile && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2 }}
                fullWidth
              >
                View Details
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Zoom>
  )
}
