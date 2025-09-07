import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import { SidebarLayout } from '@/components'
import { Edit } from '@mui/icons-material'

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

interface UserProfile {
  fullName: string
  email: string
  phoneNumber: string
  role: string
  division: string
}

// Sample user data matching the design exactly
const sampleUser: UserProfile = {
  fullName: 'Jaydon Frankie',
  email: 'demo@minimals.cc',
  phoneNumber: '(416) 555-0198',
  role: 'Administrator',
  division: 'Finance',
}

function ProfilePage() {
  const theme = useTheme()
  const [user, setUser] = useState<UserProfile>(sampleUser)

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
              {/*Left Panel */}
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

              {/*Right panel */}
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
                      value={user.fullName}
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
                      value={user.email}
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
                        value={user.phoneNumber}
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
                      value="Active"
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
      </Container>
    </SidebarLayout>
  )
}
