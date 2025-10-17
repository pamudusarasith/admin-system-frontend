import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import type { Role } from '@/api'

interface RoleCardProps {
  role: Role
  onViewDetails: (role: Role) => void
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, role: Role) => void
}

export function RoleCard({
  role,
  onViewDetails,
  onMenuOpen,
}: Readonly<RoleCardProps>) {
  const theme = useTheme()

  return (
    <Card
      elevation={4}
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 30px ${theme.palette.primary.main}20`,
        },
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 3, pb: 1 }}>
        {/* Role Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon fontSize="medium" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              {role.name}
            </Typography>
          </Box>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
            lineHeight: 1.5,
            minHeight: 40,
          }}
        >
          {role.description}
        </Typography>

        {/* Stats */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              {role.userCount ?? 0}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Users
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              {role.permissions.length}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Permissions
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => onViewDetails(role)}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: `${theme.palette.primary.main}10`,
            },
          }}
        >
          View Details
        </Button>
        <IconButton
          onClick={(e) => onMenuOpen(e, role)}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: `${theme.palette.primary.main}10`,
              color: theme.palette.primary.main,
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
