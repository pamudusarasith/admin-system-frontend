import { useState } from 'react'
import {
  Box,
  Button,
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
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { RoleFormData } from '@/schemas'
import type { ApiResponse } from '@/api'
import type { PermissionCategory } from '@/api/permissions'
import { createRole, updateRole } from '@/api'
import { getPermissions } from '@/api/permissions'
import { roleFormDataSchema } from '@/schemas'
import { useSnackbar } from '@/components'

interface RoleDialogProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly role?: ({ id: string } & RoleFormData) | null
  readonly onSuccess?: () => void
}

export function RoleDialog({
  open,
  onClose,
  role,
  onSuccess,
}: RoleDialogProps) {
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  )

  const editMode = Boolean(role)

  // Fetch permissions from backend
  const {
    data: permissionsResponse,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000,
  })

  const permissionCategories = permissionsResponse?.data ?? []

  // Mutations for create and update
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: (response) => {
      const message = response.message?.trim() || 'Role created successfully.'
      showSnackbar({ message, severity: 'success' })
      onSuccess?.()
      handleClose()
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to create role. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, roleData }: { id: string; roleData: RoleFormData }) =>
      updateRole(id, roleData),
    onSuccess: (response) => {
      const message = response.message?.trim() || 'Role updated successfully.'
      showSnackbar({ message, severity: 'success' })
      onSuccess?.()
      handleClose()
    },
    onError: (error: AxiosError<ApiResponse<any>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to update role. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  // Form setup with TanStack Form
  const form = useForm({
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
    } as RoleFormData,
    validators: {
      onChange: roleFormDataSchema,
    },
    onSubmit: ({ value }) => {
      if (editMode && role) {
        updateRoleMutation.mutate({
          id: role.id,
          roleData: value,
        })
      } else {
        createRoleMutation.mutate(value)
      }
    },
  })

  const handleClose = () => {
    form.reset()
    setExpandedCategories(new Set())
    onClose()
  }

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const isSubmitting =
    createRoleMutation.isPending || updateRoleMutation.isPending

  // Get all permission names from a category including subcategories
  const getAllCategoryPermissions = (
    category: PermissionCategory,
  ): Array<string> => {
    const categoryPerms = category.permissions?.map((p) => p.name) || []
    const subPerms =
      category.subCategories?.flatMap(
        (sub) => sub.permissions?.map((p) => p.name) || [],
      ) || []
    return [...categoryPerms, ...subPerms]
  }

  // Check if all permissions in a category are selected
  const areAllPermissionsSelected = (
    category: PermissionCategory,
    selected: Array<string>,
  ): boolean => {
    return getAllCategoryPermissions(category).every((p) =>
      selected.includes(p),
    )
  }

  // Check if some (but not all) permissions are selected
  const areSomePermissionsSelected = (
    category: PermissionCategory,
    selected: Array<string>,
  ): boolean => {
    const all = getAllCategoryPermissions(category)
    return (
      all.some((p) => selected.includes(p)) &&
      !areAllPermissionsSelected(category, selected)
    )
  }

  // Toggle all permissions in a category
  const toggleCategoryPermissions = (
    category: PermissionCategory,
    current: Array<string>,
    onChange: (value: Array<string>) => void,
  ) => {
    const categoryPerms = getAllCategoryPermissions(category)

    if (areAllPermissionsSelected(category, current)) {
      onChange(current.filter((p) => !categoryPerms.includes(p)))
    } else {
      onChange([...new Set([...current, ...categoryPerms])])
    }
  }

  // Get button text based on state
  const getButtonText = () => {
    if (editMode) {
      return isSubmitting ? 'Updating...' : 'Update Role'
    }
    return isSubmitting ? 'Creating...' : 'Create Role'
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            {editMode ? 'Edit Role' : 'Add New Role'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Role Name Field */}
            <form.Field name="name">
              {(field) => (
                <TextField
                  fullWidth
                  label="Role Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  helperText={
                    field.state.meta.isTouched
                      ? field.state.meta.errors.join(', ')
                      : ''
                  }
                />
              )}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
              {(field) => (
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>

            {/* Permissions Field */}
            <form.Field name="permissions">
              {(field) => (
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Permissions *
                  </Typography>

                  {permissionsLoading && (
                    <Typography variant="body2" color="text.secondary">
                      Loading permissions...
                    </Typography>
                  )}

                  {!permissionsLoading && permissionsError && (
                    <Typography variant="body2" color="error">
                      Failed to load permissions.
                    </Typography>
                  )}

                  {!permissionsLoading && !permissionsError && (
                    <FormControl
                      component="fieldset"
                      error={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                      fullWidth
                    >
                      <Box
                        sx={{
                          maxHeight: '400px',
                          overflowY: 'auto',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          p: 2,
                        }}
                      >
                        <Stack spacing={3}>
                          {permissionCategories.map((category) => (
                            <Box
                              key={category.id}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                overflow: 'hidden',
                              }}
                            >
                              {/* Category Header */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  p: 1.5,
                                  bgcolor: 'background.default',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  },
                                  transition: 'background-color 0.2s',
                                }}
                                onClick={() => toggleCategory(category.id)}
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    transition: 'transform 0.2s',
                                    transform: expandedCategories.has(
                                      category.id,
                                    )
                                      ? 'rotate(90deg)'
                                      : 'rotate(0deg)',
                                  }}
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation()
                                    toggleCategory(category.id)
                                  }}
                                >
                                  {expandedCategories.has(category.id) ? (
                                    <ExpandMoreIcon />
                                  ) : (
                                    <ChevronRightIcon />
                                  )}
                                </IconButton>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={areAllPermissionsSelected(
                                        category,
                                        field.state.value,
                                      )}
                                      indeterminate={areSomePermissionsSelected(
                                        category,
                                        field.state.value,
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation()
                                        toggleCategoryPermissions(
                                          category,
                                          field.state.value,
                                          field.handleChange,
                                        )
                                      }}
                                    />
                                  }
                                  label={
                                    <Typography
                                      sx={{ fontWeight: 600, fontSize: '1rem' }}
                                    >
                                      {category.name}
                                    </Typography>
                                  }
                                  sx={{ m: 0, flex: 1 }}
                                  onClick={(e: React.MouseEvent) =>
                                    e.stopPropagation()
                                  }
                                />
                              </Box>

                              {/* Category Content */}
                              {expandedCategories.has(category.id) && (
                                <>
                                  <Divider />
                                  <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                    {category.permissions &&
                                      category.permissions.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                          <FormGroup>
                                            {category.permissions.map(
                                              (permission) => (
                                                <Box
                                                  key={permission.id}
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    py: 1.5,
                                                    px: 1.5,
                                                    mb: 1,
                                                    '&:hover': {
                                                      bgcolor: 'action.hover',
                                                    },
                                                    borderRadius: 1,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                  }}
                                                >
                                              <Checkbox
                                                checked={field.state.value.includes(
                                                  permission.name,
                                                )}
                                                onChange={(e) => {
                                                  const newValue = e.target
                                                    .checked
                                                    ? [
                                                        ...field.state.value,
                                                        permission.name,
                                                      ]
                                                    : field.state.value.filter(
                                                        (p) =>
                                                          p !== permission.name,
                                                      )
                                                  field.handleChange(newValue)
                                                }}
                                                sx={{ mt: 0.5 }}
                                              />
                                              <Box sx={{ flex: 1, ml: 1 }}>
                                                <Typography
                                                  variant="body2"
                                                  sx={{ fontWeight: 500 }}
                                                >
                                                  {permission.label}
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  color="text.secondary"
                                                  sx={{
                                                    display: 'block',
                                                    mt: 0.5,
                                                  }}
                                                >
                                                  {permission.description}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          ),
                                        )}
                                      </FormGroup>
                                    </Box>
                                  )}

                                  {/* Divider between direct permissions and subcategories */}
                                  {category.permissions &&
                                    category.permissions.length > 0 &&
                                    category.subCategories &&
                                    category.subCategories.length > 0 && (
                                      <Divider sx={{ my: 2 }} />
                                    )}

                                  {/* Sub Categories */}
                                  {category.subCategories?.map(
                                    (subCategory, idx) => (
                                      <Box key={subCategory.id}>
                                        {idx > 0 && <Divider sx={{ my: 2 }} />}
                                        <Box
                                          sx={{
                                            p: 1.5,
                                            bgcolor: 'action.hover',
                                            borderRadius: 1,
                                            mb: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600 }}
                                          >
                                            {subCategory.name}
                                          </Typography>
                                        </Box>
                                        {subCategory.permissions && (
                                          <FormGroup>
                                            {subCategory.permissions.map(
                                              (permission) => (
                                                <Box
                                                  key={permission.id}
                                                  sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    py: 1.5,
                                                    px: 1.5,
                                                    mb: 1,
                                                    '&:hover': {
                                                      bgcolor: 'action.hover',
                                                    },
                                                    borderRadius: 1,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                  }}
                                                >
                                                  <Checkbox
                                                    checked={field.state.value.includes(
                                                      permission.name,
                                                    )}
                                                    onChange={(e) => {
                                                      const newValue = e.target
                                                        .checked
                                                        ? [
                                                            ...field.state.value,
                                                            permission.name,
                                                          ]
                                                        : field.state.value.filter(
                                                            (p) =>
                                                              p !==
                                                              permission.name,
                                                          )
                                                      field.handleChange(
                                                        newValue,
                                                      )
                                                    }}
                                                    sx={{ mt: 0.5 }}
                                                  />
                                                  <Box sx={{ flex: 1, ml: 1 }}>
                                                    <Typography
                                                      variant="body2"
                                                      sx={{ fontWeight: 500 }}
                                                    >
                                                      {permission.label}
                                                    </Typography>
                                                    <Typography
                                                      variant="caption"
                                                      color="text.secondary"
                                                      sx={{
                                                        display: 'block',
                                                        mt: 0.5,
                                                      }}
                                                    >
                                                      {permission.description}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                              ),
                                            )}
                                          </FormGroup>
                                        )}
                                      </Box>
                                    ),
                                  )}
                                </Box>
                              </>
                            )}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                      {field.state.meta.isTouched &&
                        !field.state.meta.isValid && (
                          <Typography variant="caption" color="error">
                            {field.state.meta.errors.join(', ')}
                          </Typography>
                        )}
                    </FormControl>
                  )}
                </Box>
              )}
            </form.Field>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={() => form.handleSubmit()}
          variant="contained"
          disabled={isSubmitting}
        >
          {getButtonText()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
