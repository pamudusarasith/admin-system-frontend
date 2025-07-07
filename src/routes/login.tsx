import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Home as HomeIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { AnimatedIcon } from '../components'
import { login } from '@/api'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

interface LoginForm {
  username: string
  password: string
}

function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: LoginForm) =>
      login(username, password),
    onSuccess: (data) => {
      // Store the token (you might want to use a more secure method)
      localStorage.setItem('access_token', data.access_token)
      navigate({ to: '/' })
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

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 6,
            borderRadius: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            width: '100%',
            maxWidth: 480,
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
            {/* Logo/Icon */}
            <AnimatedIcon size={100}>
              <LoginIcon sx={{ fontSize: 50 }} />
            </AnimatedIcon>

            {/* Welcome Text */}
            <Box textAlign="center">
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                }}
              >
                Sign in to your admin account
              </Typography>
            </Box>

            {/* Error Alert */}
            {loginMutation.isError && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                }}
              >
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'Login failed. Please check your credentials.'}
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
                      disabled={loginMutation.isPending}
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
                                disabled={loginMutation.isPending}
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

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loginMutation.isPending}
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
                  {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ width: '100%', my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            {/* Go Home Button */}
            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              disabled={loginMutation.isPending}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Home
            </Button>

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
    </Container>
  )
}
