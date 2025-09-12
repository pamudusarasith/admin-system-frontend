import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type { Letter } from '@/api'
import { getLetterById } from '@/api'
import {
  LetterActionMenu,
  LetterDetailsGrid,
  LetterDialogs,
  LetterHeader,
  LetterTimeline,
  SidebarLayout,
} from '@/components'

export const Route = createFileRoute('/_authenticated/letters/$letterId')({
  component: LetterThreadView,
})

function LetterThreadView() {
  const theme = useTheme()
  // const [letter] = useState<Letter>(mockLetter)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { letterId } = Route.useParams()
  const result = useQuery({
    queryKey: ['letter', letterId],
    queryFn: () => getLetterById(Number(letterId)),
  })

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return theme.palette.error.main
      case 'HIGH':
        return theme.palette.warning.main
      case 'NORMAL':
      default:
        return theme.palette.success.main
    }
  }

  const statusColorCache: Record<string, string> = {
    NEW: theme.palette.grey[500],
    ASSIGNED_TO_DIVISION: theme.palette.primary.main,
    PENDING_ACCEPTANCE: theme.palette.info.main,
    ASSIGNED_TO_OFFICER: theme.palette.secondary.main,
    RETURNED_FROM_OFFICER: theme.palette.warning.main,
    RETURNED_FROM_DIVISION: theme.palette.warning.dark,
    CLOSED: theme.palette.success.main,
  }

  const getStatusColor = (status: string) =>
    statusColorCache[status] || theme.palette.grey[500]

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

  if (result.isLoading) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return <div>Error loading letter.</div>
  }

  const letter = result.data as Letter

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
          sender={letter.senderDetails}
          receiver={letter.receiverDetails}
          assignedDivision={letter.assignedDivision}
          assignedUser={letter.assignedUser}
          modeOfArrival={letter.modeOfArrival}
          sentDate={letter.sentDate}
          receivedDate={letter.receivedDate}
          attachments={letter.attachments ?? []}
          content={letter.content}
        />

        <LetterTimeline
          events={letter.events ?? []}
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
