import { Box, CircularProgress, Typography } from '@mui/material'
import { RoleCard } from './RoleCard'
import type { Role } from '@/api'

interface RolesGridProps {
  loading: boolean
  searchTerm: string
  filteredRoles: Array<Role>
  onViewDetails: (role: Role) => void
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, role: Role) => void
}

export function RolesGrid({
  loading,
  searchTerm,
  filteredRoles,
  onViewDetails,
  onMenuOpen,
}: RolesGridProps) {
  if (loading) {
    return (
      <Box
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
        }}
      >
        <CircularProgress size={48} />
      </Box>
    )
  }

  if (filteredRoles.length === 0) {
    return (
      <Box
        sx={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No roles found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {searchTerm
            ? 'Try adjusting your search criteria'
            : 'Create your first role to get started'}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {filteredRoles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          onViewDetails={onViewDetails}
          onMenuOpen={onMenuOpen}
        />
      ))}
    </>
  )
}
