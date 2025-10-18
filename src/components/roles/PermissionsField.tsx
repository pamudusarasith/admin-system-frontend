import { Box, FormControl, Stack, Typography, useTheme } from '@mui/material'
import { PermissionCategoryBox } from './PermissionCategoryBox'
import type { PermissionCategory } from '@/api/permissions'

interface PermissionsFieldProps {
  readonly field: any
  readonly permissionCategories: Array<PermissionCategory>
  readonly expandedCategories: Set<number>
  readonly onToggleCategory: (categoryId: number) => void
  readonly onPermissionToggle: (
    permissionName: string,
    checked: boolean,
    currentValue: Array<string>,
  ) => void
  readonly onToggleAllCategory: (
    category: PermissionCategory,
    currentValue: Array<string>,
  ) => void
  readonly areAllPermissionsSelected: (
    category: PermissionCategory,
    selected: Array<string>,
  ) => boolean
  readonly areSomePermissionsSelected: (
    category: PermissionCategory,
    selected: Array<string>,
  ) => boolean
  readonly isLoading: boolean
  readonly hasError: boolean
}

export function PermissionsField({
  field,
  permissionCategories,
  expandedCategories,
  onToggleCategory,
  onPermissionToggle,
  onToggleAllCategory,
  areAllPermissionsSelected,
  areSomePermissionsSelected,
  isLoading,
  hasError,
}: PermissionsFieldProps) {
  const theme = useTheme()

  if (isLoading) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Permissions *
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading permissions...
        </Typography>
      </Box>
    )
  }

  if (hasError) {
    return (
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Permissions *
        </Typography>
        <Typography variant="body2" color="error">
          Failed to load permissions.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Permissions *
      </Typography>

      <FormControl
        component="fieldset"
        error={field.state.meta.isTouched && !field.state.meta.isValid}
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
              <PermissionCategoryBox
                key={category.id}
                category={category}
                isExpanded={expandedCategories.has(category.id)}
                selectedPermissions={field.state.value}
                onToggleExpand={() => onToggleCategory(category.id)}
                onToggleAll={() =>
                  onToggleAllCategory(category, field.state.value)
                }
                onPermissionToggle={(permissionName, checked) =>
                  onPermissionToggle(permissionName, checked, field.state.value)
                }
                areAllPermissionsSelected={areAllPermissionsSelected}
                areSomePermissionsSelected={areSomePermissionsSelected}
              />
            ))}
          </Stack>
        </Box>
        {field.state.meta.isTouched && !field.state.meta.isValid && (
          <Typography variant="caption" color="error">
            {field.state.meta.errors.join(', ')}
          </Typography>
        )}
      </FormControl>
    </Box>
  )
}
