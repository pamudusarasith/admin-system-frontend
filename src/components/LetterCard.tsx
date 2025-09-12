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
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import type { Letter } from '@/api/letters'

interface LetterCardProps {
  letter: Letter
  index: number
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  formatTimeAgo: (dateString: string) => string
  onCardClick: (id: number) => void
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  index,
  getPriorityColor,
  getStatusColor,
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
      case 'assign_to_division':
        console.log('Assign to division:', letter.id)
        break
      case 'assign_to_officer':
        console.log('Assign to officer:', letter.id)
        break
      default:
        break
    }
  }

  const getDaysOpen = (receivedDate: string): number => {
    return receivedDate
      ? Math.floor(
          (new Date().getTime() - new Date(receivedDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0
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
                  label={letter.status.replace(/_/g, ' ')}
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
                {!letter.assignedDivision && (
                  <MenuItem
                    onClick={(e) => handleMenuAction('assign_to_division', e)}
                  >
                    <ForwardIcon sx={{ mr: 1, fontSize: 18 }} />
                    Assign to Division
                  </MenuItem>
                )}
                {letter.status === 'ASSIGNED_TO_DIVISION' && (
                  <MenuItem
                    onClick={(e) => handleMenuAction('assign_to_officer', e)}
                  >
                    <AssignmentIcon sx={{ mr: 1, fontSize: 18 }} />
                    Assign to Officer
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {letter.noOfAttachments! > 0 && (
              <Tooltip title="Has attachments">
                <Chip
                  icon={<AttachFileIcon sx={{ fontSize: 12 }} />}
                  label={`${letter.noOfAttachments} attachments`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: '0.7rem' }}
                />
              </Tooltip>
            )}
            <Chip
              label={`${getDaysOpen(letter.receivedDate)} days open`}
              size="small"
              icon={<ScheduleIcon sx={{ fontSize: 12 }} />}
              color={getDaysOpen(letter.receivedDate) > 7 ? 'error' : 'default'}
              variant={
                getDaysOpen(letter.receivedDate) > 7 ? 'filled' : 'outlined'
              }
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

            {/* Content */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                maxHeight: '5.6em',
                lineHeight: 1.4,
              }}
            >
              {letter.content && letter.content.length > 350
                ? `${letter.content.slice(0, 350)}...`
                : letter.content || 'No content available.'}
            </Typography>
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

            {/* To Section */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold', mb: 1.5, color: 'secondary.main' }}
              >
                � TO
              </Typography>
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
                  {letter.receiverDetails.name
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
                    {letter.receiverDetails.name}
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
                    {letter.receiverDetails.designation ||
                      'No designation provided'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {letter.receiverDetails.divisionName ||
                      'No division specified'}
                  </Typography>
                </Box>
              </Box>
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
