import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useTheme,
  Avatar,
  IconButton,
  Divider,
  InputAdornment,
  alpha,
} from '@mui/material'
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Camera as CameraIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

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

interface EditProfileFormProps {
  open: boolean
  editForm: UserProfile
  onClose: () => void
  onSave: () => void
  onCancel: () => void
  onFormChange: (field: keyof UserProfile, value: string) => void
}

export function EditProfileForm({
  open,
  editForm,
  onClose,
  onSave,
  onCancel,
  onFormChange,
}: EditProfileFormProps) {
  const theme = useTheme()

  // Generate initials for avatar placeholder
//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map((word) => word.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2)
//   }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.15)}`,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header Section */}
      <DialogTitle sx={{ p: 0, position: 'relative' }}>
        {/* Background with gradient */}
        <Box
          sx={{
            background: 'transparent',
            px: 4,
            py: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern removed for transparency */}

          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: theme.palette.text.primary,
              backgroundColor: 'rgba(255,255,255,0.6)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.8)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title content */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ position: 'relative' }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'transparent',
              }}
            >
              <EditIcon
                sx={{ color: theme.palette.text.primary, fontSize: 28 }}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Edit Profile
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                }}
              >
                Update your personal information and preferences
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogTitle>

      {/* Content Section */}
      <DialogContent sx={{ p: 0 }}>
        {/* Profile Avatar Section */}
        <Box sx={{ p: 4, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative', mr: 3 }}>
              <Avatar
                src={editForm.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '3rem',
                  fontWeight: 600,
                  bgcolor: theme.palette.secondary.main,
                  border: `5px solid white`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                }}
              >
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt={editForm.name}
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
                  bottom: -5,
                  right: -5,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
                size="small"
              >
                <CameraIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {editForm.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editForm.role}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Form Fields */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: theme.palette.text.primary,
            }}
          >
            Personal Information
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Full Name"
              value={editForm.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8,
                    ),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Role"
              value={editForm.role}
              onChange={(e) => onFormChange('role', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8,
                    ),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Email Address"
              value={editForm.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              variant="outlined"
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8,
                    ),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Mobile Number"
              value={editForm.mobile}
              onChange={(e) => onFormChange('mobile', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8,
                    ),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Department"
              value={editForm.department}
              onChange={(e) => onFormChange('department', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                gridColumn: { xs: '1', sm: '1 / -1' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8,
                    ),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Location"
              value={editForm.location}
              onChange={(e) => onFormChange('location', e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                gridColumn: { xs: '1', sm: '1 / -1' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  '&:hover': {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.8,
                    ),
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Actions Section */}
      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          backgroundColor: alpha(theme.palette.background.default, 0.3),
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button
            onClick={onCancel}
            startIcon={<CancelIcon />}
            variant="outlined"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 3,
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.04),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            startIcon={<SaveIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
