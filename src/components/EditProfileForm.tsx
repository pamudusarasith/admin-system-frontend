import React from 'react'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { updateUserProfileSchema } from '@/schemas'

interface EditProfileFormProps {
  open: boolean
  onClose: () => void
  onSubmit?: (profileData: ProfileFormData) => void
  initialData?: ProfileFormData
}

interface ProfileFormData {
  fullName: string
  email: string
  phoneNumber: string
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Initialize TanStack form
  const form = useForm({
    defaultValues: {
      fullName: initialData?.fullName ?? '',
      email: initialData?.email ?? '',
      phoneNumber: initialData?.phoneNumber ?? '',
    },
    validators: {
      onChange: updateUserProfileSchema, // zod schema for live validation
    },
    onSubmit: ({ value }) => {
      onSubmit?.(value)
    },
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Edit Profile
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.error.main,
              backgroundColor: `${theme.palette.error.main}10`,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await form.handleSubmit()
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Card
            elevation={0}
            sx={{ borderRadius: 0, background: 'transparent' }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Full Name */}
                <form.Field name="fullName">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!field.state.meta.isValid}
                      helperText={field.state.meta.errors
                        .map((err: any) => err.message)
                        .join(', ')}
                    />
                  )}
                </form.Field>

                {/* Email */}
                <form.Field name="email">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!field.state.meta.isValid}
                      helperText={field.state.meta.errors
                        .map((err: any) => err.message)
                        .join(', ')}
                    />
                  )}
                </form.Field>

                {/* Phone Number */}
                <form.Field name="phoneNumber">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!field.state.meta.isValid}
                      helperText={field.state.meta.errors
                        .map((err: any) => err.message)
                        .join(', ')}
                    />
                  )}
                </form.Field>
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 600, minWidth: 100 }}
          >
            Cancel
          </Button>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  minWidth: 120,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {isSubmitting ? 'Saving...' : 'Edit Profile'}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default EditProfileForm
