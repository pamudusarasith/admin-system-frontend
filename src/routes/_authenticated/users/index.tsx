import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Alert, Button, Container, Paper, useTheme } from '@mui/material'
import type { ApiResponse, User } from '@/api'
import type { UserSearchParams } from '@/schemas'
import { userSearchParamsSchema } from '@/schemas'
import {
  CreateUser,
  PaginationControls,
  SidebarLayout,
  UpdateUser,
  UserHeader,
  UserSearchBar,
  UserTable,
  useSnackbar,
} from '@/components'
import { deleteUser, getUsers, resetUserPassword } from '@/api'
import { Permission as P, useAuth } from '@/core'

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent,
  validateSearch: userSearchParamsSchema,
})

function RouteComponent() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { hasAuthority } = useAuth()
  const { showSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const searchParams = Route.useSearch()

  // Check permissions
  const canCreate = hasAuthority(P.userCreate)
  const canUpdate = hasAuthority(P.userUpdate)
  const canDelete = hasAuthority(P.userDelete)
  // Note: Reset password typically requires update permission
  const canResetPassword = hasAuthority(P.userUpdate)

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery<ApiResponse<Array<User>>>({
    queryKey: ['users', searchParams],
    queryFn: () => {
      const params: UserSearchParams = {
        ...searchParams,
        page: searchParams.page ? searchParams.page - 1 : undefined,
      }
      return getUsers({
        query: params.query,
        roleName: params.role,
        divisionName: params.division,
        page: params.page,
        pageSize: params.pageSize,
      })
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      showSnackbar({ message: 'User deleted successfully', severity: 'success' })
      refetch()
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to delete user'
      showSnackbar({ message, severity: 'error' })
    },
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (userId: number) => resetUserPassword(userId),
    onSuccess: () => {
      showSnackbar({ 
        message: 'Password reset successfully. User will need to set up their account again.', 
        severity: 'success' 
      })
      refetch()
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to reset password'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const users = response?.data ?? []
  const pagination = response?.pagination

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setUpdateOpen(true)
  }

  const handleCloseUpdate = () => {
    setUpdateOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = (user: User) => {
    deleteUserMutation.mutate(user.id)
  }

  const handleResetPassword = (user: User) => {
    resetPasswordMutation.mutate(user.id)
  }

  const handleSearch = (params: UserSearchParams) => {
    navigate({
      to: '/users',
      search: {
        ...params,
        page: undefined, // Reset to first page
      },
    })
  }

  const handleClearFilters = () => {
    navigate({
      to: '/users',
    })
  }

  const handlePageChange = (newPage?: number) => {
    navigate({
      to: '/users',
      search: {
        ...searchParams,
        page: newPage,
      },
    })
  }

  const handlePageSizeChange = (newPageSize?: number) => {
    navigate({
      to: '/users',
      search: {
        ...searchParams,
        page: undefined,
        pageSize: newPageSize,
      },
    })
  }

  const handleRefresh = () => {
    refetch()
  }

  const emptyMessage = searchParams.query || searchParams.role || searchParams.division
    ? 'No users found matching your filters.'
    : 'No users found.'

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <UserHeader onAddUser={canCreate ? handleOpen : undefined} />

        <Paper
          elevation={1}
          sx={{
            maxWidth: '1300px',
            mx: 'auto',
            p: 2,
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          }}
        >
          <UserSearchBar
            searchParams={searchParams}
            onSearch={handleSearch}
            onClear={handleClearFilters}
          />
        </Paper>

        {error && (
          <Alert
            severity="error"
            sx={{ maxWidth: '1300px', mx: 'auto', mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            Failed to load users.{' '}
            {error instanceof Error ? error.message : 'Please try again.'}
          </Alert>
        )}

        <Paper
          elevation={2}
          sx={{
            maxWidth: '1300px',
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <UserTable
            users={users}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            canUpdate={canUpdate}
            canDelete={canDelete}
            canResetPassword={canResetPassword}
            onEditUser={canUpdate ? handleEditUser : undefined}
            onDeleteUser={canDelete ? handleDeleteUser : undefined}
            onResetPassword={canResetPassword ? handleResetPassword : undefined}
          />

          {pagination && (
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </Paper>

        <CreateUser open={open} onClose={handleClose} />
        <UpdateUser
          open={updateOpen}
          onClose={handleCloseUpdate}
          user={selectedUser}
        />
      </Container>
    </SidebarLayout>
  )
}
