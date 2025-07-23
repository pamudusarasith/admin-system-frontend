import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import { FormControl } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import type { CreateUserPayload } from '@/schemas/users'
import { createUser } from '@/api/users'
import { getRoles } from '@/api/roles'
import { getDivisions } from '@/api/divisions'
import { createUserSchema } from '@/schemas/users'

interface CreateUserProps {
  onClose?: () => void
}

export function CreateUser({ onClose }: CreateUserProps) {
  const theme = useTheme()
  const createMutation = useMutation({
    mutationFn: createUser,
  })
  const queryClient = useQueryClient()

  // Fetch roles and divisions using TanStack Query
  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })

  const {
    data: divisions = [],
    isLoading: divisionsLoading,
    error: divisionsError,
  } = useQuery({
    queryKey: ['divisions'],
    queryFn: getDivisions,
  })

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      divisionId: 0,
      roleId: 0,
    } as CreateUserPayload,
    onSubmit: async ({ value }) => {
      try {
        // Validate the form data
        const validatedData = createUserSchema.parse(value)
        await createMutation.mutateAsync(validatedData)
        alert('User created successfully')
        queryClient.invalidateQueries({ queryKey: ['users'] })
        if (onClose) onClose()
      } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
          alert(
            'Validation error: ' +
              error.issues.map((e) => e.message).join(', '),
          )
        } else {
          alert('Failed to create user')
        }
      }
    },
  })

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Create User
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          display: 'flex',
          mx: 'auto',
        }}
      > */}
      <Box sx={{ width: '100%' }}>
        {/* Loading state */}
        {(rolesLoading || divisionsLoading) && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography>Loading roles and divisions...</Typography>
          </Box>
        )}

        {/* Error state */}
        {(rolesError || divisionsError) && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="error">
              Error loading data:{' '}
              {rolesError?.message || divisionsError?.message}
            </Typography>
          </Box>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            padding={2}
            borderRadius={4}
          >
            <Grid size={6} color={theme.palette.text.primary}>
              <Box
                sx={{
                  '& .MuiTextField-root': {
                    m: 1,
                    width: 'calc(100% - 16px)',
                  },
                  '& .MuiFormControl-root': {
                    m: 1,
                    width: 'calc(100% - 16px)',
                  },
                }}
              >
                <form.Field
                  name="username"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Username is required'
                      if (value.length < 3)
                        return 'Username must be at least 3 characters'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <TextField
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      label="Username"
                      placeholder="Please insert the username here..."
                      variant="outlined"
                      error={field.state.meta.errors.length > 0}
                      helperText={field.state.meta.errors.join(', ')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AdminPanelSettingsOutlinedIcon
                              sx={{ color: theme.palette.grey[600] }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Email is required'
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      if (!emailRegex.test(value)) return 'Invalid email format'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <TextField
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      label="Email"
                      type="email"
                      placeholder="Please insert the email here..."
                      variant="outlined"
                      error={field.state.meta.errors.length > 0}
                      helperText={field.state.meta.errors.join(', ')}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon
                              sx={{ color: theme.palette.grey[600] }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid size={6} color={theme.palette.text.primary}>
              <Box
                sx={{
                  '& .MuiTextField-root': {
                    m: 1,
                    width: 'calc(100% - 16px)',
                  },
                  '& .MuiFormControl-root': {
                    m: 1,
                    width: 'calc(100% - 16px)',
                  },
                }}
              >
                <form.Field
                  name="divisionId"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Division is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <FormControl
                      variant="outlined"
                      error={field.state.meta.errors.length > 0}
                      disabled={divisionsLoading}
                    >
                      <InputLabel>Division</InputLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        label="Division"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {divisionsError ? (
                          <MenuItem disabled>
                            <em>Error loading divisions</em>
                          </MenuItem>
                        ) : (
                          divisions.map((division) => (
                            <MenuItem key={division.id} value={division.id}>
                              {division.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          {field.state.meta.errors.join(', ')}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
                <form.Field
                  name="roleId"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Role is required'
                      return undefined
                    },
                  }}
                  children={(field) => (
                    <FormControl
                      variant="outlined"
                      error={field.state.meta.errors.length > 0}
                      disabled={rolesLoading}
                    >
                      <InputLabel>Role</InputLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        label="Role"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {rolesError ? (
                          <MenuItem disabled>
                            <em>Error loading roles</em>
                          </MenuItem>
                        ) : (
                          roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          {field.state.meta.errors.join(', ')}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 4,
              flexWrap: 'wrap',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Close
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    createMutation.isPending ||
                    rolesLoading ||
                    divisionsLoading ||
                    !!rolesError ||
                    !!divisionsError
                  }
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  {isSubmitting || createMutation.isPending
                    ? 'Creating...'
                    : rolesLoading || divisionsLoading
                      ? 'Loading...'
                      : 'Create'}
                </Button>
              )}
            />
          </Box>
        </form>
      </Box>
    </Box>
  )
}
