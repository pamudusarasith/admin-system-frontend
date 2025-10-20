import React from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  LinearProgress,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  People as PeopleIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import type { Division } from '@/api/divisions'
import type { Letter } from '@/api/letters'
import { getDivisions, getUsers } from '@/api'
import { getLetters } from '@/api/letters'

interface DashboardStats {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

export const AdminDashboard: React.FC = () => {
  const theme = useTheme()

  // API Queries
  const { data: divisionsResponse, isLoading: divisionsLoading } = useQuery({
    queryKey: ['divisions'],
    queryFn: () => getDivisions({}),
    staleTime: 5 * 60 * 1000,
  })

  const { data: usersResponse, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({}),
    staleTime: 5 * 60 * 1000,
  })

  // Add query for letters/messages
  const { data: lettersResponse, isLoading: lettersLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: () => getLetters({}),
    staleTime: 5 * 60 * 1000,
  })

  const divisions = divisionsResponse?.data ?? []
  const users = usersResponse?.data ?? []
  const letters = lettersResponse?.data ?? []

  // Function to get message counts by division
  const getMessageCountsByDivision = (divisionId: number) => {
    const divisionMessages = letters.filter(
      (letter: Letter) => letter.assignedDivisionId === divisionId,
    )

    const total = divisionMessages.length
    const completed = divisionMessages.filter(
      (letter: Letter) =>
        letter.status === 'completed' || letter.status === 'closed',
    ).length
    const pending = divisionMessages.filter(
      (letter: Letter) =>
        letter.status === 'pending' || letter.status === 'in_progress',
    ).length
    const overdue = divisionMessages.filter(
      (letter: Letter) => letter.status === 'overdue',
    ).length

    return { total, completed, pending, overdue }
  }

  // Dashboard stats
  const dashboardStats: Array<DashboardStats> = [
    {
      title: 'Total Users',
      value: users.length || 0,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Divisions',
      value: divisions.length || 0,
      icon: <BusinessIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Pending Letters',
      value:
        letters.filter((letter: Letter) => letter.status === 'pending')
          .length || 0,
      icon: <EmailIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Total Letters',
      value: letters.length || 0,
      icon: <EmailIcon />,
      color: theme.palette.success.main,
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '1.1rem',
          }}
        >
          Welcome to your administration control center
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {dashboardStats.map((stat, index) => (
          <Card
            key={index}
            elevation={3}
            sx={{
              borderRadius: 3,
              background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                    width: 48,
                    height: 48,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: stat.color }}
                  >
                    {usersLoading || divisionsLoading || lettersLoading ? (
                      <LinearProgress
                        sx={{ width: 60, height: 8, borderRadius: 1 }}
                      />
                    ) : (
                      stat.value
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Division Letters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Division Letters
        </Typography>
        {divisionsLoading || lettersLoading ? (
          <LinearProgress />
        ) : divisions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No divisions found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
                lg: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {divisions.map((division: Division) => {
              const messageCounts = getMessageCountsByDivision(division.id)
              return (
                <Card
                  key={division.id}
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 40,
                          height: 40,
                          mr: 2,
                        }}
                      >
                        <BusinessIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {division.name}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Total Letters:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {messageCounts.total}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2" color="success.main">
                          Completed:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: 'success.main' }}
                        >
                          {messageCounts.completed}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2" color="warning.main">
                          Pending:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: 'warning.main' }}
                        >
                          {messageCounts.pending}
                        </Typography>
                      </Box>

                      {messageCounts.overdue > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="body2" color="error.main">
                            Overdue:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: 'error.main' }}
                          >
                            {messageCounts.overdue}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}
      </Box>
    </Container>
  )
}
