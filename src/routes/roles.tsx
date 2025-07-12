import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material'
import { AddButton, SearchBar, SidebarLayout } from '@/components'

export const Route = createFileRoute('/roles')({
  component: RolesPage,
})

interface UserRole {
  id: string
  name: string
  description: string
  userCount: number
  permissions: Array<string>
  icon: React.ReactNode
  createdDate: string
  isActive: boolean
}

// Mock data for user roles
const mockRoles: Array<UserRole> = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all administrative privileges',
    userCount: 2,
    permissions: ['ALL_PERMISSIONS'],
    icon: <AdminIcon />,
    createdDate: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Administrative access to manage users and system settings',
    userCount: 5,
    permissions: ['USER_MANAGEMENT', 'SYSTEM_SETTINGS', 'REPORTS'],
    icon: <SecurityIcon />,
    createdDate: '2024-01-20',
    isActive: true,
  },
  {
    id: '3',
    name: 'Manager',
    description: 'Manage team members and view departmental reports',
    userCount: 12,
    permissions: ['TEAM_MANAGEMENT', 'REPORTS', 'APPROVAL'],
    icon: <BusinessIcon />,
    createdDate: '2024-02-01',
    isActive: true,
  },
  {
    id: '4',
    name: 'Employee',
    description: 'Standard user access with basic system functionality',
    userCount: 156,
    permissions: ['BASIC_ACCESS', 'PROFILE_EDIT'],
    icon: <PersonIcon />,
    createdDate: '2024-02-10',
    isActive: true,
  },
  {
    id: '5',
    name: 'Support Agent',
    description: 'Customer support access with ticket management',
    userCount: 8,
    permissions: ['TICKET_MANAGEMENT', 'CUSTOMER_VIEW'],
    icon: <SupportIcon />,
    createdDate: '2024-02-15',
    isActive: true,
  },
  {
    id: '6',
    name: 'Viewer',
    description: 'Read-only access to reports and system information',
    userCount: 23,
    permissions: ['READ_ONLY'],
    icon: <PeopleIcon />,
    createdDate: '2024-03-01',
    isActive: false,
  },
]

function RolesPage() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [roles, setRoles] = useState<Array<UserRole>>(mockRoles)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRole, setMenuRole] = useState<UserRole | null>(null)

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    role: UserRole,
  ) => {
    setAnchorEl(event.currentTarget)
    setMenuRole(role)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuRole(null)
  }

  const handleAddRole = () => {
    setSelectedRole(null)
    setOpenDialog(true)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role)
    setOpenDialog(true)
    handleMenuClose()
  }

  const handleDeleteRole = (role: UserRole) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id))
    handleMenuClose()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRole(null)
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
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

          {/* Add Role Button - Now positioned on the right */}
          <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>
            <AddButton
              label="Add Role"
              tooltip="Add a new user role"
              onClick={handleAddRole}
            />
          </Box>
        </Box>

        {/* Search and Filter Section */}
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
              {/* Search Bar */}
              <Box>
                <SearchBar
                  placeholder="Search letters by title, content, or category..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onSearch={handleSearch}
                />
              </Box>
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
                label={`${filteredRoles.reduce((sum, role) => sum + role.userCount, 0)} Total Users`}
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Roles Grid */}
        <Box
          sx={{
            maxWidth: '1300px',
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 6,
          }}
        >
          {filteredRoles.map((role) => (
            <Card
              key={role.id}
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
              {/* Role Status Badge */}
              <Chip
                label={role.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={role.isActive ? 'success' : 'default'}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 1,
                }}
              />

              <CardContent sx={{ p: 3, pb: 1 }}>
                {/* Role Header */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {role.icon}
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
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.85rem',
                      }}
                    >
                      Created: {new Date(role.createdDate).toLocaleDateString()}
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
                      {role.userCount}
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

                {/* Permissions Preview */}
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                      mb: 1,
                      display: 'block',
                    }}
                  >
                    KEY PERMISSIONS:
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: 'wrap', gap: 0.5 }}
                  >
                    {role.permissions.slice(0, 2).map((permission) => (
                      <Chip
                        key={permission}
                        label={permission.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                        }}
                      />
                    ))}
                    {role.permissions.length > 2 && (
                      <Chip
                        label={`+${role.permissions.length - 2} more`}
                        size="small"
                        variant="filled"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: `${theme.palette.primary.main}20`,
                          color: theme.palette.primary.main,
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
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
                  onClick={(e) => handleMenuOpen(e, role)}
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
          ))}
        </Box>

        {/* Floating Add Button */}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => menuRole && handleEditRole(menuRole)}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit Role
          </MenuItem>
          <MenuItem onClick={() => menuRole && handleDeleteRole(menuRole)}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete Role
          </MenuItem>
        </Menu>

        {/* Add/Edit Role Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle>
            {selectedRole ? 'Edit Role' : 'Add New Role'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              {selectedRole
                ? 'Modify the role details and permissions.'
                : 'Create a new user role with specific permissions.'}
            </Typography>
            {/* Add form fields here for role creation/editing */}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleCloseDialog}>
              {selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </SidebarLayout>
  )
}
