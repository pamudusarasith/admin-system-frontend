import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Edit } from '@mui/icons-material'
import type { UpdateUserProfilePayload } from '@/schemas'
import { EditProfileForm, SidebarLayout } from '@/components'

import { getUserProfile, updateProfile } from '@/api'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const theme = useTheme()
  const [editFormOpen, setEditFormOpen] = useState(false)
  const queryClient = useQueryClient()

  // TanStack Query for fetching user profile
  const {
    data: user,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry failed requests 2 times
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfilePayload) => updateProfile(data),
    onSuccess: () => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      setEditFormOpen(false)
    },
    onError: (e) => {
      console.error('Failed to update user profile:', e)
    },
  })

  // Show loading state
  if (loading) {
    return (
      <SidebarLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <CircularProgress size={48} />
          </Box>
        </Container>
      </SidebarLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <SidebarLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Unable to load user profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please make sure you're connected to the internet and try again.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 3, display: 'block' }}
            >
              Error:{' '}
              {error instanceof Error ? error.message : 'An error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mr: 2 }}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      </SidebarLayout>
    )
  }

  // Show fallback if no user data
  if (!user) {
    return (
      <SidebarLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            No user profile data available. Please refresh the page or contact
            support.
          </Alert>
        </Container>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
                gap: 4,
              }}
            >
              {/* Left Panel */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  borderRadius: 2,
                  p: 3,
                }}
              >
                {/* Left Column - Profile Image and Settings */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Profile Avatar */}
                  <Box sx={{ position: 'relative', mb: 3, mt: '130px' }}>
                    <Avatar
                      src="/assets/profileIcon.jpg"
                      sx={{ width: 150, height: 150 }}
                    />
                  </Box>

                  {/* User Profile Typography */}
                  <Box
                    sx={{
                      border: `2px solid ${theme.palette.secondary}`,
                      borderRadius: 2,
                      bgcolor: theme.palette.background.default,
                      px: 3,
                      py: 1.5,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                      }}
                    >
                      User Profile
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right panel */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  outline: `2px solid ${theme.palette.divider}`, // behaves like a border
                  outlineOffset: '-30px',
                  borderRadius: 2,
                  p: 3,
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    sx={{
                      border: `2px solid ${theme.palette.divider}`,
                      color: theme.palette.text.secondary,
                      height: 40,
                      width: 100,
                      alignSelf: 'flex-end',
                      marginRight: 3,
                      mt: 2,
                      mb: -12,
                    }}
                    startIcon={<Edit />}
                    onClick={() => setEditFormOpen(true)}
                  >
                    Edit
                  </Button>
                </Box>

                {/* Right Column - Form Fields */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    gap: 3,
                    mt: 14,
                    mb: 14,
                  }}
                >
                  {/* Name and Email Row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Name"
                      value={user.fullName || ''}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: theme.palette.background.default,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Email address"
                      value={user.email || ''}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: theme.palette.background.default,
                        },
                      }}
                    />
                  </Box>

                  {/* Phone Number Row with Country Code Dropdown */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Phone Number Input */}
                      <TextField
                        fullWidth
                        label="Phone number"
                        value={user.phoneNumber || ''}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: theme.palette.background.default,
                          },
                        }}
                      />
                    </Box>
                    {/* Status Field */}
                    <TextField
                      fullWidth
                      label="Status"
                      value={user.isActive ? 'Active' : 'Inactive'}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: theme.palette.background.default,
                        },
                      }}
                    />
                  </Box>

                  {/* Role and Division Row - The Key Fields You Requested */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2,
                      mt: 2,
                      p: 2,
                      border: `2px solid ${theme.palette.primary.main}`,
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main + '08',
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Role"
                      value={user.role}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: theme.palette.background.paper,
                          fontWeight: 600,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Division"
                      value={user.division}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: theme.palette.background.paper,
                          fontWeight: 600,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Edit Profile Form Dialog */}
        <EditProfileForm
          open={editFormOpen}
          onClose={() => setEditFormOpen(false)}
          initialData={{
            fullName: user.fullName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
          }}
          onSubmit={(formData) => {
            updateProfileMutation.mutate({
              fullName: formData.fullName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
            })
          }}
        />
      </Container>
    </SidebarLayout>
  )
}
