import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Container, useTheme } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import { deleteCabinetPaper, getCabinetPaperById } from '@/api/cabinet-papers'
import {
  AddCabinetPaperDialog,
  CabinetPaperActionMenu,
  CabinetPaperDetailsGrid,
  CabinetPaperHeader,
  ConfirmationDialog,
  ErrorMessage,
  LoadingSpinner,
  SidebarLayout,
  useSnackbar,
} from '@/components'

export const Route = createFileRoute('/_authenticated/cabinet-papers/$paperId')(
  {
    component: CabinetPaperDetailsView,
  },
)

function CabinetPaperDetailsView() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { paperId } = Route.useParams()

  // Fetch cabinet paper details
  const result = useQuery({
    queryKey: ['cabinet-paper', Number(paperId)],
    queryFn: () => getCabinetPaperById(Number(paperId)),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteCabinetPaper(Number(paperId)),
    onSuccess: (response) => {
      // Invalidate cabinet papers list
      queryClient.invalidateQueries({ queryKey: ['cabinet-papers'] })
      const message =
        response.message?.trim() || 'Cabinet paper deleted successfully.'
      showSnackbar({ message, severity: 'success' })
      // Navigate back to cabinet papers list
      globalThis.history.back()
    },
    onError: (err: AxiosError<ApiResponse<any>>) => {
      const message =
        err.response?.data.message?.trim() ||
        'Failed to delete cabinet paper. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const handleDownloadAll = () => {
    const attachments = paper.attachments
    if (!attachments?.length) {
      showSnackbar({
        message: 'No attachments to download',
        severity: 'info',
      })
      return
    }

    // Download each attachment
    for (const attachment of attachments) {
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
    }

    showSnackbar({
      message: `Downloading ${attachments.length} attachment(s)`,
      severity: 'success',
    })
  }

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      DRAFT: theme.palette.grey[500],
      SUBMITTED: theme.palette.info.main,
      UNDER_REVIEW: theme.palette.warning.main,
      APPROVED: theme.palette.success.main,
      REJECTED: theme.palette.error.main,
      ARCHIVED: theme.palette.grey[700],
    }
    return statusColors[status] || theme.palette.grey[500]
  }

  const getCategoryColor = (category: string) => {
    // Generate consistent colors based on category name
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ]
    let hash = 0
    for (let i = 0; i < category.length; i += 1) {
      hash = (category.codePointAt(i) ?? 0) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
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
        message="Error loading cabinet paper details."
      />
    )
  }

  const paper = result.data.data

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <CabinetPaperHeader
          paper={paper}
          onMenuClick={handleMenuClick}
          getStatusColor={getStatusColor}
          getCategoryColor={getCategoryColor}
        />

        <CabinetPaperDetailsGrid
          submittedBy={paper.submittedByUser}
          category={paper.category}
          summary={paper.summary}
          attachments={paper.attachments ?? []}
          createdAt={paper.createdAt}
          updatedAt={paper.updatedAt}
        />

        <CabinetPaperActionMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          paper={paper}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownloadAll={handleDownloadAll}
        />

        <AddCabinetPaperDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          paper={paper}
        />

        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => deleteMutation.mutate()}
          title="Delete Cabinet Paper"
          message={`Are you sure you want to delete "${paper.subject}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="error"
          danger
          loading={deleteMutation.isPending}
        />
      </Container>
    </SidebarLayout>
  )
}
