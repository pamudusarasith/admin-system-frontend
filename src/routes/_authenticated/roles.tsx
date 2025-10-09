import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
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
  Support as SupportIcon,
} from '@mui/icons-material'
import type { Role } from '@/api'
import { deleteRole, getRoles } from '@/api'
import {
  AddButton,
  AddRoleDialog,
  DeleteConfirmationBox,
  SearchBar,
  SidebarLayout,
  ViewRoleDetails,
} from '@/components'

// We fetch user roles from backend using the getRoles function imported from '@/api'.
// This is called inside the loadRoles function, which is triggered in a useEffect when the component mounts.

export const Route = createFileRoute('/_authenticated/roles')({
  component: RolesPage,
})

interface UserRole extends Role {
  userCount: number
  icon: React.ReactNode
}

function RolesPage() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRole, setMenuRole] = useState<UserRole | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<UserRole | null>(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [roleToView, setRoleToView] = useState<UserRole | null>(null)

  // TanStack Query for fetching roles
  const {
    data: roles = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const rolesData = await getRoles()
      // Transform API roles to UserRole format with icons
      const rolesWithIcons: Array<UserRole> = rolesData.map((role) => ({
        ...role,
        userCount: role.userCount || 0,
        icon: getIconForRole(role.name),
      }))
      return rolesWithIcons
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      handleMenuClose()
    },
    onError: (e) => {
      console.error('Failed to delete role:', e)
    },
  })

  const getIconForRole = (roleName: string): React.ReactNode => {
    const name = roleName.toLowerCase()
    if (name.includes('admin')) return <AdminIcon />
    if (name.includes('manager')) return <BusinessIcon />
    if (name.includes('support')) return <SupportIcon />
    return <PersonIcon />
  }

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
    setEditMode(false)
    setOpenDialog(true)
  }

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role)
    setEditMode(true)
    setOpenDialog(true)
    handleMenuClose()
  }

  const handleDeleteRole = (role: UserRole) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return

    try {
      await deleteRoleMutation.mutateAsync(roleToDelete.id)
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    } catch (e) {
      console.error('Failed to delete role:', e)
      // Keep dialog open on error so user can retry
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRole(null)
    setEditMode(false)
  }

  const handleViewDetails = (role: UserRole) => {
    setRoleToView(role)
    setViewDetailsOpen(true)
  }

  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false)
    setRoleToView(null)
  }

  const handleRoleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Show error state if there's an error
  if (error) {
    return (
      <SidebarLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Unable to connect to server
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please make sure the backend server is running and try again.
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 3, display: 'block' }}
            >
              Error:{' '}
              {error instanceof Error ? error.message : 'An error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ['roles'] })
              }
              sx={{ mr: 2 }}
            >
              Retry Connection
            </Button>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </Box>
        </Container>
      </SidebarLayout>
    )
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
          {loading ? (
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
          ) : filteredRoles.length === 0 ? (
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
          ) : (
            filteredRoles.map((role) => (
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
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleViewDetails(role)}
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
            ))
          )}
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
        <AddRoleDialog
          open={openDialog}
          onClose={handleCloseDialog}
          editMode={editMode}
          initialData={
            selectedRole
              ? {
                  id: selectedRole.id,
                  name: selectedRole.name,
                  description: selectedRole.description,
                  permissions: selectedRole.permissions,
                }
              : undefined
          }
          onSuccess={handleRoleSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationBox
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
          itemName={roleToDelete?.name}
          message={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone and will affect ${roleToDelete?.userCount || 0} user(s).`}
          loading={deleteRoleMutation.isPending}
        />

        {/* View Role Details Dialog */}
        <ViewRoleDetails
          open={viewDetailsOpen}
          onClose={handleCloseViewDetails}
          role={roleToView}
        />
      </Container>
    </SidebarLayout>
  )
}
