import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import type { CabinetPaper } from '@/api'
import { getCabinetPapers } from '@/api'
import {
  AddCabinetPaperDialog,
  PaginationControls,
  SidebarLayout,
} from '@/components'
import {
  CabinetPaperCard,
  CabinetPaperSearchBar,
} from '@/components/cabinet-paper'

const cabinetPaperSearchSchema = z.object({
  query: z.string().optional(),
  page: z.number().optional().catch(undefined),
  pageSize: z.number().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/cabinet-papers/')({
  component: CabinetPapersPage,
  validateSearch: cabinetPaperSearchSchema,
})

function CabinetPapersPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const searchParams = Route.useSearch()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // TanStack Query for fetching cabinet papers
  const {
    data: papersResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      'cabinet-papers',
      {
        ...(searchParams.page && { page: searchParams.page - 1 }),
        ...(searchParams.pageSize && { pageSize: searchParams.pageSize }),
      },
    ],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        { page?: number; pageSize?: number },
      ]
      return getCabinetPapers(params)
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const papers = papersResponse?.data || []
  const pagination = papersResponse?.pagination

  // Filter papers based on search query
  const filteredPapers = searchParams.query
    ? papers.filter((paper) => {
        const q = searchParams.query!.toLowerCase()
        return (
          paper.subject.toLowerCase().includes(q) ||
          paper.referenceId.toLowerCase().includes(q) ||
          paper.category.name.toLowerCase().includes(q) ||
          paper.summary?.toLowerCase().includes(q)
        )
      })
    : papers

  const handleSearch = (query: string) => {
    navigate({
      to: '/cabinet-papers',
      search: {
        ...searchParams,
        query: query || undefined,
        page: undefined,
      },
    })
  }

  const handleClearFilters = () => {
    navigate({
      to: '/cabinet-papers',
    })
  }

  const handlePageChange = (newPage?: number) => {
    navigate({
      to: '/cabinet-papers',
      search: {
        ...searchParams,
        page: newPage,
      },
    })
  }

  const handlePageSizeChange = (newPageSize?: number) => {
    navigate({
      to: '/cabinet-papers',
      search: {
        ...searchParams,
        page: undefined,
        pageSize: newPageSize,
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DRAFT':
        return theme.palette.grey[500]
      case 'SUBMITTED':
        return theme.palette.info.main
      case 'UNDER_REVIEW':
        return theme.palette.warning.main
      case 'APPROVED':
        return theme.palette.success.main
      case 'REJECTED':
        return theme.palette.error.main
      default:
        return theme.palette.grey[500]
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main,
    ]
    const hash = (categoryName || '')
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
                  Cabinet Papers
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: { xs: 2, sm: 0 } }}
                >
                  Manage and track all cabinet paper submissions
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: '100%', sm: 'auto' },
                  py: 1.5,
                  px: 3,
                }}
              >
                Add New Paper
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Search Bar */}
        <Fade in timeout={1000}>
          <div>
            <CabinetPaperSearchBar
              searchQuery={searchParams.query || ''}
              onSearch={handleSearch}
              onClear={handleClearFilters}
            />
          </div>
        </Fade>

        {/* Cabinet Papers List */}
        <Stack spacing={3} sx={{ mb: 3 }}>
          {(() => {
            if (isLoading) {
              return <LoadingSkeletons />
            } else if (filteredPapers.length === 0) {
              return (
                <NoPapersCard
                  hasSearchQuery={!!searchParams.query}
                  handleClearFilters={handleClearFilters}
                />
              )
            } else {
              return filteredPapers.map((paper, index) => (
                <CabinetPaperCard
                  key={paper.id}
                  paper={paper}
                  index={index}
                  onCardClick={(id) =>
                    navigate({ to: `/cabinet-papers/${id}` })
                  }
                  formatTimeAgo={formatTimeAgo}
                  getStatusColor={getStatusColor}
                  getCategoryColor={(cat) => getCategoryColor(cat)}
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
        {!isLoading && filteredPapers.length > 0 && pagination && (
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

      {/* Add Cabinet Paper Dialog */}
      <AddCabinetPaperDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
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

interface NoPapersCardProps {
  readonly hasSearchQuery: boolean
  readonly handleClearFilters: () => void
}

function NoPapersCard({
  hasSearchQuery,
  handleClearFilters,
}: NoPapersCardProps) {
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
        <FolderOpenIcon
          sx={{
            fontSize: 64,
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.primary.light
                : theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {hasSearchQuery ? 'No papers found' : 'No cabinet papers yet'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {hasSearchQuery
            ? 'No papers match your search criteria. Try adjusting your search.'
            : 'Get started by adding your first cabinet paper.'}
        </Typography>
        {hasSearchQuery && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Clear Search
          </Button>
        )}
      </Paper>
    </Fade>
  )
}
