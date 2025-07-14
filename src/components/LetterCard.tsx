import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Reply as ReplyIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'

interface LetterSummary {
  id: string
  referenceNumber: string
  subject: string
  sender: {
    name: string
    organization: string
  }
  receivedDate: string
  priority: 'Normal' | 'Urgent' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed' | 'Returned'
  currentAssignee: {
    name: string
    division: string
  }
  category: string
  confidentialityLevel: 'Public' | 'Confidential' | 'Restricted' | 'Secret'
  daysOpen: number
  hasAttachments: boolean
  replyCount: number
}

interface LetterCardProps {
  letter: LetterSummary
  index: number
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  getConfidentialityColor: (level: string) => string
  formatDate: (dateString: string) => string
  formatTimeAgo: (dateString: string) => string
  onCardClick: (id: string) => void
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  index,
  getPriorityColor,
  getStatusColor,
  getConfidentialityColor,
  formatDate,
  formatTimeAgo,
  onCardClick,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
              {letter.referenceNumber}
            </Typography>
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
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={letter.confidentialityLevel}
              size="small"
              icon={<SecurityIcon sx={{ fontSize: 12 }} />}
              sx={{
                backgroundColor: getConfidentialityColor(
                  letter.confidentialityLevel,
                ),
                color: 'white',
                fontSize: '0.7rem',
                height: 22,
                fontWeight: 500,
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
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
            {letter.replyCount > 0 && (
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
              label={`${letter.daysOpen} days open`}
              size="small"
              icon={<ScheduleIcon sx={{ fontSize: 12 }} />}
              color={letter.daysOpen > 7 ? 'error' : 'default'}
              variant={letter.daysOpen > 7 ? 'filled' : 'outlined'}
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
                  {letter.sender.name
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
                    {letter.sender.name}
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
                    {letter.sender.organization}
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
                👤 ASSIGNED TO
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
                  {letter.currentAssignee.name
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
                    {letter.currentAssignee.name}
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
                    {letter.currentAssignee.division}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Received: {formatDate(letter.receivedDate)}
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
