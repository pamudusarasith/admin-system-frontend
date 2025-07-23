import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Camera as CameraIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material'

import { EditProfileForm, SidebarLayout } from '@/components'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

interface UserProfile {
  name: string
  role: string
  email: string
  mobile: string
  avatar: string
  department: string
  location: string
  joinDate: string
  status: 'Active' | 'Inactive'
}

// Mock user data
const mockUser: UserProfile = {
  name: 'John Anderson',
  role: 'System Administrator',
  email: 'john.anderson@company.com',
  mobile: '+1 (555) 123-4567',
  avatar: '', // Empty to show placeholder
  department: 'Information Technology',
  location: 'San Francisco, CA',
  joinDate: '2022-03-15',
  status: 'Active',
}

function ProfilePage() {
  const theme = useTheme()
  const [user, setUser] = useState<UserProfile>(mockUser)
  const [editDialog, setEditDialog] = useState(false)
  const [editForm, setEditForm] = useState<UserProfile>(mockUser)

  const handleEditProfile = () => {
    setEditForm(user)
    setEditDialog(true)
  }

  const handleSaveProfile = () => {
    setUser(editForm)
    setEditDialog(false)
  }

  const handleCancelEdit = () => {
    setEditForm(user)
    setEditDialog(false)
  }

  const handleFormChange = (field: keyof UserProfile, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  // Generate initials for avatar placeholder
  //   const getInitials = (name: string) => {
  //     return name
  //       .split(' ')
  //       .map(word => word.charAt(0))
  //       .join('')
  //       .toUpperCase()
  //       .slice(0, 2)
  //   }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Profile Card */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          {/* Header Section with Cover Image Style */}
          <Box sx={{ position: 'relative', height: 240 }}>
            {/* Cover/Banner Background */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // Add a darker overlay using a linear-gradient with higher opacity
                background: `
                    linear-gradient(120deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 100%),
                    url('./profileHeader1.jpg'),
                    linear-gradient(120deg, #1976d2 0%, #64b5f6 100%)
                `,
                backgroundSize: 'cover, cover, cover',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
                filter: 'brightness(0.92)',
              }}
            />

            {/* Edit Button - Top Right */}
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                right: 24,
                zIndex: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Edit Profile
              </Button>
            </Box>

            {/* User Info - Center of Banner */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 1,
                color: 'white',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontWeight: 400,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {user.role}
              </Typography>
            </Box>
          </Box>

          {/* Avatar Section - Overlapping the Banner */}
          <Box
            sx={{
              position: 'relative',
              height: 80,
              bgcolor: theme.palette.background.paper,
            }}
          >
            {/* Profile Avatar - Bottom Left of Banner */}
            <Box
              sx={{
                position: 'absolute',
                left: 40,
                top: -80,
                zIndex: 3,
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 140,
                  height: 140,
                  fontSize: '3rem',
                  fontWeight: 600,
                  bgcolor: theme.palette.secondary.main,
                  border: `5px solid white`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                }}
              >
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt={user.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  width: 36,
                  height: 36,
                  boxShadow: theme.shadows[4],
                  '&:hover': {
                    bgcolor: theme.palette.background.paper,
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s ease',
                }}
                size="small"
              >
                <CameraIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Status and Department Chips */}
            <Box
              sx={{
                position: 'absolute',
                left: 200,
                top: -40,
                zIndex: 2,
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={user.status}
                  size="small"
                  sx={{
                    bgcolor:
                      user.status === 'Active' ? 'success.main' : 'error.main',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={user.department}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                  }}
                />
              </Stack>
            </Box>
          </Box>

          {/* Profile Details Section */}
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: theme.palette.text.primary,
              }}
            >
              Contact Information
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              {/* Email */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
                  },
                }}
              >
                <EmailIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 2,
                    fontSize: '1.5rem',
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              {/* Mobile */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
                  },
                }}
              >
                <PhoneIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 2,
                    fontSize: '1.5rem',
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Mobile Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {user.mobile}
                  </Typography>
                </Box>
              </Box>

              {/* Department */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
                  },
                }}
              >
                <BusinessIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 2,
                    fontSize: '1.5rem',
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {user.department}
                  </Typography>
                </Box>
              </Box>

              {/* Location */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
                  },
                }}
              >
                <LocationIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 2,
                    fontSize: '1.5rem',
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {user.location}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Additional Info */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Account Details
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2.5,
                borderRadius: 2,
                bgcolor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CalendarIcon
                sx={{
                  color: theme.palette.primary.main,
                  mr: 2,
                  fontSize: '1.5rem',
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Member Since
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Paper>

        {/* Edit Profile Dialog */}
        <EditProfileForm
          open={editDialog}
          editForm={editForm}
          onClose={handleCancelEdit}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
          onFormChange={handleFormChange}
        />
      </Container>
    </SidebarLayout>
  )
}
