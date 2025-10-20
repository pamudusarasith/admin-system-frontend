import { Box, Typography, useTheme } from '@mui/material'
import { AddButton } from '@/components'

interface UserHeaderProps {
  onAddUser?: () => void
}

export const UserHeader: React.FC<UserHeaderProps> = ({ onAddUser }) => {
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
          Users
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '1.1rem',
          }}
        >
          Manage user accounts, roles, and permissions.
        </Typography>
      </Box>
      {onAddUser && (
        <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>
          <AddButton
            label="Add new User"
            tooltip="Create a new user account"
            onClick={onAddUser}
          />
        </Box>
      )}
    </Box>
  )
}
