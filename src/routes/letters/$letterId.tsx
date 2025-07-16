import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, useTheme } from '@mui/material'
import {
  LetterActionMenu,
  LetterDetailsGrid,
  LetterDialogs,
  LetterHeader,
  LetterTimeline,
  SidebarLayout,
} from '@/components'

export const Route = createFileRoute('/letters/$letterId')({
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
  type: 'received' | 'assigned_to_division' | 'assigned_to_person' | 'forwarded' | 'replied' | 'returned' | 'status_change'
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
  status: 'Pending' | 'Assigned to Division' | 'Assigned to Person' | 'In Progress' | 'Completed' | 'Returned'
  assignedDivision?: {
    id: string
    name: string
    assignedDate: string
    assignedBy: {
      name: string
      role: string
    }
  }
  currentAssignee?: {
    name: string
    role: string
    division: string
    assignedDate?: string
    assignedBy?: {
      name: string
      role: string
    }
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
  subject:
    'Request for Educational Policy Review and Implementation Guidelines',
  sender: {
    name: 'Dr. Priyanka Wickramasinghe',
    organization: 'University of Colombo',
    email: 'priyanka.w@ucolombo.lk',
    phone: '+94 11 250 3345',
  },
  receivedDate: '2024-01-15T09:30:00Z',
  priority: 'High',
  status: 'In Progress',
  assignedDivision: {
    id: 'policy-dev',
    name: 'Policy Development Division',
    assignedDate: '2024-01-15T10:15:00Z',
    assignedBy: {
      name: 'Kamala Silva',
      role: 'Secretary',
    },
  },
  currentAssignee: {
    name: 'Nimal Perera',
    role: 'Additional Secretary',
    division: 'Policy Development Division',
    assignedDate: '2024-01-16T08:30:00Z',
    assignedBy: {
      name: 'Sunil Jayasinghe',
      role: 'Division Head',
    },
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
      content:
        'We hereby request a comprehensive review of the current educational policies...',
    },
    {
      id: '2',
      type: 'assigned_to_division',
      description: 'Assigned to Policy Development Division',
      performedBy: {
        name: 'Kamala Silva',
        role: 'Secretary',
        division: 'Secretary Office',
        avatar: 'https://placehold.co/40x40/2196F3/FFFFFF?text=KS',
      },
      timestamp: '2024-01-15T10:15:00Z',
      assignedTo: {
        type: 'division',
        name: 'Policy Development Division',
        id: 'policy-dev',
      },
      content:
        'This policy review request requires immediate attention. Please review and provide recommendations within 5 working days.',
    },
    {
      id: '3',
      type: 'assigned_to_person',
      description: 'Assigned to Nimal Perera within Policy Development Division',
      performedBy: {
        name: 'Sunil Jayasinghe',
        role: 'Division Head',
        division: 'Policy Development Division',
        avatar: 'https://placehold.co/40x40/9C27B0/FFFFFF?text=SJ',
      },
      timestamp: '2024-01-16T08:30:00Z',
      assignedTo: {
        type: 'person',
        name: 'Nimal Perera',
        id: 'nimal-perera',
      },
      content:
        'Assigning this policy review to Additional Secretary for detailed analysis.',
    },
    {
      id: '4',
      type: 'status_change',
      description: 'Status changed from Assigned to Person to In Progress',
      performedBy: {
        name: 'Nimal Perera',
        role: 'Additional Secretary',
        division: 'Policy Development Division',
        avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=NP',
      },
      timestamp: '2024-01-16T08:45:00Z',
      statusFrom: 'Assigned to Person',
      statusTo: 'In Progress',
    },
    {
      id: '5',
      type: 'replied',
      description: 'Internal analysis note added',
      performedBy: {
        name: 'Nimal Perera',
        role: 'Additional Secretary',
        division: 'Policy Development Division',
        avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=NP',
      },
      timestamp: '2024-01-16T14:20:00Z',
      content:
        'Initial analysis completed. The proposal requires input from the Legal Division regarding compliance with existing regulations. Coordination meeting scheduled for next week.',
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
      case 'Assigned to Division':
        return theme.palette.primary.main
      case 'Assigned to Person':
        return theme.palette.secondary.main
      case 'Returned':
        return theme.palette.warning.main
      default:
        return theme.palette.grey[500]
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

  const handleSendReply = () => {
    console.log('Send reply:', replyContent)
    setReplyDialogOpen(false)
    setReplyContent('')
  }

  const handleForwardLetter = () => {
    console.log('Forward letter')
    setForwardDialogOpen(false)
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <LetterHeader
          letter={letter}
          onReply={() => setReplyDialogOpen(true)}
          onForward={() => setForwardDialogOpen(true)}
          onMenuClick={handleMenuClick}
          getPriorityColor={getPriorityColor}
          getStatusColor={getStatusColor}
        />

        <LetterDetailsGrid
          sender={letter.sender}
          assignedDivision={letter.assignedDivision}
          currentAssignee={letter.currentAssignee}
          category={letter.category}
          receivedDate={letter.receivedDate}
          originalAttachments={letter.originalAttachments}
          formatTimestamp={formatTimestamp}
        />

        <LetterTimeline
          actions={letter.actions}
          formatTimestamp={formatTimestamp}
          getStatusColor={getStatusColor}
        />

        <LetterActionMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        />

        <LetterDialogs
          replyDialogOpen={replyDialogOpen}
          forwardDialogOpen={forwardDialogOpen}
          replyContent={replyContent}
          onReplyDialogClose={() => setReplyDialogOpen(false)}
          onForwardDialogClose={() => setForwardDialogOpen(false)}
          onReplyContentChange={setReplyContent}
          onSendReply={handleSendReply}
          onForwardLetter={handleForwardLetter}
        />
      </Container>
    </SidebarLayout>
  )
}
