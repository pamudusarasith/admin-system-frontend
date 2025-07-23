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
import { useMutation } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { createUser } from '@/api/users'

interface CreateUserProps {
  onClose?: () => void
}

// Validation schema using Zod
const createUserSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  division: z.string().min(1, 'Division is required'),
  role: z.string().min(1, 'Role is required'),
})

type CreateUserForm = z.infer<typeof createUserSchema>

export function CreateUser({ onClose }: CreateUserProps) {
  const theme = useTheme()
  const createMutation = useMutation({
    mutationFn: createUser,
  })

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      division: '',
      role: '',
    } as CreateUserForm,
    onSubmit: async ({ value }) => {
      try {
        // Validate the form data
        const validatedData = createUserSchema.parse(value)
        await createMutation.mutateAsync(validatedData)
        alert('User created successfully')
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
                  name="division"
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
                        <MenuItem value="Administration Division">
                          Administration Division
                        </MenuItem>
                        <MenuItem value="Finance Division">
                          Finance Division
                        </MenuItem>
                        <MenuItem value="Establishment Division">
                          Establishment Division
                        </MenuItem>
                        <MenuItem value="Planning Division">
                          Planning Division
                        </MenuItem>
                        <MenuItem value="Education Quality Development Division">
                          Education Quality Development Division
                        </MenuItem>
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
                  name="role"
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
                        <MenuItem value="Minister of Education">
                          Minister of Education
                        </MenuItem>
                        <MenuItem value="Permanent Secretary">
                          Permanent Secretary
                        </MenuItem>
                        <MenuItem value="Additional Secretary">
                          Additional Secretary
                        </MenuItem>
                        <MenuItem value="Parliamentary Secretary">
                          Parliamentary Secretary
                        </MenuItem>
                        <MenuItem value="Director Generals">
                          Director Generals
                        </MenuItem>
                        <MenuItem value="Director of Education">
                          Director of Education
                        </MenuItem>
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
                    !canSubmit || isSubmitting || createMutation.isPending
                  }
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  {isSubmitting || createMutation.isPending
                    ? 'Creating...'
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
