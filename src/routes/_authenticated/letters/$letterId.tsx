import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, useTheme } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import { acceptLetter, getLetterById } from '@/api'
import {
  AddNoteDialog,
  AssignDivisionDialog,
  AssignUserDialog,
  ConfirmationModal,
  ErrorMessage,
  LetterActionMenu,
  LetterDetailsGrid,
  LetterDialogs,
  LetterHeader,
  LetterTimeline,
  LoadingSpinner,
  SidebarLayout,
  useSnackbar,
} from '@/components'

export const Route = createFileRoute('/_authenticated/letters/$letterId')({
  component: LetterThreadView,
})

function LetterThreadView() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false)
  const [assignDivisionDialogOpen, setAssignDivisionDialogOpen] =
    useState(false)
  const [assignUserDialogOpen, setAssignUserDialogOpen] = useState(false)
  const [acceptLetterDialogOpen, setAcceptLetterDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { letterId } = Route.useParams()
  const result = useQuery({
    queryKey: ['letter', Number(letterId)],
    queryFn: () => getLetterById(Number(letterId)),
  })

  const acceptLetterMutation = useMutation({
    mutationFn: () => acceptLetter(Number(letterId)),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['letter', Number(letterId)] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      const message =
        response.message?.trim() || 'Letter accepted successfully.'
      setAcceptLetterDialogOpen(false)
      showSnackbar({ message, severity: 'success' })
    },
    onError: (e: AxiosError<ApiResponse<any>>) => {
      const message =
        e.response?.data.message?.trim() ||
        'Failed to accept letter. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
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
          onAssignDivision={() => setAssignDivisionDialogOpen(true)}
          onAssignUser={() => setAssignUserDialogOpen(true)}
          onAcceptLetter={() => setAcceptLetterDialogOpen(true)}
        />

        <LetterDialogs
          replyDialogOpen={replyDialogOpen}
          replyContent={replyContent}
          onReplyDialogClose={() => setReplyDialogOpen(false)}
          onReplyContentChange={setReplyContent}
          onSendReply={handleSendReply}
        />

        <AddNoteDialog
          letterId={Number(letterId)}
          open={addNoteDialogOpen}
          onClose={() => setAddNoteDialogOpen(false)}
        />

        <AssignDivisionDialog
          letterId={Number(letterId)}
          open={assignDivisionDialogOpen}
          onClose={() => setAssignDivisionDialogOpen(false)}
        />

        <AssignUserDialog
          letter={letter}
          open={assignUserDialogOpen}
          onClose={() => setAssignUserDialogOpen(false)}
        />

        <ConfirmationModal
          open={acceptLetterDialogOpen}
          onClose={() => setAcceptLetterDialogOpen(false)}
          onConfirm={() => acceptLetterMutation.mutate()}
          title="Accept Letter"
          message={`Are you sure you want to accept this letter "${letter.subject}"? You will be responsible for handling this letter and its tasks.`}
          confirmText="Accept Letter"
          cancelText="Cancel"
          variant="success"
          loading={acceptLetterMutation.isPending}
        />
      </Container>
    </SidebarLayout>
  )
}
