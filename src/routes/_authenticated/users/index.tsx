import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Alert, Button, Container, Paper, useTheme } from '@mui/material'
import type { ApiResponse, User } from '@/api'
import type { UserSearchParams } from '@/schemas'
import { userSearchParamsSchema } from '@/schemas'
import {
  CreateUser,
  PaginationControls,
  SidebarLayout,
  UserHeader,
  UserSearchBar,
  UserTable,
} from '@/components'
import { getUsers } from '@/api'
import { Permission as P, useAuth } from '@/core'

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent,
  validateSearch: userSearchParamsSchema,
})

function RouteComponent() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { hasAuthority } = useAuth()
  const [open, setOpen] = useState(false)

  const searchParams = Route.useSearch()

  // Check permissions
  const canCreate = hasAuthority(P.userCreate)
  const canUpdate = hasAuthority(P.userUpdate)

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

  const users = response?.data ?? []
  const pagination = response?.pagination

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
      </Container>
    </SidebarLayout>
  )
}
