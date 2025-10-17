import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PermissionsField } from './PermissionsField'
import { RoleDialogActions } from './RoleDialogActions'
import { RoleDialogHeader } from './RoleDialogHeader'
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
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
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
  const handleToggleAllCategory = (
    category: PermissionCategory,
    current: Array<string>,
  ) => {
    const categoryPerms = getAllCategoryPermissions(category)

    if (areAllPermissionsSelected(category, current)) {
      return current.filter((p) => !categoryPerms.includes(p))
    } else {
      return [...new Set([...current, ...categoryPerms])]
    }
  }

  // Handle individual permission toggle
  const addPermission = (
    permissionName: string,
    currentValue: Array<string>,
  ) => {
    return [...currentValue, permissionName]
  }

  const removePermission = (
    permissionName: string,
    currentValue: Array<string>,
  ) => {
    return currentValue.filter((p) => p !== permissionName)
  }

  const handlePermissionToggle = (
    permissionName: string,
    checked: boolean,
    currentValue: Array<string>,
  ) => {
    if (checked) {
      return addPermission(permissionName, currentValue)
    }
    return removePermission(permissionName, currentValue)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <RoleDialogHeader editMode={editMode} onClose={handleClose} />

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
                      ? field.state.meta.errors
                          .map((e) => e?.message)
                          .join(', ')
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
                  error={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  helperText={
                    field.state.meta.isTouched
                      ? field.state.meta.errors
                          .map((e) => e?.message)
                          .join(', ')
                      : ''
                  }
                />
              )}
            </form.Field>

            {/* Permissions Field */}
            <form.Field name="permissions">
              {(field) => (
                <PermissionsField
                  field={field}
                  permissionCategories={permissionCategories}
                  expandedCategories={expandedCategories}
                  onToggleCategory={toggleCategory}
                  onPermissionToggle={(permissionName, checked, currentValue) =>
                    field.handleChange(
                      handlePermissionToggle(
                        permissionName,
                        checked,
                        currentValue,
                      ),
                    )
                  }
                  onToggleAllCategory={(category, currentValue) =>
                    field.handleChange(
                      handleToggleAllCategory(category, currentValue),
                    )
                  }
                  areAllPermissionsSelected={areAllPermissionsSelected}
                  areSomePermissionsSelected={areSomePermissionsSelected}
                  isLoading={permissionsLoading}
                  hasError={Boolean(permissionsError)}
                />
              )}
            </form.Field>
          </Stack>
        </form>
      </DialogContent>

      <RoleDialogActions
        editMode={editMode}
        isSubmitting={isSubmitting}
        onClose={handleClose}
        onSubmit={() => form.handleSubmit()}
      />
    </Dialog>
  )
}
