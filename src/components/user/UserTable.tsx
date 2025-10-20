import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { ArrowUpwardSharp, Edit, MoreVert } from '@mui/icons-material'
import type { User } from '@/api'

interface UserTableProps {
  users: Array<User>
  isLoading: boolean
  emptyMessage?: string
  canUpdate?: boolean
  onEditUser?: (user: User) => void
  onMoreActions?: (user: User) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  emptyMessage = 'No users found.',
  canUpdate = false,
  onEditUser,
  onMoreActions,
}) => {
  const theme = useTheme()

  const generateAvatarUrl = (user: User) => {
    const initials = user.fullName
      ? user.fullName
          .split(' ')
          .map((name) => name[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : user.username.substring(0, 2).toUpperCase()
    return `https://placehold.co/40x40/3357FF/FFFFFF?text=${initials}`
  }

  return (
    <TableContainer
      sx={{
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.grey[100],
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[400],
          borderRadius: 4,
        },
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? theme.palette.grey[800]
                  : theme.palette.grey[100],
            }}
          >
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Name
                </Typography>
                <ArrowUpwardSharp
                  sx={{
                    fontSize: '1rem',
                    color: theme.palette.grey[600],
                  }}
                />
              </Box>
            </TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Phone
              </Typography>
            </TableCell>
            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Division
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Role
              </Typography>
            </TableCell>
            {canUpdate && (
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Actions
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={canUpdate ? 5 : 4} align="center" sx={{ py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading users...
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {!isLoading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={canUpdate ? 5 : 4} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            users.map((user: User) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      src={generateAvatarUrl(user)}
                      alt={user.fullName || user.username}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight="medium"
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        {user.fullName || user.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        {user.email || 'No email'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'block', md: 'none' },
                        }}
                      >
                        {user.phoneNumber || 'No phone'}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  {user.phoneNumber || 'No phone'}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  {user.division}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                {canUpdate && (
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => onEditUser?.(user)}
                      title="Edit user"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onMoreActions?.(user)}
                      title="More actions"
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
