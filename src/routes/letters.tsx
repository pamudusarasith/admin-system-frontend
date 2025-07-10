import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Flag as FlagIcon,
} from '@mui/icons-material'
import { AddButton, SearchBar, SidebarLayout } from '@/components'

export const Route = createFileRoute('/letters')({
  component: Letters,
})

// Mock data for demonstration
const mockLetters = [
  {
    id: 1,
    title: 'Budget Approval Request',
    receivingDate: '2024-12-15',
    priority: 'High',
    category: 'Finance',
    content:
      'This letter is regarding the budget approval for the upcoming fiscal year. We need to review and approve the proposed budget allocations for various departments and ensure compliance with organizational guidelines.',
  },
  {
    id: 2,
    title: 'Employee Performance Review',
    receivingDate: '2024-12-10',
    priority: 'Medium',
    category: 'HR',
    content:
      'Annual performance review documentation for employee evaluation. This comprehensive review covers achievements, areas for improvement, and goal setting for the next performance period.',
  },
  {
    id: 3,
    title: 'Vendor Contract Renewal',
    receivingDate: '2024-12-08',
    priority: 'High',
    category: 'Procurement',
    content:
      'Contract renewal request from our primary vendor for IT services. The contract includes updated terms, pricing structure, and service level agreements for the next three years.',
  },
  {
    id: 4,
    title: 'Policy Update Notification',
    receivingDate: '2024-12-05',
    priority: 'Low',
    category: 'General',
    content:
      'Notification about updates to company policies regarding remote work arrangements. These changes reflect new guidelines and best practices for hybrid work environments.',
  },
  {
    id: 5,
    title: 'Training Program Proposal',
    receivingDate: '2024-12-03',
    priority: 'Medium',
    category: 'Training',
    content:
      'Proposal for implementing a comprehensive training program for new employees. The program includes onboarding, skill development, and mentorship components.',
  },
  {
    id: 6,
    title: 'Security Audit Report',
    receivingDate: '2024-11-28',
    priority: 'High',
    category: 'Security',
    content:
      'Detailed security audit report highlighting vulnerabilities and recommended improvements. This report covers network security, data protection, and access control measures.',
  },
]

function Letters() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return theme.palette.error.main
      case 'medium':
        return theme.palette.warning.main
      case 'low':
        return theme.palette.success.main
      default:
        return theme.palette.grey[500]
    }
  }

  // Filter letters based on search and filters
  const filteredLetters = mockLetters.filter((letter) => {
    const matchesSearch =
      letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDateFilter =
      dateFilter === 'all' ||
      (() => {
        const letterDate = new Date(letter.receivingDate)
        const now = new Date()
        switch (dateFilter) {
          case 'today':
            return letterDate.toDateString() === now.toDateString()
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return letterDate >= weekAgo
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return letterDate >= monthAgo
          }
          default:
            return true
        }
      })()

    const matchesPriority =
      priorityFilter === 'all' ||
      letter.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesCategory =
      categoryFilter === 'all' ||
      letter.category.toLowerCase() === categoryFilter.toLowerCase()

    return (
      matchesSearch && matchesDateFilter && matchesPriority && matchesCategory
    )
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Letters
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '1.1rem',
            }}
          >
            Manage and review all incoming correspondence
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          }}
        >
          <Stack spacing={3}>
            {/* Search Bar */}
            <Box>
              <SearchBar
                placeholder="Search letters by title, content, or category..."
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
              />
            </Box>

            {/* Filters */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent={{ xs: 'flex-start', md: 'space-between' }}
              sx={{ width: '100%' }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', md: 'center' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterIcon color="action" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Filters:
                  </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Date</InputLabel>
                  <Select
                    value={dateFilter}
                    label="Date"
                    onChange={(e) => setDateFilter(e.target.value)}
                    startAdornment={
                      <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                    }
                  >
                    <MenuItem value="all">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    startAdornment={
                      <FlagIcon sx={{ mr: 1, color: 'action.active' }} />
                    }
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="procurement">Procurement</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="training">Training</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {/* Add Letter Button - Right Side */}
              <AddButton
                label="Add Letter"
                onClick={() => console.log('Clicked')}
                tooltip="Add a new letter"
                size="small"
                sx={{
                  alignSelf: { xs: 'flex-start', md: 'center' },
                  mt: { xs: 2, md: 0 },
                }}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredLetters.length} of {mockLetters.length} letters
          </Typography>
        </Box>

        {/* Letters Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            // Ensure all cards in a row have the same height
            gridAutoRows: 'minmax(380px, auto)',
          }}
        >
          {filteredLetters.map((letter) => (
            <Card
              key={letter.id}
              elevation={4}
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${theme.palette.primary.main}15`,
                },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Letter Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {letter.title}
                </Typography>

                {/* Date and Priority */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <CalendarIcon sx={{ fontSize: 16 }} />
                    {formatDate(letter.receivingDate)}
                  </Typography>

                  <Chip
                    label={letter.priority}
                    size="small"
                    sx={{
                      backgroundColor: `${getPriorityColor(letter.priority)}20`,
                      color: getPriorityColor(letter.priority),
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Stack>

                {/* Category */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={letter.category}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                {/* Content Preview */}
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {letter.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* No Results */}
        {filteredLetters.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              No letters found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}
      </Container>
    </SidebarLayout>
  )
}
