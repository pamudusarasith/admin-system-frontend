import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  useTheme,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  Stack,
  Divider,
} from '@mui/material'
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { getDivisions } from '@/api/divisions'
import { getUsers } from '@/api/users'

interface DashboardStats {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: string
}

interface SystemActivity {
  id: string
  type: 'user' | 'division' | 'letter' | 'system'
  title: string
  description: string
  timestamp: string
  severity: 'info' | 'success' | 'warning' | 'error'
  user?: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  color: string
}

export const AdminDashboard: React.FC = () => {
  const theme = useTheme()
  const [refreshKey] = useState(0)

  // API Queries
  const { data: divisions = [], isLoading: divisionsLoading } = useQuery({
    queryKey: ['divisions', refreshKey],
    queryFn: getDivisions,
    staleTime: 5 * 60 * 1000,
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users', refreshKey],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000,
  })

  // Mock data for dashboard stats
  const dashboardStats: DashboardStats[] = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      change: 12,
      changeType: 'increase',
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Divisions',
      value: divisions?.length || 0,
      change: 3,
      changeType: 'increase',
      icon: <BusinessIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Pending Letters',
      value: 47,
      change: -8,
      changeType: 'decrease',
      icon: <EmailIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Received Letters',
      value: 124,
      change: 15,
      changeType: 'increase',
      icon: <EmailIcon />,
      color: theme.palette.success.main,
    },
  ]

  // Mock system activities
  const systemActivities: SystemActivity[] = [
    {
      id: '1',
      type: 'user',
      title: 'New User Registration',
      description: 'John Smith registered as a new user',
      timestamp: '2 minutes ago',
      severity: 'info',
      user: 'John Smith',
    },
    {
      id: '2',
      type: 'letter',
      title: 'Letter Assignment',
      description: 'Letter #2025-001 assigned to Finance Division',
      timestamp: '15 minutes ago',
      severity: 'success',
      user: 'Admin',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Backup Completed',
      description: 'Daily backup completed successfully',
      timestamp: '1 hour ago',
      severity: 'success',
    },
    {
      id: '4',
      type: 'division',
      title: 'Division Update',
      description: 'IT Division description updated',
      timestamp: '2 hours ago',
      severity: 'info',
      user: 'Admin',
    },
    {
      id: '5',
      type: 'system',
      title: 'High System Load',
      description: 'System experiencing high CPU usage',
      timestamp: '3 hours ago',
      severity: 'warning',
    },
  ]

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Add New User',
      description: 'Create a new user account',
      icon: <PeopleIcon />,
      action: () => console.log('Navigate to add user'),
      color: theme.palette.primary.main,
    },
    {
      id: '2',
      title: 'Manage Divisions',
      description: 'View and manage divisions',
      icon: <BusinessIcon />,
      action: () => console.log('Navigate to divisions'),
      color: theme.palette.secondary.main,
    },
    {
      id: '3',
      title: 'Letter Management',
      description: 'View and manage letters',
      icon: <EmailIcon />,
      action: () => console.log('Navigate to letters'),
      color: theme.palette.warning.main,
    },
    {
      id: '4',
      title: 'System Settings',
      description: 'Configure system settings',
      icon: <SecurityIcon />,
      action: () => console.log('Navigate to settings'),
      color: theme.palette.info.main,
    },
    {
      id: '5',
      title: 'View Reports',
      description: 'Generate system reports',
      icon: <AssignmentIcon />,
      action: () => console.log('Navigate to reports'),
      color: theme.palette.success.main,
    },
  ]

  const getActivityIcon = (
    type: SystemActivity['type'],
    severity: SystemActivity['severity'],
  ) => {
    if (severity === 'error') return <ErrorIcon color="error" />
    if (severity === 'warning') return <WarningIcon color="warning" />
    if (severity === 'success') return <CheckCircleIcon color="success" />

    switch (type) {
      case 'user':
        return <PeopleIcon color="primary" />
      case 'division':
        return <BusinessIcon color="secondary" />
      case 'letter':
        return <EmailIcon color="info" />
      case 'system':
        return <InfoIcon color="action" />
      default:
        return <InfoIcon color="action" />
    }
  }

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    if (changeType === 'increase')
      return (
        <ArrowUpwardIcon
          sx={{ fontSize: 16, color: theme.palette.success.main }}
        />
      )
    if (changeType === 'decrease')
      return (
        <ArrowDownwardIcon
          sx={{ fontSize: 16, color: theme.palette.error.main }}
        />
      )
    return null
  }

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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                    {usersLoading || divisionsLoading ? (
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getChangeIcon(stat.changeType)}
                <Typography
                  variant="body2"
                  sx={{
                    ml: 0.5,
                    color:
                      stat.changeType === 'increase'
                        ? theme.palette.success.main
                        : stat.changeType === 'decrease'
                          ? theme.palette.error.main
                          : theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {stat.changeType === 'increase' ? '+' : ''}
                  {stat.change}% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: 3,
        }}
      >
        {/* System Activity */}
        <Card elevation={3} sx={{ borderRadius: 3, height: 'fit-content' }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent System Activity
              </Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Stack spacing={2}>
              {systemActivities.map((activity, index) => (
                <Box key={activity.id}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}
                  >
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {getActivityIcon(activity.type, activity.severity)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {activity.timestamp}
                        </Typography>
                        {activity.user && (
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              •
                            </Typography>
                            <Chip
                              label={activity.user}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  {index < systemActivities.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Quick Actions & System Overview */}
        <Stack spacing={3}>
          {/* Quick Actions */}
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                {quickActions.map((action) => (
                  <Paper
                    key={action.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: action.color,
                        boxShadow: `0 4px 12px ${action.color}20`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${action.color}20`,
                          color: action.color,
                          width: 36,
                          height: 36,
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  )
}
