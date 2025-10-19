import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
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
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GetLettersParams } from '@/api'
import type { LetterSearchParams } from '@/schemas'
import {
  AddLetterDialog,
  LetterCard,
  LetterSearchBar,
  PaginationControls,
  SidebarLayout,
  StatusCardsGrid,
} from '@/components'
import { getLetters } from '@/api'
import { Permission as P, useAuth } from '@/core'
import { letterSearchParamsSchema } from '@/schemas'

export const Route = createFileRoute('/_authenticated/letters/')({
  beforeLoad: ({ context }) => {
    if (
      !context.auth.hasAnyAuthority([
        P.letterAllRead,
        P.letterUnassignedRead,
        P.letterDivisionRead,
        P.letterOwnManage,
      ])
    ) {
      throw redirect({ to: '/403' })
    }
  },
  component: LettersPage,
  validateSearch: letterSearchParamsSchema,
})

function LettersPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { hasAuthority } = useAuth()
  const canCreate = hasAuthority(P.letterCreate)

  const searchParams = Route.useSearch()
  const [isAddLetterDialogOpen, setIsAddLetterDialogOpen] = useState(false)

  // TanStack Query for fetching letters
  const {
    data: lettersResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      'letters',
      {
        ...(searchParams.page && { page: searchParams.page - 1 }), // API uses 0-based pagination
        ...(searchParams.pageSize && { pageSize: searchParams.pageSize }),
        ...(searchParams.query && { query: searchParams.query }),
        ...(searchParams.status && { status: searchParams.status }),
        ...(searchParams.priority && { priority: searchParams.priority }),
        ...(searchParams.modeOfArrival && {
          modeOfArrival: searchParams.modeOfArrival,
        }),
        ...(searchParams.sender && { sender: searchParams.sender }),
        ...(searchParams.receiver && { receiver: searchParams.receiver }),
        ...(searchParams.assignedUser && {
          assignedUser: searchParams.assignedUser,
        }),
        ...(searchParams.assignedDivision && {
          assignedDivision: searchParams.assignedDivision,
        }),
        ...(searchParams.sentDateFrom && {
          sentDateFrom: searchParams.sentDateFrom,
        }),
        ...(searchParams.sentDateTo && { sentDateTo: searchParams.sentDateTo }),
        ...(searchParams.receivedDateFrom && {
          receivedDateFrom: searchParams.receivedDateFrom,
        }),
        ...(searchParams.receivedDateTo && {
          receivedDateTo: searchParams.receivedDateTo,
        }),
      },
    ],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, GetLettersParams]
      return getLetters(params)
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Transform API response to component format
  const letters = lettersResponse?.data || []
  const pagination = lettersResponse?.pagination

  const handleSearch = (newSearchParams: LetterSearchParams) => {
    navigate({
      to: '/letters',
      search: {
        ...newSearchParams,
        page: undefined, // Reset to first page on new search
      },
    })
  }

  const handlePageChange = (newPage?: number) => {
    navigate({
      to: '/letters',
      search: {
        ...searchParams,
        page: newPage,
      },
    })
  }

  const handlePageSizeChange = (newPageSize?: number) => {
    navigate({
      to: '/letters',
      search: {
        ...searchParams,
        page: undefined,
        pageSize: newPageSize,
      },
    })
  }

  const handleClearFilters = () => {
    navigate({
      to: '/letters',
    })
  }

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

  // Calculate status counts from actual data
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
              {canCreate && (
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
              )}
            </Box>

            {/* Enhanced Status Overview Cards */}
            {/* <StatusCardsGrid
              statusCounts={statusCounts}
              statusFilter={''}
              onStatusFilterChange={() => {}}
              getStatusColor={getStatusColor}
            /> */}
          </Box>
        </Fade>

        {/* Enhanced Search and Filters */}
        <Fade in timeout={1000}>
          <div>
            <LetterSearchBar
              searchParams={searchParams}
              onSearch={handleSearch}
              onClear={handleClearFilters}
            />
          </div>
        </Fade>

        {/* Enhanced Letters Cards */}
        <Stack spacing={3} sx={{ mb: 3 }}>
          {(() => {
            if (isLoading) {
              return <LoadingSkeletons />
            } else if (letters.length === 0) {
              return <NoLettersCard handleClearFilters={handleClearFilters} />
            } else {
              return letters.map((letter, index) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  index={index}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  formatTimeAgo={formatTimeAgo}
                  onCardClick={(id) => navigate({ to: `/letters/${id}` })}
                />
              ))
            }
          })()}

          {/* Loading indicator for background fetching */}
          {isFetching && !isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Updating...
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Pagination */}
        {!isLoading && letters.length > 0 && pagination && (
          <Fade in timeout={1200}>
            <Box
              sx={{
                mt: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 25, 50, 100]}
                showPageSize={true}
              />
            </Box>
          </Fade>
        )}
      </Container>
      {/* Add Letter Dialog */}
      <AddLetterDialog
        open={isAddLetterDialogOpen}
        onClose={() => setIsAddLetterDialogOpen(false)}
      />
    </SidebarLayout>
  )
}

function LoadingSkeletons() {
  const skeletonKeys = ['skel-1', 'skel-2', 'skel-3']
  return skeletonKeys.map((key) => (
    <Card key={key} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
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
}

interface NoLettersCardProps {
  readonly handleClearFilters: () => void
}

function NoLettersCard({ handleClearFilters }: NoLettersCardProps) {
  const theme = useTheme()
  return (
    <Fade in timeout={800}>
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <InboxIcon
          sx={{
            fontSize: 64,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          No letters found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No letters match your current filter criteria. Try adjusting your
          search or filters.
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
  )
}
