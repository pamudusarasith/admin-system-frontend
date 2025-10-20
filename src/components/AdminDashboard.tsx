import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Article as ArticleIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  HourglassEmpty as HourglassEmptyIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  PersonOff as PersonOffIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/api'
import { useAuth } from '@/core'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  gradient?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}) => {
  const theme = useTheme()
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="text.primary"
              sx={{ mb: 0.5 }}
            >
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

interface BreakdownCardProps {
  label: string
  value: number
  icon?: React.ReactNode
}

const BreakdownCard: React.FC<BreakdownCardProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon && (
          <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
        )}
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight="bold" color="primary">
        {value}
      </Typography>
    </Box>
  )
}

export const AdminDashboard = () => {
  const theme = useTheme()
  const { user } = useAuth()

  const {
    data: statsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2,
  })

  const stats = statsResponse?.data

  const handleRefresh = () => {
    refetch()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Skeleton
          variant="rectangular"
          height={120}
          sx={{ mb: 4, borderRadius: 4 }}
        />
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              {getGreeting()}, {user?.fullName || user?.username || 'Admin'}! 👋
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, fontWeight: 400 }}
            >
              Here is what is happening with your system today
            </Typography>
          </Box>
          <Tooltip title="Refresh statistics">
            <IconButton
              onClick={handleRefresh}
              disabled={isFetching}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                },
                ...(isFetching && {
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }),
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {stats?.userStats && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
          >
            User Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <StatCard
                title="Total Users"
                value={stats.userStats.totalUsers ?? 0}
                icon={<PeopleIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <StatCard
                title="Active Users"
                value={stats.userStats.activeUsers ?? 0}
                icon={<PersonAddIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <StatCard
                title="Inactive Users"
                value={stats.userStats.inactiveUsers ?? 0}
                icon={<PersonOffIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #a8caba 0%, #5d4e6d 100%)"
              />
            </Box>
          </Box>
        </Box>
      )}

      {stats?.letterStats && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
          >
            Letter Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
              <StatCard
                title="Total Letters"
                value={stats.letterStats.totalLetters ?? 0}
                icon={<EmailIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
              <StatCard
                title="Unassigned"
                value={stats.letterStats.unassignedLetters ?? 0}
                icon={<HourglassEmptyIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
              <StatCard
                title="In Progress"
                value={stats.letterStats.lettersByStatus?.['IN_PROGRESS'] ?? 0}
                icon={<DescriptionIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
              <StatCard
                title="Completed"
                value={stats.letterStats.lettersByStatus?.['COMPLETED'] ?? 0}
                icon={<CheckCircleIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {stats.letterStats.lettersByPriority &&
              Object.keys(stats.letterStats.lettersByPriority).length > 0 && (
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                  <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      By Priority
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      {Object.entries(stats.letterStats.lettersByPriority).map(
                        ([priority, count]) => (
                          <BreakdownCard
                            key={priority}
                            label={formatStatusLabel(priority)}
                            value={count}
                          />
                        ),
                      )}
                    </Box>
                  </Paper>
                </Box>
              )}
            {stats.letterStats.lettersByDivision &&
              Object.keys(stats.letterStats.lettersByDivision).length > 0 && (
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                  <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      By Division
                      {Object.keys(stats.letterStats.lettersByDivision).length >
                        5 && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {/* subtract 1 because unassigned key is always present */}
                          (Top 5 of{' '}
                          {Object.keys(stats.letterStats.lettersByDivision)
                            .length - 1}
                          )
                        </Typography>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        maxHeight: 300,
                        overflowY: 'auto',
                        pr: 1,
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: theme.palette.divider,
                          borderRadius: '3px',
                        },
                      }}
                    >
                      {Object.entries(stats.letterStats.lettersByDivision)
                        .sort(([, a], [, b]) => Number(b) - Number(a))
                        .slice(0, 5)
                        .map(([division, count]) => (
                          <BreakdownCard
                            key={division}
                            label={division}
                            value={count}
                            icon={<BusinessIcon />}
                          />
                        ))}
                    </Box>
                  </Paper>
                </Box>
              )}
          </Box>
        </Box>
      )}

      {stats?.cabinetPaperStats && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
          >
            Cabinet Papers
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <StatCard
                title="Total Papers"
                value={stats.cabinetPaperStats.totalPapers ?? 0}
                icon={<ArticleIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <StatCard
                title="With Decisions"
                value={stats.cabinetPaperStats.papersWithDecisions ?? 0}
                icon={<CheckCircleIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <StatCard
                title="Pending Review"
                value={stats.cabinetPaperStats.papersByStatus?.['PENDING'] ?? 0}
                icon={<HourglassEmptyIcon fontSize="large" />}
                gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {stats.cabinetPaperStats.papersByStatus &&
              Object.keys(stats.cabinetPaperStats.papersByStatus).length >
                0 && (
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                  <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      By Status
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      {Object.entries(
                        stats.cabinetPaperStats.papersByStatus,
                      ).map(([status, count]) => (
                        <BreakdownCard
                          key={status}
                          label={formatStatusLabel(status)}
                          value={count}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}
            {stats.cabinetPaperStats.papersByCategory &&
              Object.keys(stats.cabinetPaperStats.papersByCategory).length >
                0 && (
                <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                  <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      By Category
                      {Object.keys(stats.cabinetPaperStats.papersByCategory)
                        .length > 5 && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          (Top 5 of{' '}
                          {
                            Object.keys(
                              stats.cabinetPaperStats.papersByCategory,
                            ).length
                          }
                          )
                        </Typography>
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        maxHeight: 300,
                        overflowY: 'auto',
                        pr: 1,
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: theme.palette.divider,
                          borderRadius: '3px',
                        },
                      }}
                    >
                      {Object.entries(stats.cabinetPaperStats.papersByCategory)
                        .sort(([, a], [, b]) => Number(b) - Number(a))
                        .slice(0, 5)
                        .map(([category, count]) => (
                          <BreakdownCard
                            key={category}
                            label={category}
                            value={count}
                            icon={<AssignmentIcon />}
                          />
                        ))}
                    </Box>
                  </Paper>
                </Box>
              )}
          </Box>
        </Box>
      )}

      {(stats?.divisionStats || stats?.roleStats) && (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}
          >
            System Configuration
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {stats.divisionStats && (
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <StatCard
                  title="Total Divisions"
                  value={stats.divisionStats.totalDivisions ?? 0}
                  icon={<BusinessIcon fontSize="large" />}
                  gradient="linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)"
                />
              </Box>
            )}
            {stats.roleStats && (
              <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
                <StatCard
                  title="Total Roles"
                  value={stats.roleStats.totalRoles ?? 0}
                  icon={<SecurityIcon fontSize="large" />}
                  gradient="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {!stats?.userStats &&
        !stats?.letterStats &&
        !stats?.cabinetPaperStats &&
        !stats?.divisionStats &&
        !stats?.roleStats && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <TrendingUpIcon
              sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Statistics Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Statistics will appear here based on your permissions
            </Typography>
          </Paper>
        )}
    </Container>
  )
}
