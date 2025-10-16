import { Box, Chip, Paper, useTheme } from '@mui/material'
import { People as PeopleIcon, Person as PersonIcon } from '@mui/icons-material'
import type { Role } from '@/api'
import { SearchBar } from '@/components'

interface RolesSearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearch: (value: string) => void
  filteredRoles: Array<Role>
}

export function RolesSearchFilter({
  searchTerm,
  onSearchChange,
  onSearch,
  filteredRoles,
}: RolesSearchFilterProps) {
  const theme = useTheme()

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: '1300px',
        mx: 'auto',
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          <SearchBar
            placeholder="Search roles by name or description..."
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<PeopleIcon />}
            label={`${filteredRoles.length} Roles`}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<PersonIcon />}
            label={`${filteredRoles.reduce((sum, role) => sum + (role.userCount ?? 0), 0)} Total Users`}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </Box>
    </Paper>
  )
}
