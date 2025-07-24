import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { roleFormDataSchema, type RoleFormData } from '@/schemas/role'
import { createRole, updateRole } from '@/api'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'

interface AddRoleDialogProps {
  open: boolean
  onClose: () => void
  editMode?: boolean
  initialData?: { id: string } & RoleFormData
  onSuccess?: () => void
}

// Available permission sections and their actions
const PERMISSION_SECTIONS = [
  {
    id: 'LETTER_MANAGEMENT',
    label: 'Letter Management',
    permissions: [
      { id: 'letter:create', label: 'Create Letters' },
      { id: 'letter:view', label: 'View Letters' },
      { id: 'letter:edit', label: 'Edit Letters' },
      { id: 'letter:delete', label: 'Delete Letters' },
      { id: 'letter:assign', label: 'Assign Letters' },
      { id: 'letter:accept', label: 'Accept Letters' },
      { id: 'letter:return', label: 'Return Letters' },
      { id: 'letter:close', label: 'Close Letters' },
    ],
  },
  {
    id: 'USER_MANAGEMENT',
    label: 'User Management',
    permissions: [
      { id: 'user:create', label: 'Create Users' },
      { id: 'user:view', label: 'View Users' },
      { id: 'user:edit', label: 'Edit Users' },
      { id: 'user:delete', label: 'Delete Users' },
      { id: 'user:manage_roles', label: 'Manage User Roles' },
    ],
  },
  {
    id: 'DIVISION_MANAGEMENT',
    label: 'Division Management',
    permissions: [
      { id: 'division:create', label: 'Create Divisions' },
      { id: 'division:view', label: 'View Divisions' },
      { id: 'division:edit', label: 'Edit Divisions' },
      { id: 'division:delete', label: 'Delete Divisions' },
      { id: 'division:manage_users', label: 'Manage Division Users' },
    ],
  },
  {
    id: 'REPORTS_AND_SYSTEM',
    label: 'Reports & System',
    permissions: [
      { id: 'report:view', label: 'View Reports' },
      { id: 'report:generate', label: 'Generate Reports' },
      { id: 'system:admin', label: 'System Administration' },
      { id: 'settings:manage', label: 'Manage Settings' },
    ],
  },
] as const

export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onClose,
  editMode = false,
  initialData,
  onSuccess,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Mutations for create and update
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      onSuccess?.()
      handleClose()
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, roleData }: { id: string; roleData: RoleFormData }) =>
      updateRole(id, roleData),
    onSuccess: () => {
      onSuccess?.()
      handleClose()
    },
  })
  console.log('initialData', initialData)
  // Form setup with TanStack Form
  const form = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      permissions: initialData?.permissions || [],
    } as RoleFormData,
    validators: {
      onChange: roleFormDataSchema,
    },
    onSubmit: async ({ value }) => {
      if (editMode && initialData) {
        // Assuming we have the role ID available somehow, you might need to pass it in initialData
        // For now, let's assume initialData has an id property
        updateRoleMutation.mutate({
          id: initialData.id,
          roleData: value,
        })
      } else {
        createRoleMutation.mutate(value)
      }
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const isSubmitting =
    createRoleMutation.isPending || updateRoleMutation.isPending
  const error = createRoleMutation.error || updateRoleMutation.error

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {editMode ? 'Edit Role' : 'Add New Role'}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
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

      <DialogContent sx={{ p: 0 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 0,
            background: 'transparent',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <Stack spacing={3}>
                {/* Display mutation error */}
                {error && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.error.main,
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: `${theme.palette.error.main}10`,
                    }}
                  >
                    {error instanceof Error
                      ? error.message
                      : 'An error occurred'}
                  </Typography>
                )}

                {/* Role Name Field */}
                <form.Field name="name">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Role Name"
                      variant="outlined"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!field.state.meta.isValid}
                      helperText={
                        field.state.meta.isTouched && !field.state.meta.isValid
                          ? field.state.meta.errors.join(', ')
                          : ''
                      }
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

                {/* Description Field */}
                <form.Field name="description">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!field.state.meta.isValid}
                      helperText={
                        field.state.meta.isTouched && !field.state.meta.isValid
                          ? field.state.meta.errors.join(', ')
                          : ''
                      }
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

                {/* Permissions Field */}
                <form.Field name="permissions">
                  {(field) => (
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        Permissions
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          mb: 2,
                        }}
                      >
                        Select the permissions that users with this role should
                        have
                      </Typography>

                      <FormControl
                        component="fieldset"
                        variant="standard"
                        error={!field.state.meta.isValid}
                      >
                        <FormGroup>
                          <Stack spacing={3}>
                            {PERMISSION_SECTIONS.map((section) => (
                              <Box key={section.id}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                  }}
                                >
                                  {section.label}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                      xs: '1fr 1fr',
                                      md: '1fr 1fr 1fr 1fr',
                                    },
                                    gap: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    backgroundColor:
                                      theme.palette.background.default,
                                  }}
                                >
                                  {section.permissions.map((permission) => (
                                    <FormControlLabel
                                      key={permission.id}
                                      control={
                                        <Checkbox
                                          checked={(() => {
                                            console.log(
                                              'pamudu',
                                              field.state.value,
                                            )
                                            console.log('dinu', permission.id)
                                            return field.state.value.includes(
                                              permission.id,
                                            )
                                          })()}
                                          onChange={(event) => {
                                            const newPermissions = event.target
                                              .checked
                                              ? [
                                                  ...field.state.value,
                                                  permission.id,
                                                ]
                                              : field.state.value.filter(
                                                  (id) => id !== permission.id,
                                                )
                                            field.handleChange(newPermissions)
                                          }}
                                          sx={{
                                            '&.Mui-checked': {
                                              color: theme.palette.primary.main,
                                            },
                                          }}
                                        />
                                      }
                                      label={
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontWeight: 500,
                                            color: theme.palette.text.primary,
                                          }}
                                        >
                                          {permission.label}
                                        </Typography>
                                      }
                                      sx={{
                                        alignItems: 'center',
                                        m: 0,
                                        '& .MuiFormControlLabel-label': {
                                          ml: 1,
                                        },
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        </FormGroup>
                        {field.state.meta.isTouched &&
                          !field.state.meta.isValid && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.error.main,
                                mt: 1,
                              }}
                            >
                              {field.state.meta.errors.join(', ')}
                            </Typography>
                          )}
                      </FormControl>
                    </Box>
                  )}
                </form.Field>
              </Stack>
            </form>
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
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 100,
          }}
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, formIsSubmitting]) => (
            <Button
              onClick={() => form.handleSubmit()}
              variant="contained"
              disabled={!canSubmit || isSubmitting || formIsSubmitting}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 120,
                boxShadow: theme.shadows[2],
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              {isSubmitting || formIsSubmitting
                ? editMode
                  ? 'Updating...'
                  : 'Creating...'
                : editMode
                  ? 'Update Role'
                  : 'Create Role'}
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>
    </Dialog>
  )
}

export default AddRoleDialog
