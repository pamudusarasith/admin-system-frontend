import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { RoleFormData } from '@/schemas'
import { roleFormDataSchema } from '@/schemas'
import { createRole, updateRole } from '@/api'
import { getPermissions, type PermissionCategory } from '@/api/permissions'
import { useSnackbar } from '@/components'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface AddRoleDialogProps {
  open: boolean
  onClose: () => void
  editMode?: boolean
  initialData?: { id: string } & RoleFormData
  onSuccess?: () => void
}


export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onClose,
  editMode = false,
  initialData,
  onSuccess,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { showSnackbar } = useSnackbar()

  // Fetch permissions from backend
  const {
    data: permissionCategories = [],
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000,
  })

  // Mutations for create and update
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: (data: any) => {
      showSnackbar({ message: data?.message || 'Role created Successfully.', severity: 'success' })
      onSuccess?.()
      handleClose()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message?.trim() || error?.message || 'An unexpected error occurred. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, roleData }: { id: string; roleData: RoleFormData }) =>
      updateRole(id, roleData),
    onSuccess: (data: any) => {
      showSnackbar({ message: data?.message || 'Role updated successfully.', severity: 'success' })
      onSuccess?.()
      handleClose()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message?.trim() || error?.message || 'An unexpected error occurred. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

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
    onSubmit: ({ value }) => {
      if (editMode && initialData) {
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

  const [descPopover, setDescPopover] = React.useState<{ anchorEl: HTMLElement | null; desc: string }>({
    anchorEl: null,
    desc: '',
  })

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
                      helperText={field.state.meta.errors
                        .map((err: any) => err.message)
                        .join(', ')}
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
                      helperText={field.state.meta.errors
                        .map((err: any) => err.message)
                        .join(', ')}
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

                      {permissionsLoading ? (
                        <Typography variant="body2" color="text.secondary">
                          Loading permissions...
                        </Typography>
                      ) : permissionsError ? (
                        <Typography variant="body2" color="error">
                          Failed to load permissions.
                        </Typography>
                      ) : (
                        <FormControl
                          component="fieldset"
                          variant="standard"
                          error={!field.state.meta.isValid}
                        >
                          <FormGroup>
                            <Stack spacing={3}>
                              {permissionCategories.map((category, catIdx) => (
                                <React.Fragment key={category.id}>
                                  {catIdx > 0 && <Divider sx={{ my: 2 }} />}
                                  <Box sx={{ mb: 2 }}>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        mb: 1,
                                      }}
                                    >
                                      {category.name}
                                    </Typography>
                                    {category.subCategories.map((sub, subIdx) => (
                                      <React.Fragment key={sub.id}>
                                        {subIdx > 0 && (
                                          <Divider
                                            orientation="horizontal"
                                            flexItem
                                            sx={{ my: 1, ml: 2 }}
                                          />
                                        )}
                                        <Box sx={{ mb: 1, ml: 2 }}>
                                          <Typography
                                            variant="subtitle2"
                                            sx={{
                                              fontWeight: 600,
                                              color: theme.palette.text.secondary,
                                              mb: 1,
                                            }}
                                          >
                                            {sub.name}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: 'grid',
                                              gridTemplateColumns: {
                                                xs: '1fr',
                                                sm: '1fr',
                                                md: '1fr 1fr',
                                                lg: '1fr 1fr 1fr',
                                              },
                                              gap: 2,
                                              p: 1,
                                            }}
                                          >
                                            {sub.permissions.map((permission) => (
                                              <FormControlLabel
                                                key={permission.id}
                                                control={
                                                  <Checkbox
                                                    checked={field.state.value.includes(
                                                      permission.name,
                                                    )}
                                                    onChange={(event) => {
                                                      const newPermissions = event
                                                        .target.checked
                                                        ? [
                                                            ...field.state.value,
                                                            permission.name,
                                                          ]
                                                        : field.state.value.filter(
                                                            (id) =>
                                                              id !==
                                                              permission.name,
                                                          )
                                                      field.handleChange(
                                                        newPermissions,
                                                      )
                                                    }}
                                                    sx={{
                                                      '&.Mui-checked': {
                                                        color:
                                                          theme.palette.primary
                                                            .main,
                                                      },
                                                    }}
                                                  />
                                                }
                                                label={
                                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        fontWeight: 500,
                                                        color:
                                                          theme.palette.text
                                                            .primary,
                                                      }}
                                                    >
                                                      {permission.label}
                                                    </Typography>
                                                    <IconButton
                                                      size="small"
                                                      sx={{ ml: 0.5, p: 0.5 }}
                                                      onClick={e => setDescPopover({ anchorEl: e.currentTarget, desc: permission.description || '' })}
                                                      aria-label="Show permission description"
                                                    >
                                                      <InfoOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                  </Box>
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
                                      </React.Fragment>
                                    ))}
                                  </Box>
                                </React.Fragment>
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
                                {field.state.meta.errors
                                  .map((err: any) => err.message)
                                  .join(', ')}
                              </Typography>
                            )}
                        </FormControl>
                      )}
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

      <Popover
        open={Boolean(descPopover.anchorEl)}
        anchorEl={descPopover.anchorEl}
        onClose={() => setDescPopover({ anchorEl: null, desc: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1, maxWidth: 220 } }}
      >
        <Typography variant="caption">{descPopover.desc}</Typography>
      </Popover>
    </Dialog>
  )
}

export default AddRoleDialog
