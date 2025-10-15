import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Division } from '@/api'
import {
  AddButton,
  DeleteConfirmationBox,
  DivisionDialog,
  PaginationControls,
  SearchBar,
  SidebarLayout,
} from '@/components'
import { deleteDivision, getDivisions } from '@/api'

export const Route = createFileRoute('/_authenticated/divisions')({
  component: DivisionPage,
})

function DivisionPage() {
  const theme = useTheme()
  const [isDivisionDialogOpen, setIsDivisionDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [editingDivision, setEditingDivision] = useState<Division | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [divisionToDelete, setDivisionToDelete] = useState<Division | null>(
    null,
  )
  const queryClient = useQueryClient()

  // React Query to fetch divisions with search and pagination
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['divisions', query, page, pageSize],
    queryFn: () => getDivisions({ query, page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  const divisions = response?.data ?? []
  const pagination = response?.pagination

  // Mutation for deleting divisions
  const deleteDivisionMutation = useMutation({
    mutationFn: deleteDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
      setDeleteDialogOpen(false)
      setDivisionToDelete(null)
    },
    onError: (e) => {
      console.error('Failed to delete division:', e)
    },
  })

  const handleRefresh = () => {
    refetch()
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(0) // Reset to first page on search
  }

  const handlePageChange = (newPage?: number) => {
    if (newPage !== undefined) {
      setPage(newPage - 1) // Convert to 0-indexed
    }
  }

  const handlePageSizeChange = (newPageSize?: number) => {
    if (newPageSize !== undefined) {
      setPageSize(newPageSize)
      setPage(0) // Reset to first page when changing page size
    }
  }

  const handleOpenDivisionDialog = (division?: Division) => {
    setEditingDivision(division || null)
    setIsDivisionDialogOpen(true)
  }

  const handleCloseDivisionDialog = () => {
    setIsDivisionDialogOpen(false)
    setEditingDivision(null)
  }

  const handleDeleteDivision = (division: Division) => {
    setDivisionToDelete(division)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteDivision = async () => {
    if (!divisionToDelete) return

    try {
      await deleteDivisionMutation.mutateAsync(String(divisionToDelete.id))
    } catch (e) {
      console.error('Error deleting division:', e)
    }
  }

  const cancelDeleteDivision = () => {
    setDeleteDialogOpen(false)
    setDivisionToDelete(null)
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            maxWidth: '1300px',
            mx: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Divisions
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
              }}
            >
              View and manage divisions within your organization.
            </Typography>
          </Box>
          <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>
            <AddButton
              label="Add new Division"
              tooltip="Add a new division"
              onClick={() => handleOpenDivisionDialog()}
            />
          </Box>
        </Box>
        <Paper
          elevation={2}
          sx={{
            maxWidth: '1300px',
            mx: 'auto',
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box>
                <SearchBar
                  placeholder="Search divisions by name or description..."
                  value={query}
                  onChange={setQuery}
                  onSearch={handleSearch}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {isError && (
          <Alert
            severity="error"
            sx={{ maxWidth: '1300px', mx: 'auto', mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            Failed to load divisions.{' '}
            {error instanceof Error ? error.message : 'Please try again.'}
          </Alert>
        )}

        {/* Delete Division Error Alert */}
        {deleteDivisionMutation.isError && (
          <Alert
            severity="error"
            sx={{ maxWidth: '1300px', mx: 'auto', mb: 2 }}
            onClose={() => deleteDivisionMutation.reset()}
          >
            Failed to delete division.{' '}
            {deleteDivisionMutation.error instanceof Error
              ? deleteDivisionMutation.error.message
              : 'Please try again.'}
          </Alert>
        )}

        {/* Loading or Table */}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
              maxWidth: '1300px',
              mx: 'auto',
            }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : (
          <Paper
            elevation={3}
            sx={{
              maxWidth: '1300px',
              mx: 'auto',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 0,
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.grey[100],
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[400],
                  borderRadius: 4,
                },
              }}
            >
              <Table
                sx={{ minWidth: { xs: 800, sm: 650 } }}
                aria-label="divisions table"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? theme.palette.grey[800]
                          : theme.palette.grey[100],
                    }}
                  >
                    <TableCell sx={{ minWidth: 200 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Division Name
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', md: 'table-cell' },
                        minWidth: 300,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        Description
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 100 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {divisions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No divisions found. Click "Add new Division" to create
                          one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    divisions.map((division: Division) => (
                      <TableRow
                        key={division.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ minWidth: 200 }}>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight="medium"
                              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                              {division.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                display: { xs: 'block', md: 'none' },
                                lineHeight: 1.5,
                                mt: 0.5,
                              }}
                            >
                              {division.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ display: { xs: 'none', md: 'table-cell' } }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                            {division.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDivisionDialog(division)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteDivision(division)}
                            disabled={deleteDivisionMutation.isPending}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <Divider />
                </TableBody>
              </Table>
            </TableContainer>

            {pagination && (
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </Paper>
        )}

        {/* Division Dialog */}
        <DivisionDialog
          open={isDivisionDialogOpen}
          onClose={handleCloseDivisionDialog}
          division={editingDivision}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationBox
          open={deleteDialogOpen}
          onClose={cancelDeleteDivision}
          onConfirm={confirmDeleteDivision}
          title="Delete Division"
          itemName={divisionToDelete ? `${divisionToDelete.name}` : undefined}
          loading={deleteDivisionMutation.isPending}
        />
      </Container>
    </SidebarLayout>
  )
}
