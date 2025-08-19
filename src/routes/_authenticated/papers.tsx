import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import { AddCabinetPaperDialog, SearchBar, SidebarLayout } from '@/components'

export const Route = createFileRoute('/_authenticated/papers')({
  component: cabinetPaperPage,
})

function cabinetPaperPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const theme = useTheme()

  const filterOptions = ['None', 'By Category', 'By Status', 'By Date']

  const handleChangeFilter = (event: any) => {
    setSelectedFilter(event.target.value)
  }

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false)
  }

  const handleSubmitPaper = (paperData: any) => {
    console.log('New cabinet paper submitted:', paperData)
    // Here you would typically send the data to your backend
  }

  interface CabinetPaper {
    id: string
    title: string
    status: 'Approved' | 'Submitted' | 'Considered'
    category: string
    submissionDate: string
  }
  const cabinetPapers: Array<CabinetPaper> = [
    {
      id: 'CP-2025-015',
      title: 'Policy on University Staff International Training Programs',
      status: 'Approved',
      category: 'Policy',
      submissionDate: 'May 10, 2025',
    },
    {
      id: 'CP-2025-016',
      title: 'Construction of New Engineering Faculty Building',
      status: 'Submitted',
      category: 'Infrastructure',
      submissionDate: 'June 20, 2025',
    },
    {
      id: 'CP-2025-017',
      title: 'Annual Budget Allocation for Research Grants',
      status: 'Considered',
      category: 'Financial',
      submissionDate: 'June 25, 2025',
    },
    {
      id: 'CP-2025-018',
      title: 'Revisions to Primary School Curriculum Framework',
      status: 'Submitted',
      category: 'Curriculum',
      submissionDate: 'July 01, 2025',
    },
    {
      id: 'CP-2025-019',
      title: 'Proposal for Digital Learning Platform Implementation',
      status: 'Approved',
      category: 'Technology',
      submissionDate: 'July 05, 2025',
    },
    {
      id: 'CP-2025-020',
      title: 'Development of National Sports Academy Facilities',
      status: 'Submitted',
      category: 'Sports',
      submissionDate: 'July 10, 2025',
    },
  ]

  // status badge colors
  const getStatusColor = (status: CabinetPaper['status']) => {
    switch (status) {
      case 'Approved':
        return '#2E7D32'
      case 'Submitted':
        return '#F57F17'
      case 'Considered':
        return '#1565C0'
      default:
        return theme.palette.grey[700]
    }
  }

  const getStatusTextColor = (status: CabinetPaper['status']) => {
    switch (status) {
      case 'Approved':
        return 'white'
      case 'Submitted':
        return 'white'
      case 'Considered':
        return 'white'
      default:
        return 'white'
    }
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 2,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              fontWeight: 'bold',
            }}
          >
            Cabinet Papers
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Upload New Paper
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit">
              Dashboard
            </Link>
            <Link underline="hover" color="inherit">
              Cabinet Papers
            </Link>
            <Typography color="text.primary">All Papers</Typography>
          </Breadcrumbs>
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
                <SearchBar placeholder="Search by title or ID..." />
              </Box>
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="filter-select-label">
                  Filter by Options
                </InputLabel>
                <Select
                  labelId="filter-select-label"
                  value={selectedFilter}
                  label="Filter by Options"
                  onChange={handleChangeFilter}
                  input={<OutlinedInput label="Filters" />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250,
                      },
                    },
                  }}
                  IconComponent={FilterListIcon}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    '& .MuiSelect-select': {
                      py: 1.5,
                    },
                  }}
                >
                  {filterOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mt: 3,
          }}
        >
          {cabinetPapers.map((paper) => (
            <Paper
              key={paper.id}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  elevation: 8,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)',
                  border: '2px solid #1976d2',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {paper.id}
                </Typography>
                <Chip
                  label={paper.status}
                  size="small"
                  sx={{
                    color: getStatusTextColor(paper.status),
                    bgcolor: getStatusColor(paper.status),
                    fontWeight: 'bold',
                    borderRadius: 4,
                    px: 1,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" component="h5" fontWeight="bold">
                  {paper.title}
                </Typography>
                <Box>
                  <Button
                    sx={{
                      color: 'white',
                      bgcolor: '#01579b',
                      borderRadius: 4,
                      minHeight: 28,
                      fontSize: '0.75rem',
                      px: 1.5,
                      py: 0.5,
                      '&:hover': {
                        bgcolor: '#42a5f5',
                      },
                    }}
                    variant="contained"
                    size="small"
                  >
                    Read more
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <Chip
                  label={paper.category}
                  size="small"
                  variant="outlined"
                  sx={{
                    // bgcolor: '#E1BEE7',
                    color: '#4898b5',
                    fontWeight: 'medium',
                    borderRadius: 2,
                    px: 1,
                    border: '1px solidrgb(25, 194, 180)',
                    '&:hover': {
                      bgcolor: '#F3E5F5',
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Submitted: {paper.submissionDate}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 6,
            mb: 2,
          }}
        >
          <Stack spacing={2}>
            <Pagination
              count={8}
              page={page}
              onChange={handleChange}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  minWidth: '40px',
                  height: '40px',
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: '#212121',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                },
              }}
            />
          </Stack>
        </Box>

        {/* Add Cabinet Paper Dialog */}
        <AddCabinetPaperDialog
          open={isAddDialogOpen}
          onClose={handleCloseAddDialog}
          onSubmit={handleSubmitPaper}
        />
      </Container>
    </SidebarLayout>
  )
}
