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
} from '@mui/material'
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material'
import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

export const Route = createFileRoute('/divisions')({
  component: divisionpage,
})

interface Division {
  id: string
  name: string
  description: string
}

function createDivisionData(
  id: string,
  name: string,
  description: string,
): Division {
  return { id, name, description }
}

const divisions = [
  createDivisionData(
    '1',
    'Policy Development Division',
    'Responsible for developing and reviewing educational policies and frameworks',
  ),
  createDivisionData(
    '2',
    'Finance Division',
    'Handles budget planning, financial management, and resource allocation',
  ),
  createDivisionData(
    '3',
    'Human Resources Division',
    'Manages staff recruitment, training, and development programs',
  ),
  createDivisionData(
    '4',
    'Legal Division',
    'Provides legal advice and handles legislative matters',
  ),
  createDivisionData(
    '5',
    'Information Technology Division',
    'Manages IT infrastructure, systems, and digital transformation',
  ),
  createDivisionData(
    '6',
    'Planning & Monitoring Division',
    'Oversees strategic planning, monitoring, and evaluation of programs',
  ),
]

function divisionpage() {
  const theme = useTheme()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Use divisions array directly for now (can be filtered later)
  const filteredDivisions = divisions

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  const handleSubmitDivision = (divisionData: any) => {
    console.log('New division submitted:', divisionData)
    // Here you would typically send the data to your backend
    // You could also update the local state to add the new division to the list
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
                  placeholder="Search divisions by name, description, or manager..."
                  // value={searchTerm}
                  // onChange={setSearchTerm}
                  // onSearch={handleSearch}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
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
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No divisions found. Click "Add new Division" to create
                        one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDivisions.map((division) => (
                    <TableRow
                      key={division.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
