import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Container, Typography } from '@mui/material'
import type { Role } from '@/api'
import { deleteRole, getRoles } from '@/api'
import {
  AddRoleDialog,
  DeleteConfirmationBox,
  RoleActionMenu,
  RolesGrid,
  RolesHeader,
  RolesSearchFilter,
  SidebarLayout,
  ViewRoleDetails,
} from '@/components'

// We fetch user roles from backend using the getRoles function imported from '@/api'.
// This is called inside the loadRoles function, which is triggered in a useEffect when the component mounts.

export const Route = createFileRoute('/_authenticated/roles')({
  component: RolesPage,
})

function RolesPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRole, setMenuRole] = useState<Role | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [roleToView, setRoleToView] = useState<Role | null>(null)

  // TanStack Query for fetching roles
  const {
    data: rolesResponse,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const roles = rolesResponse?.data ?? []

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

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: Role) => {
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

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setEditMode(true)
    setOpenDialog(true)
    handleMenuClose()
  }

  const handleDeleteRole = (role: Role) => {
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

  const handleViewDetails = (role: Role) => {
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
            <Button
              variant="outlined"
              onClick={() => globalThis.location.reload()}
            >
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
        <RolesHeader onAddRole={handleAddRole} />

        {/* Search and Filter Section */}
        <RolesSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filteredRoles={filteredRoles}
        />

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
          <RolesGrid
            loading={loading}
            searchTerm={searchTerm}
            filteredRoles={filteredRoles}
            onViewDetails={handleViewDetails}
            onMenuOpen={handleMenuOpen}
          />
        </Box>

        {/* Action Menu */}
        <RoleActionMenu
          anchorEl={anchorEl}
          role={menuRole}
          onClose={handleMenuClose}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />

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
