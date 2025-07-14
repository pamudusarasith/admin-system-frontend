import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material'
import {
  Filters,
  LetterCard,
  SidebarLayout,
  StatusCardsGrid,
} from '@/components'

export const Route = createFileRoute('/letters/')({
  component: LettersPage,
})

interface LetterSummary {
  id: string
  referenceNumber: string
  subject: string
  sender: {
    name: string
    organization: string
  }
  receivedDate: string
  priority: 'Normal' | 'Urgent' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed' | 'Returned'
  currentAssignee: {
    name: string
    division: string
  }
  category: string
  confidentialityLevel: 'Public' | 'Confidential' | 'Restricted' | 'Secret'
  daysOpen: number
  hasAttachments: boolean
  replyCount: number
}

// Mock data
const mockLetters: Array<LetterSummary> = [
  {
    id: '1',
    referenceNumber: 'MIN/EDU/2024/001',
    subject:
      'Request for Educational Policy Review and Implementation Guidelines',
    sender: {
      name: 'Dr. Priyanka Wickramasinghe',
      organization: 'University of Colombo',
    },
    receivedDate: '2024-01-15T09:30:00Z',
    priority: 'High',
    status: 'In Progress',
    currentAssignee: {
      name: 'Nimal Perera',
      division: 'Policy Development Division',
    },
    category: 'Policy Matter',
    confidentialityLevel: 'Confidential',
    daysOpen: 12,
    hasAttachments: true,
    replyCount: 3,
  },
  {
    id: '2',
    referenceNumber: 'MIN/EDU/2024/002',
    subject: 'Budget Allocation for Infrastructure Development Projects',
    sender: {
      name: 'Eng. Saman Kumara',
      organization: 'Provincial Education Office',
    },
    receivedDate: '2024-01-18T14:20:00Z',
    priority: 'Urgent',
    status: 'Pending',
    currentAssignee: {
      name: 'Kamala Silva',
      division: 'Finance Division',
    },
    category: 'Financial Matter',
    confidentialityLevel: 'Restricted',
    daysOpen: 9,
    hasAttachments: true,
    replyCount: 1,
  },
  {
    id: '3',
    referenceNumber: 'MIN/EDU/2024/003',
    subject: 'Teacher Training Program Approval Request',
    sender: {
      name: 'Ms. Dilani Fernando',
      organization: 'National Institute of Education',
    },
    receivedDate: '2024-01-20T11:45:00Z',
    priority: 'Normal',
    status: 'Completed',
    currentAssignee: {
      name: 'Rohana Jayasinghe',
      division: 'Human Resources Division',
    },
    category: 'Training & Development',
    confidentialityLevel: 'Public',
    daysOpen: 7,
    hasAttachments: false,
    replyCount: 5,
  },
  {
    id: '4',
    referenceNumber: 'MIN/EDU/2024/004',
    subject: 'Legal Opinion on New Education Act Amendment',
    sender: {
      name: 'Attorney Upul Ratnayake',
      organization: "Attorney General's Department",
    },
    receivedDate: '2024-01-22T16:15:00Z',
    priority: 'High',
    status: 'In Progress',
    currentAssignee: {
      name: 'Anura Mendis',
      division: 'Legal Division',
    },
    category: 'Legal Matter',
    confidentialityLevel: 'Secret',
    daysOpen: 5,
    hasAttachments: true,
    replyCount: 2,
  },
  {
    id: '5',
    referenceNumber: 'MIN/EDU/2024/005',
    subject: 'International Conference Participation Request',
    sender: {
      name: 'Prof. Chandrika Perera',
      organization: 'University of Peradeniya',
    },
    receivedDate: '2024-01-25T10:30:00Z',
    priority: 'Normal',
    status: 'Returned',
    currentAssignee: {
      name: 'Sunil Bandara',
      division: 'International Relations Division',
    },
    category: 'International Affairs',
    confidentialityLevel: 'Public',
    daysOpen: 2,
    hasAttachments: false,
    replyCount: 1,
  },
]

function LettersPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [letters] = useState<Array<LetterSummary>>(mockLetters)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isLoading] = useState(false)

  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || letter.status === statusFilter
    const matchesPriority =
      priorityFilter === 'All' || letter.priority === priorityFilter
    const matchesCategory =
      categoryFilter === 'All' || letter.category === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

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
      case 'Pending':
        return theme.palette.warning.main
      case 'Completed':
        return theme.palette.success.main
      case 'In Progress':
        return theme.palette.info.main
      case 'Returned':
        return theme.palette.error.main
      default:
        return theme.palette.grey[500]
    }
  }

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case 'Secret':
        return theme.palette.error.main
      case 'Restricted':
        return theme.palette.warning.main
      case 'Confidential':
        return theme.palette.info.main
      default:
        return theme.palette.grey[600]
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedLetters = filteredLetters.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const statusCounts = {
    All: letters.length,
    Pending: letters.filter((l) => l.status === 'Pending').length,
    'In Progress': letters.filter((l) => l.status === 'In Progress').length,
    Completed: letters.filter((l) => l.status === 'Completed').length,
    Returned: letters.filter((l) => l.status === 'Returned').length,
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 0 },
                mb: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant={isMobile ? 'h5' : 'h4'}
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  Letter Management
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: { xs: 2, sm: 0 } }}
                >
                  Track and manage all incoming and outgoing correspondence
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => console.log('Register new letter')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  px: 3,
                }}
              >
                Register Letter
              </Button>
            </Box>

            {/* Enhanced Status Overview Cards */}
            <StatusCardsGrid
              statusCounts={statusCounts}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              getStatusColor={getStatusColor}
            />
          </Box>
        </Fade>

        {/* Enhanced Filters */}
        <Fade in timeout={1000}>
          <div>
            <Filters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              categoryFilter={categoryFilter}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onPriorityFilterChange={setPriorityFilter}
              onCategoryFilterChange={setCategoryFilter}
              onClearAllFilters={() => {
                setSearchTerm('')
                setStatusFilter('All')
                setPriorityFilter('All')
                setCategoryFilter('All')
              }}
            />
          </div>
        </Fade>

        {/* Enhanced Letters Cards */}
        <Stack spacing={3} sx={{ mb: 3 }}>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}
                  >
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="40%" height={24} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                    <Box>
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={24}
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : paginatedLetters.length === 0 ? (
            <Fade in timeout={800}>
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: theme.palette.grey[50],
                }}
              >
                <InboxIcon
                  sx={{ fontSize: 64, color: 'primary.light', mb: 2 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  No letters found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No letters match your current filter criteria. Try adjusting
                  your search or filters.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('All')
                    setPriorityFilter('All')
                    setCategoryFilter('All')
                  }}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            </Fade>
          ) : (
            paginatedLetters.map((letter, index) => (
              <LetterCard
                key={letter.id}
                letter={letter}
                index={index}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                getConfidentialityColor={getConfidentialityColor}
                formatDate={formatDate}
                formatTimeAgo={formatTimeAgo}
                onCardClick={(id) =>
                  window.open(`/letters/thread/${id}`, '_blank')
                }
              />
            ))
          )}
        </Stack>

        {/* Enhanced Pagination */}
        {filteredLetters.length > itemsPerPage && (
          <Fade in timeout={1200}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mt: 4,
                p: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredLetters.length)} of{' '}
                {filteredLetters.length} letters
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                size={isMobile ? 'medium' : 'large'}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 500,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Fade>
        )}

        {/* Quick Stats Summary */}
        <Fade in timeout={1400}>
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: theme.palette.grey[50],
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}
            >
              Quick Statistics
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(4, 1fr)',
                },
                gap: 3,
                justifyItems: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {letters.filter((l) => l.daysOpen > 7).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overdue Items
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  color="success.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {Math.round(
                    (letters.filter((l) => l.status === 'Completed').length /
                      letters.length) *
                      100,
                  )}
                  %
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completion Rate
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  color="warning.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {
                    letters.filter(
                      (l) => l.priority === 'Urgent' || l.priority === 'High',
                    ).length
                  }
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  High Priority
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h4"
                  color="info.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {Math.round(
                    letters.reduce((sum, l) => sum + l.daysOpen, 0) /
                      letters.length,
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg. Days Open
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </SidebarLayout>
  )
}
