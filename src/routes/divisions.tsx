import {
  AddButton,
  SearchBar,
  SidebarLayout,
  AddDivisionDialog,
} from '@/components'
import {
  Box,
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
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDivisions, createDivision, type CreateDivisionRequest } from '@/api'

export const Route = createFileRoute('/divisions')({
  component: DivisionPage,
})

interface Division {
  id: string
  name: string
  description: string
}

function DivisionPage() {
  const theme = useTheme()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  // React Query to fetch divisions
  const {
    data: divisions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['divisions'],
    queryFn: getDivisions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Mutation for creating divisions
  const createDivisionMutation = useMutation({
    mutationFn: createDivision,
    onSuccess: () => {
      // Invalidate and refetch divisions data
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
      setIsAddDialogOpen(false)
    },
    onError: (error) => {
      console.error('Failed to create division:', error)
    },
  })

  // Filter divisions based on search term
  const filteredDivisions = divisions.filter(
    (division: Division) =>
      division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      division.id.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRefresh = () => {
    refetch()
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  const handleSubmitDivision = async (divisionData: any) => {
    console.log('New division submitted:', divisionData)

    try {
      // Map form data to API request format
      const createRequest: CreateDivisionRequest = {
        id: divisionData.divisionID,
        name: divisionData.divisionName || divisionData.name,
        description: divisionData.description,
      }

      await createDivisionMutation.mutateAsync(createRequest)
      // The onSuccess callback will handle closing the dialog and refetching data
    } catch (error) {
      console.error('Error creating division:', error)
      // The onError callback will handle error logging
    }
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
              onClick={handleOpenAddDialog}
              disabled={createDivisionMutation.isPending}
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
                  placeholder="Search divisions by name, description, or ID..."
                  value={searchTerm}
                  onChange={setSearchTerm}
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

        {/* Create Division Error Alert */}
        {createDivisionMutation.isError && (
          <Alert
            severity="error"
            sx={{ maxWidth: '1300px', mx: 'auto', mb: 2 }}
            onClose={() => createDivisionMutation.reset()}
          >
            Failed to create division.{' '}
            {createDivisionMutation.error instanceof Error
              ? createDivisionMutation.error.message
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
                    <TableCell sx={{ minWidth: 120 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Division ID
                        </Typography>
                      </Box>
                    </TableCell>
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
                  {filteredDivisions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No divisions found. Click "Add new Division" to create
                          one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDivisions.map((division: Division) => (
                      <TableRow
                        key={division.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ minWidth: 120 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {division.id}
                          </Typography>
                        </TableCell>
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
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <Divider />
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                p: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Rows per page: 5
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    ml: { xs: 1, sm: 2 },
                    mr: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  1-{filteredDivisions.length} of {filteredDivisions.length}
                </Typography>
                <IconButton size="small" disabled>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton size="small" disabled>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Add Division Dialog */}
        <AddDivisionDialog
          open={isAddDialogOpen}
          onClose={handleCloseAddDialog}
          onSubmit={handleSubmitDivision}
        />
      </Container>
    </SidebarLayout>
  )
}
