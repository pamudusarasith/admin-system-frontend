import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
  AddLetterDialog,
  Filters,
  LetterCard,
  SidebarLayout,
  StatusCardsGrid,
} from '@/components'

export const Route = createFileRoute('/letters/')({
  component: LettersPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as string) || 'All',
    }
  },
})

interface LetterSummary {
  id: number
  reference: string
  senderDetails: {
    name: string
    email: string | null
    address: string | null
    phone_number: string | null
  }
  sentDate: string | null
  receivedDate: string
  modeOfArrival:
    | 'REGISTERED_POST'
    | 'UNREGISTERED_POST'
    | 'EMAIL'
    | 'WHATSAPP'
    | 'HAND_DELIVERED'
    | 'FAX'
    | 'OTHER'
  subject: string
  content: string | null
  priority: 'NORMAL' | 'HIGH' | 'URGENT'
  status:
    | 'NEW'
    | 'ASSIGNED_TO_DIVISION'
    | 'PENDING_ACCEPTANCE'
    | 'ASSIGNED_TO_OFFICER'
    | 'RETURNED_FROM_OFFICER'
    | 'RETURNED_FROM_DIVISION'
    | 'CLOSED'
  assignedDivision: string | null
  assignedUser: string | null
  isAcceptedByUser: boolean
  category?: string
  daysOpen?: number
  hasAttachments?: boolean
  replyCount?: number
}

// Mock data
const mockLetters: Array<LetterSummary> = [
  {
    id: 1,
    reference: 'MIN/EDU/2024/001',
    senderDetails: {
      name: 'Dr. Priyanka Wickramasinghe',
      email: 'priyanka.w@colombo.ac.lk',
      address: 'University of Colombo, Colombo 3',
      phone_number: '+94112581835',
    },
    sentDate: '2024-01-14',
    receivedDate: '2024-01-15',
    modeOfArrival: 'REGISTERED_POST',
    subject:
      'Request for Educational Policy Review and Implementation Guidelines',
    content:
      'This letter requests a comprehensive review of current educational policies...',
    priority: 'HIGH',
    status: 'ASSIGNED_TO_OFFICER',
    assignedDivision: 'Policy Development Division',
    assignedUser: 'Nimal Perera',
    isAcceptedByUser: true,
    category: 'Policy Matter',
    daysOpen: 12,
    hasAttachments: true,
    replyCount: 3,
  },
  {
    id: 2,
    reference: 'MIN/EDU/2024/002',
    senderDetails: {
      name: 'Eng. Saman Kumara',
      email: 'saman.k@education.gov.lk',
      address: 'Provincial Education Office, Kandy',
      phone_number: '+94812234567',
    },
    sentDate: '2024-01-17',
    receivedDate: '2024-01-18',
    modeOfArrival: 'EMAIL',
    subject: 'Budget Allocation for Infrastructure Development Projects',
    content:
      'We hereby request budget allocation for the following infrastructure projects...',
    priority: 'URGENT',
    status: 'ASSIGNED_TO_DIVISION',
    assignedDivision: 'Finance Division',
    assignedUser: null,
    isAcceptedByUser: false,
    category: 'Financial Matter',
    daysOpen: 9,
    hasAttachments: true,
    replyCount: 1,
  },
  {
    id: 3,
    reference: 'MIN/EDU/2024/003',
    senderDetails: {
      name: 'Ms. Dilani Fernando',
      email: 'dilani.f@nie.ac.lk',
      address: 'National Institute of Education, Maharagama',
      phone_number: '+94112850301',
    },
    sentDate: '2024-01-19',
    receivedDate: '2024-01-20',
    modeOfArrival: 'HAND_DELIVERED',
    subject: 'Teacher Training Program Approval Request',
    content:
      'This is to request approval for the new teacher training program...',
    priority: 'NORMAL',
    status: 'CLOSED',
    assignedDivision: 'Human Resources Division',
    assignedUser: 'Rohana Jayasinghe',
    isAcceptedByUser: true,
    category: 'Training & Development',
    daysOpen: 7,
    hasAttachments: false,
    replyCount: 5,
  },
  {
    id: 4,
    reference: 'MIN/EDU/2024/004',
    senderDetails: {
      name: 'Attorney Upul Ratnayake',
      email: 'upul.r@attorneygeneral.gov.lk',
      address: "Attorney General's Department, Colombo 12",
      phone_number: '+94112445222',
    },
    sentDate: '2024-01-21',
    receivedDate: '2024-01-22',
    modeOfArrival: 'REGISTERED_POST',
    subject: 'Legal Opinion on New Education Act Amendment',
    content:
      'We provide the following legal opinion regarding the proposed amendment...',
    priority: 'HIGH',
    status: 'PENDING_ACCEPTANCE',
    assignedDivision: 'Legal Division',
    assignedUser: 'Anura Mendis',
    isAcceptedByUser: false,
    category: 'Legal Matter',
    daysOpen: 5,
    hasAttachments: true,
    replyCount: 2,
  },
  {
    id: 5,
    reference: 'MIN/EDU/2024/005',
    senderDetails: {
      name: 'Prof. Chandrika Perera',
      email: 'chandrika.p@pdn.ac.lk',
      address: 'University of Peradeniya, Peradeniya',
      phone_number: '+94812392111',
    },
    sentDate: null,
    receivedDate: '2024-01-25',
    modeOfArrival: 'EMAIL',
    subject: 'International Conference Participation Request',
    content:
      'Request for permission and funding to attend the international education conference...',
    priority: 'NORMAL',
    status: 'NEW',
    assignedDivision: null,
    assignedUser: null,
    isAcceptedByUser: false,
    category: 'International Affairs',
    daysOpen: 2,
    hasAttachments: false,
    replyCount: 0,
  },
]

function LettersPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { status } = Route.useSearch()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [letters] = useState<Array<LetterSummary>>(mockLetters)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(status)
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isLoading] = useState(false)
  const [isAddLetterDialogOpen, setIsAddLetterDialogOpen] = useState(false)

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus)
    if (newStatus === 'All') {
      navigate({ to: '/letters', search: { status: 'All' } })
    } else {
      navigate({ to: '/letters', search: { status: newStatus } })
    }
  }

  const handleClearFilters = () => {
    setStatusFilter('All')
    setPriorityFilter('All')
    setCategoryFilter('All')
    setSearchTerm('')
    navigate({ to: '/letters', search: { status: 'All' } })
  }

  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.senderDetails.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      letter.reference.toLowerCase().includes(searchTerm.toLowerCase())

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
      case 'HIGH':
        return theme.palette.error.main
      case 'URGENT':
        return theme.palette.warning.main
      case 'NORMAL':
      default:
        return theme.palette.success.main
    }
  }

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'NEW':
        return theme.palette.warning.main
      case 'ASSIGNED_TO_DIVISION':
        return theme.palette.primary.main
      case 'PENDING_ACCEPTANCE':
        return theme.palette.info.main
      case 'ASSIGNED_TO_OFFICER':
        return theme.palette.secondary.main
      case 'RETURNED_FROM_OFFICER':
        return theme.palette.error.light
      case 'RETURNED_FROM_DIVISION':
        return theme.palette.error.main
      case 'CLOSED':
        return theme.palette.success.main
      default:
        return theme.palette.grey[500]
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

  const handleAddLetterSubmit = (letterData: any) => {
    // TODO: Implement API call to create new letter
    console.log('New letter data:', letterData)

    // For now, we'll just show a success message
    // In a real application, you would send this data to your backend API
    // and then refresh the letters list or add the new letter to the state

    // Close the dialog
    setIsAddLetterDialogOpen(false)

    // You could also show a success snackbar here
    // setSnackbarMessage('Letter added successfully!')
    // setSnackbarOpen(true)
  }

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const paginatedLetters = filteredLetters.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  const statusCounts = {
    All: letters.length,
    NEW: letters.filter((l) => l.status === 'NEW').length,
    ASSIGNED_TO_DIVISION: letters.filter(
      (l) => l.status === 'ASSIGNED_TO_DIVISION',
    ).length,
    PENDING_ACCEPTANCE: letters.filter((l) => l.status === 'PENDING_ACCEPTANCE')
      .length,
    ASSIGNED_TO_OFFICER: letters.filter(
      (l) => l.status === 'ASSIGNED_TO_OFFICER',
    ).length,
    RETURNED_FROM_OFFICER: letters.filter(
      (l) => l.status === 'RETURNED_FROM_OFFICER',
    ).length,
    RETURNED_FROM_DIVISION: letters.filter(
      (l) => l.status === 'RETURNED_FROM_DIVISION',
    ).length,
    CLOSED: letters.filter((l) => l.status === 'CLOSED').length,
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
                onClick={() => setIsAddLetterDialogOpen(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  px: 3,
                }}
              >
                Add New Letter
              </Button>
            </Box>

            {/* Enhanced Status Overview Cards */}
            <StatusCardsGrid
              statusCounts={statusCounts}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
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
              onStatusFilterChange={handleStatusFilterChange}
              onPriorityFilterChange={setPriorityFilter}
              onCategoryFilterChange={setCategoryFilter}
              onClearAllFilters={handleClearFilters}
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
                  onClick={handleClearFilters}
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
                formatDate={formatDate}
                formatTimeAgo={formatTimeAgo}
                onCardClick={(id) => navigate({ to: `/letters/${id}` })}
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
      </Container>

      {/* Add Letter Dialog */}
      <AddLetterDialog
        open={isAddLetterDialogOpen}
        onClose={() => setIsAddLetterDialogOpen(false)}
        onSubmit={handleAddLetterSubmit}
      />
    </SidebarLayout>
  )
}
