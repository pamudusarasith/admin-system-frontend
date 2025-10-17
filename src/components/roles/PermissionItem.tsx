import { Box, Checkbox, Typography, useTheme } from '@mui/material'
import type { Permission } from '@/api/permissions'

interface PermissionItemProps {
  readonly permission: Permission
  readonly isSelected: boolean
  readonly onToggle: (permissionName: string, checked: boolean) => void
}

export function PermissionItem({
  permission,
  isSelected,
  onToggle,
}: PermissionItemProps) {
  const theme = useTheme()

  return (
    <Box
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
        checked={isSelected}
        onChange={(e) => onToggle(permission.name, e.target.checked)}
        sx={{ mt: 0.5 }}
      />
      <Box sx={{ flex: 1, ml: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
  )
}
