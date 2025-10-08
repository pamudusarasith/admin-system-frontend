import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getLetterById } from '@/api'
import {
  ErrorMessage,
  LetterActionMenu,
  LetterDetailsGrid,
  LetterDialogs,
  LetterHeader,
  LetterTimeline,
  LoadingSpinner,
  SidebarLayout,
} from '@/components'

export const Route = createFileRoute('/_authenticated/letters/$letterId')({
  component: LetterThreadView,
})

function LetterThreadView() {
  const theme = useTheme()
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false)
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
    NEW: theme.palette.primary.light,
    ASSIGNED_TO_DIVISION: theme.palette.primary.main,
    PENDING_ACCEPTANCE: theme.palette.info.main,
    ASSIGNED_TO_OFFICER: theme.palette.secondary.main,
    RETURNED_FROM_OFFICER: theme.palette.warning.main,
    RETURNED_FROM_DIVISION: theme.palette.warning.dark,
    CLOSED: theme.palette.success.main,
  }

  const getStatusColor = (status: string) =>
    statusColorCache[status] || theme.palette.grey[500]

  const handleSendReply = () => {
    console.log('Send reply:', replyContent)
    setReplyDialogOpen(false)
    setReplyContent('')
  }

  if (result.isLoading) {
    return <LoadingSpinner />
  }

  if (result.isError) {
    if (result.error instanceof Error) {
      return <ErrorMessage title="Error" message={result.error.message} />
    }
    return (
      <ErrorMessage
        title="Unexpected Error"
        message="An unexpected error occurred."
      />
    )
  }

  if (!result.data?.data) {
    return (
      <ErrorMessage
        title="Unexpected Error"
        message="Error loading letter details."
      />
    )
  }

  const letter = result.data.data

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <LetterHeader
          letter={letter}
          onReply={() => setReplyDialogOpen(true)}
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
          getStatusColor={getStatusColor}
        />

        <LetterActionMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          letter={letter}
          onAddNote={() => setAddNoteDialogOpen(true)}
        />

        <LetterDialogs
          replyDialogOpen={replyDialogOpen}
          replyContent={replyContent}
          onReplyDialogClose={() => setReplyDialogOpen(false)}
          onReplyContentChange={setReplyContent}
          onSendReply={handleSendReply}
          addNoteDialogOpen={addNoteDialogOpen}
          onAddNoteDialogClose={() => setAddNoteDialogOpen(false)}
        />
      </Container>
    </SidebarLayout>
  )
}
