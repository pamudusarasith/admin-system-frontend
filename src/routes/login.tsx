import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
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
  Lock as LockIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AnimatedIcon } from '@/components'
import { useAuth } from '@/auth'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: LoginPage,
})

interface LoginForm {
  username: string
  password: string
}

function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const {
    login: authLogin,
    error,
    clearError,
    isLoading: authLoading,
  } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const search = Route.useSearch()

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: LoginForm) => {
      // Clear any previous errors
      clearError()

      // Use the auth context login method which handles API call internally
      await authLogin(username, password)

      // Navigate after successful login
      navigate({ to: search.redirect, replace: true })
    },
    onError: (loginError) => {
      console.error('Login failed:', loginError)
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    },
  })

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Left Side - Branding Section - Hidden on mobile */}
      <Box
        sx={{
          flex: 0.5,
          background: `
            linear-gradient(135deg, ${theme.palette.primary.main}CC, ${theme.palette.secondary.main}CC),
            url('./login.jpg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left side content */}
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Admin System
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Manage your system with ease
          </Typography>
        </Box>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
            },
          }}
        />
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          backgroundColor: theme.palette.background.default,
          minHeight: { xs: '100vh', md: 'auto' },
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            width: '100%',
            maxWidth: { xs: 400, md: 600 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
            {/* Logo/Icon */}
            <AnimatedIcon size={100}>
              <LoginIcon
                sx={{
                  fontSize: { xs: 40, md: 50 },
                }}
              />
            </AnimatedIcon>

            {/* Welcome Text */}
            <Box textAlign="center">
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Sign in to your admin account
              </Typography>
            </Box>

            {/* Error Alert */}
            {(error || loginMutation.isError) && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                }}
              >
                {error ||
                  (loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : 'Login failed. Please check your credentials.')}
              </Alert>
            )}

            {/* Login Form */}
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
                <form.Field
                  name="username"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Username is required' : undefined,
                  }}
                >
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Username"
                      variant="outlined"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      error={!!field.state.meta.errors.length}
                      helperText={field.state.meta.errors[0]}
                      disabled={loginMutation.isPending || authLoading}
                      InputLabelProps={{
                        sx: {
                          fontSize: '1.1rem',
                          fontWeight: 500,
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Password is required' : undefined,
                  }}
                >
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      error={!!field.state.meta.errors.length}
                      disabled={loginMutation.isPending || authLoading}
                      InputLabelProps={{
                        sx: {
                          fontSize: '1.1rem',
                          fontWeight: 500,
                        },
                      }}
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
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                                disabled={
                                  loginMutation.isPending || authLoading
                                }
                              >
                                {showPassword ? (
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
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  )}
                </form.Field>

                {/* Forgot Password Link */}
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}
                >
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      // Handle forgot password logic here
                      console.log('Forgot password clicked')
                      // You can navigate to forgot password page or show a modal
                      // navigate({ to: '/forgot-password' })
                    }}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      p: 0.5,
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loginMutation.isPending || authLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    },
                    '&:disabled': {
                      background: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loginMutation.isPending || authLoading
                    ? 'Signing In...'
                    : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            {/* Footer Text */}
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                mt: 3,
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              Don't have an account? Contact your administrator
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
