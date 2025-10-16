import { Box, Typography, useTheme } from '@mui/material'
import { AddButton } from '@/components'

interface RolesHeaderProps {
  onAddRole: () => void
}

export function RolesHeader({ onAddRole }: RolesHeaderProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        mb: 4,
        maxWidth: '1300px',
        mx: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          User Roles Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '1.1rem',
          }}
        >
          Manage user roles and permissions across your organization
        </Typography>
      </Box>

      <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>
        <AddButton
          label="Add Role"
          tooltip="Add a new user role"
          onClick={onAddRole}
        />
      </Box>
    </Box>
  )
}
