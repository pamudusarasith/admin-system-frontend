import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Archive as ArchiveIcon,
  ArrowBack as ArrowBackIcon,
  AssignmentInd as AssignmentIndIcon,
  AttachFile as AttachIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  Forward as ForwardIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { SidebarLayout } from '@/components'

export const Route = createFileRoute('/letters/thread/$letterId')({
  component: LetterThreadView,
})

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
  type: 'received' | 'forwarded' | 'replied' | 'returned' | 'status_change'
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
  statusFrom?: string
  statusTo?: string
  priority?: 'Normal' | 'Urgent' | 'High'
}

interface Letter {
  id: string
  referenceNumber: string
  subject: string
  sender: {
    name: string
    organization: string
    email: string
    phone: string
  }
  receivedDate: string
  priority: 'Normal' | 'Urgent' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed' | 'Returned'
  currentAssignee: {
    name: string
    role: string
    division: string
  }
  category: string
  confidentialityLevel: 'Public' | 'Confidential' | 'Restricted' | 'Secret'
  actions: Array<LetterAction>
  originalAttachments: Array<LetterAttachment>
}

// Mock data
const mockLetter: Letter = {
  id: '1',
  referenceNumber: 'MIN/EDU/2024/001',
  subject: 'Request for Educational Policy Review and Implementation Guidelines',
  sender: {
    name: 'Dr. Priyanka Wickramasinghe',
    organization: 'University of Colombo',
    email: 'priyanka.w@ucolombo.lk',
    phone: '+94 11 250 3345',
  },
  receivedDate: '2024-01-15T09:30:00Z',
  priority: 'High',
  status: 'In Progress',
  currentAssignee: {
    name: 'Nimal Perera',
    role: 'Additional Secretary',
    division: 'Policy Development Division',
  },
  category: 'Policy Matter',
  confidentialityLevel: 'Confidential',
  originalAttachments: [
    {
      id: '1',
      name: 'Policy_Review_Proposal.pdf',
      size: '2.3 MB',
      type: 'PDF',
      uploadedBy: 'System',
      uploadedAt: '2024-01-15T09:30:00Z',
    },
    {
      id: '2',
      name: 'University_Statistics_2023.xlsx',
      size: '1.8 MB',
      type: 'Excel',
      uploadedBy: 'System',
      uploadedAt: '2024-01-15T09:30:00Z',
    },
  ],
  actions: [
    {
      id: '1',
      type: 'received',
      description: 'Letter received from University of Colombo',
      performedBy: {
        name: 'System',
        role: 'Automated',
        division: 'Mail Room',
      },
      timestamp: '2024-01-15T09:30:00Z',
      content: 'We hereby request a comprehensive review of the current educational policies...',
    },
    {
      id: '2',
      type: 'forwarded',
      description: 'Forwarded to Policy Development Division',
      performedBy: {
        name: 'Kamala Silva',
        role: 'Secretary',
        division: 'Secretary Office',
        avatar: 'https://placehold.co/40x40/2196F3/FFFFFF?text=KS',
      },
      timestamp: '2024-01-15T10:15:00Z',
      fromDivision: 'Secretary Office',
      toDivision: 'Policy Development Division',
      content: 'Please review this policy request and provide recommendations within 5 working days.',
    },
    {
      id: '3',
      type: 'status_change',
      description: 'Status changed from Pending to In Progress',
      performedBy: {
        name: 'Nimal Perera',
        role: 'Additional Secretary',
        division: 'Policy Development Division',
        avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=NP',
      },
      timestamp: '2024-01-16T08:45:00Z',
      statusFrom: 'Pending',
      statusTo: 'In Progress',
    },
    {
      id: '4',
      type: 'replied',
      description: 'Internal note added',
      performedBy: {
        name: 'Nimal Perera',
        role: 'Additional Secretary',
        division: 'Policy Development Division',
        avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=NP',
      },
      timestamp: '2024-01-16T14:20:00Z',
      content: 'Initial analysis completed. The proposal requires input from the Legal Division regarding compliance with existing regulations. Coordination meeting scheduled for next week.',
      attachments: [
        {
          id: '3',
          name: 'Initial_Analysis_Report.pdf',
          size: '890 KB',
          type: 'PDF',
          uploadedBy: 'Nimal Perera',
          uploadedAt: '2024-01-16T14:20:00Z',
        },
      ],
    },
  ],
}

