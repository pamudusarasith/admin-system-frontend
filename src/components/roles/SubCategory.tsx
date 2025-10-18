import { Box, Divider, FormGroup, Typography } from '@mui/material'
import { PermissionItem } from './PermissionItem'
import type { PermissionCategory } from '@/api/permissions'

interface SubCategoryProps {
  readonly subCategory: PermissionCategory
  readonly selectedPermissions: Array<string>
  readonly onPermissionToggle: (
    permissionName: string,
    checked: boolean,
  ) => void
  readonly showDivider: boolean
}

export function SubCategory({
  subCategory,
  selectedPermissions,
  onPermissionToggle,
  showDivider,
}: SubCategoryProps) {
  return (
    <Box>
      {showDivider && <Divider sx={{ my: 2 }} />}
      <Box
        sx={{
          p: 1.5,
          bgcolor: 'action.hover',
          borderRadius: 1,
          mb: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {subCategory.name}
        </Typography>
      </Box>
      {subCategory.permissions && (
        <FormGroup>
          {subCategory.permissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permission={permission}
              isSelected={selectedPermissions.includes(permission.name)}
              onToggle={onPermissionToggle}
            />
          ))}
        </FormGroup>
      )}
    </Box>
  )
}
