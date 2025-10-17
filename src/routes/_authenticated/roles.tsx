import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Container, Typography } from '@mui/material'
import type { AxiosError } from 'axios'
import type { ApiResponse, Role } from '@/api'
import { deleteRole, getRoles } from '@/api'
import { roleSearchParamsSchema } from '@/schemas'
import {
  ConfirmationDialog,
  PaginationControls,
  RoleActionMenu,
  RoleDialog,
  RolesGrid,
  RolesHeader,
  RolesSearchFilter,
  SidebarLayout,
  ViewRoleDetails,
  useSnackbar,
} from '@/components'

export const Route = createFileRoute('/_authenticated/roles')({
  component: RolesPage,
  validateSearch: roleSearchParamsSchema,
})

function RolesPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const searchParams = Route.useSearch()

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuRole, setMenuRole] = useState<Role | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [roleToView, setRoleToView] = useState<Role | null>(null)

  // Get values from search params with defaults
  const query = searchParams.query ?? ''
  const page = searchParams.page ?? 0 // 0-indexed
  const pageSize = searchParams.pageSize ?? 10

  // TanStack Query for fetching roles
  const {
    data: rolesResponse,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['roles', query, page, pageSize],
    queryFn: () => getRoles({ query, page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const roles = rolesResponse?.data ?? []
  const pagination = rolesResponse?.pagination

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      const message = response.message?.trim() || 'Role deleted successfully.'
      showSnackbar({ message, severity: 'success' })
      handleMenuClose()
    },
    onError: (e: AxiosError<ApiResponse<any>>) => {
      const message =
        e.response?.data.message?.trim() ||
        'Failed to delete role. Please try again.'
      showSnackbar({ message, severity: 'error' })
      console.error('Failed to delete role:', e)
    },
  })

  const filteredRoles = roles

  const handlePageChange = (newPage?: number) => {
    if (newPage !== undefined) {
      navigate({
        to: '/roles',
        search: {
          ...searchParams,
          page: newPage - 1 || undefined, // Convert to 0-indexed, undefined if 0
        },
      })
    }
  }

  const handlePageSizeChange = (newPageSize?: number) => {
    if (newPageSize !== undefined) {
      navigate({
        to: '/roles',
        search: {
          ...searchParams,
          pageSize: newPageSize,
          page: undefined, // Reset to first page (0), don't show in URL
        },
      })
    }
  }

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
    setOpenDialog(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
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
    navigate({
      to: '/roles',
      search: {
        ...searchParams,
        query: value || undefined,
        page: undefined, // Reset to first page (0), don't show in URL
      },
    })
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
          searchTerm={query}
          onSearchChange={(value) =>
            navigate({
              to: '/roles',
              search: { ...searchParams, query: value || undefined },
            })
          }
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
            searchTerm={query}
            filteredRoles={filteredRoles}
            onViewDetails={handleViewDetails}
            onMenuOpen={handleMenuOpen}
          />
        </Box>

        {/* Pagination Controls */}
        {pagination && (
          <Box sx={{ maxWidth: '1300px', mx: 'auto', mt: 4 }}>
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </Box>
        )}

        {/* Action Menu */}
        <RoleActionMenu
          anchorEl={anchorEl}
          role={menuRole}
          onClose={handleMenuClose}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />

        {/* Add/Edit Role Dialog */}
        <RoleDialog
          open={openDialog}
          onClose={handleCloseDialog}
          role={
            selectedRole
              ? {
                  id: selectedRole.id,
                  name: selectedRole.name,
                  description: selectedRole.description,
                  permissions: selectedRole.permissions,
                }
              : null
          }
          onSuccess={handleRoleSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
          message={
            roleToDelete
              ? `Are you sure you want to delete the role "${roleToDelete.name}"? This action cannot be undone and will affect ${roleToDelete.userCount || 0} user(s).`
              : 'Are you sure you want to delete this role?'
          }
          confirmText="Delete"
          cancelText="Cancel"
          variant="error"
          danger
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