function LetterThreadView() {
  const theme = useTheme()
  const [letter] = useState<Letter>(mockLetter)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return theme.palette.error.main
      case 'Urgent':
        return theme.palette.warning.main
      default:
        return theme.palette.success.main
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return theme.palette.success.main
      case 'In Progress':
        return theme.palette.info.main
      case 'Returned':
        return theme.palette.warning.main
      default:
        return theme.palette.grey[500]
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'forwarded':
        return <ForwardIcon />
      case 'replied':
        return <ReplyIcon />
      default:
        return <VisibilityIcon />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
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
            <Typography color="text.primary">
              {letter.referenceNumber}
            </Typography>
          </Breadcrumbs>

          {/* Letter Title Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, lineHeight: 1.2 }}>
                  {letter.subject}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                  Reference: {letter.referenceNumber}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    label={letter.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(letter.priority),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    label={letter.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(letter.status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    label={letter.confidentialityLevel}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
              
              {/* Primary Actions */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Button
                  variant="contained"
                  startIcon={<ReplyIcon />}
                  onClick={() => setReplyDialogOpen(true)}
                  size="large"
                >
                  Reply
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ForwardIcon />}
                  onClick={() => setForwardDialogOpen(true)}
                  size="large"
                >
                  Forward
                </Button>
                <IconButton onClick={handleMenuClick} size="large">
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Letter Details Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
            {/* Left Column - Sender & Assignment */}
            <Box>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Sender Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, backgroundColor: theme.palette.primary.main }}>
                    {letter.sender.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {letter.sender.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {letter.sender.organization}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {letter.sender.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {letter.sender.phone}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Current Assignment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, backgroundColor: theme.palette.secondary.main }}>
                    {letter.currentAssignee.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {letter.currentAssignee.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {letter.currentAssignee.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {letter.currentAssignee.division}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Right Column - Details & Attachments */}
            <Box>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Letter Details
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1">{letter.category}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Received Date</Typography>
                    <Typography variant="body1">{formatTimestamp(letter.receivedDate)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Days Open</Typography>
                    <Typography variant="body1" color={new Date().getTime() - new Date(letter.receivedDate).getTime() > 7 * 24 * 60 * 60 * 1000 ? 'error.main' : 'text.primary'}>
                      {Math.floor((new Date().getTime() - new Date(letter.receivedDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Attachments */}
              {letter.originalAttachments.length > 0 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Attachments ({letter.originalAttachments.length})
                  </Typography>
                  <Stack spacing={1}>
                    {letter.originalAttachments.map((attachment) => (
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
                          '&:hover': { backgroundColor: theme.palette.grey[50] }
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
        </Box>

        {/* Letter Thread */}
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
              {letter.actions.map((action, index) => (
                <Box key={action.id} sx={{ position: 'relative', pb: index < letter.actions.length - 1 ? 4 : 0 }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={action.performedBy.avatar}
                          sx={{ width: 36, height: 36, backgroundColor: theme.palette.secondary.main }}
                        >
                          {action.performedBy.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {action.performedBy.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.performedBy.role} • {action.performedBy.division}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(action.timestamp)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
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
                          backgroundColor: theme.palette.grey[50], 
                          mb: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {action.content}
                        </Typography>
                      </Paper>
                    )}

                    {action.fromDivision && action.toDivision && (
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                        <Chip label={action.fromDivision} size="small" variant="outlined" />
                        <Typography variant="body2" color="text.secondary">→</Typography>
                        <Chip label={action.toDivision} size="small" color="primary" />
                      </Box>
                    )}

                    {action.statusFrom && action.statusTo && (
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                        <Chip
                          label={action.statusFrom}
                          size="small"
                          sx={{ backgroundColor: theme.palette.grey[300], color: theme.palette.grey[700] }}
                        />
                        <Typography variant="body2" color="text.secondary">→</Typography>
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
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          {action.attachments.length} attachment{action.attachments.length > 1 ? 's' : ''}:
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
                                backgroundColor: theme.palette.grey[50],
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: theme.palette.grey[100] }
                              }}
                              onClick={() => console.log('Download:', attachment.name)}
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

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <AssignmentIndIcon sx={{ mr: 2 }} />
            Reassign Letter
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <EditIcon sx={{ mr: 2 }} />
            Change Status
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <FlagIcon sx={{ mr: 2 }} />
            Change Priority
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <AttachIcon sx={{ mr: 2 }} />
            Add Attachment
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <PrintIcon sx={{ mr: 2 }} />
            Print Letter
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ShareIcon sx={{ mr: 2 }} />
            Share Letter
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <DownloadIcon sx={{ mr: 2 }} />
            Export as PDF
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Mark as Completed
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ color: 'warning.main' }}>
            <ArchiveIcon sx={{ mr: 2 }} />
            Archive Letter
          </MenuItem>
        </Menu>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={() => setReplyDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Reply to Letter</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply here..."
              sx={{ mt: 1 }}
            />
            <Button
              startIcon={<AttachIcon />}
              sx={{ mt: 2 }}
              onClick={() => console.log('Attach files')}
            >
              Attach Files
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => {
                console.log('Send reply:', replyContent)
                setReplyDialogOpen(false)
                setReplyContent('')
              }}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Forward Dialog */}
        <Dialog
          open={forwardDialogOpen}
          onClose={() => setForwardDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Forward Letter</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="To Division/Officer"
              sx={{ mb: 2, mt: 1 }}
              placeholder="Select division or officer"
            />
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Add forwarding note (optional)..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForwardDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={<ForwardIcon />}
              onClick={() => {
                console.log('Forward letter')
                setForwardDialogOpen(false)
              }}
            >
              Forward
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </SidebarLayout>
  )
}
