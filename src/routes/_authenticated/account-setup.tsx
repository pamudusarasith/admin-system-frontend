import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { AccountSetupPayload } from '@/schemas'
import { accountSetupSchema } from '@/schemas'
import { accountSetup } from '@/api'
import { AnimatedIcon, useSnackbar } from '@/components'
import { useAuth } from '@/core'

export const Route = createFileRoute('/_authenticated/account-setup')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/',
  }),
  component: AccountSetupPage,
})

function AccountSetupPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const { profile, refresh } = useAuth()
  const search = Route.useSearch()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const accountSetupMutation = useMutation({
    mutationFn: accountSetup,
    onSuccess: async (response) => {
      const message =
        response.message?.trim() || 'Account setup completed successfully!'
      showSnackbar({ message, severity: 'success' })

      // Refresh auth state to update profile
      await refresh()

      // Invalidate user profile cache
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] })

      // Navigate to redirect or home
      navigate({ to: search.redirect, replace: true })
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to complete account setup. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const form = useForm({
    defaultValues: {
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      oldPassword: '',
      newPassword: '',
    } as AccountSetupPayload,
    validators: {
      onChange: accountSetupSchema,
    },
    onSubmit: async ({ value }) => {
      await accountSetupMutation.mutateAsync(value)
    },
  })

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: theme.palette.background.paper,
          width: '100%',
          maxWidth: 700,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Stack spacing={4} alignItems="center">
          {/* Icon and Title */}
          <Box textAlign="center">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <AnimatedIcon size={80}>
                <AccountCircleIcon
                  sx={{
                    fontSize: { xs: 50, sm: 60 },
                    color: theme.palette.primary.main,
                  }}
                />
              </AnimatedIcon>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mt: 2,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
              }}
            >
              Complete Your Profile
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
              }}
            >
              Please update your information to continue
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            sx={{ width: '100%' }}
          >
            <Stack spacing={3}>
              {/* Personal Info Section */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <AccountCircleIcon /> Personal Information
              </Typography>

              <form.Field name="fullName">
                {(field) => (
                  <TextField
                    fullWidth
                    label="Full Name"
                    type="text"
                    variant="outlined"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length
                    }
                    helperText={
                      field.state.meta.isTouched &&
                      field.state.meta.errors[0]?.message
                    }
                    disabled={accountSetupMutation.isPending}
                    autoComplete="name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              </form.Field>

              {/* Contact Details Section */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 2,
                }}
              >
                <EmailIcon /> Contact Details
              </Typography>

              <form.Field name="email">
                {(field) => (
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length
                    }
                    helperText={
                      field.state.meta.isTouched &&
                      field.state.meta.errors[0]?.message
                    }
                    disabled={accountSetupMutation.isPending}
                    autoComplete="email"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              </form.Field>

              <form.Field name="phoneNumber">
                {(field) => (
                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length
                    }
                    helperText={
                      field.state.meta.isTouched &&
                      field.state.meta.errors[0]?.message
                    }
                    disabled={accountSetupMutation.isPending}
                    placeholder="0771234567"
                    autoComplete="tel"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              </form.Field>

              {/* Security Section */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 2,
                }}
              >
                <LockIcon /> Security
              </Typography>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                For security purposes, you must change your password on first
                login.
              </Alert>

              <form.Field name="oldPassword">
                {(field) => (
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showOldPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length
                    }
                    helperText={
                      field.state.meta.isTouched &&
                      field.state.meta.errors[0]?.message
                    }
                    disabled={accountSetupMutation.isPending}
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowOldPassword(!showOldPassword)
                              }
                              edge="end"
                              disabled={accountSetupMutation.isPending}
                            >
                              {showOldPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              </form.Field>

              <form.Field name="newPassword">
                {(field) => (
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={field.state.value || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={
                      field.state.meta.isTouched &&
                      !!field.state.meta.errors.length
                    }
                    helperText={
                      field.state.meta.isTouched &&
                      field.state.meta.errors[0]?.message
                    }
                    disabled={accountSetupMutation.isPending}
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              edge="end"
                              disabled={accountSetupMutation.isPending}
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              </form.Field>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={accountSetupMutation.isPending}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 1.5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {accountSetupMutation.isPending
                  ? 'Saving...'
                  : 'Complete Setup'}
              </Button>
            </Stack>
          </Box>

          {/* Footer Note */}
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              textAlign: 'center',
              fontSize: '0.85rem',
            }}
          >
            This is a one-time setup. You can update these details later from
            your profile.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
