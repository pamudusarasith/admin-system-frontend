import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import { createFileRoute } from '@tanstack/react-router'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { Category } from '@/api/categories'
import type { ApiResponse } from '@/api'
import {
  AddButton,
  CategoryDialog,
  ConfirmationDialog,
  PaginationControls,
  SearchBar,
  SidebarLayout,
  useSnackbar,
} from '@/components'
import { deleteCategory, getCategories } from '@/api/categories'
import { Permission as P, useAuth } from '@/core'

export const Route = createFileRoute(
  '/_authenticated/cabinet-papers/categories',
)({
  component: CategoryPage,
})

function CategoryPage() {
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()
  const { hasAuthority } = useAuth()
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  )
  const queryClient = useQueryClient()

  // Check permissions
  const canRead = hasAuthority(P.categoryRead)
  const canCreate = hasAuthority(P.categoryCreate)
  const canUpdate = hasAuthority(P.categoryUpdate)
  const canDelete = hasAuthority(P.categoryDelete)

  // If user doesn't have read permission, show access denied
  if (!canRead) {
    return (
      <SidebarLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ maxWidth: '1300px', mx: 'auto' }}>
            You don't have permission to view categories. Please contact your
            administrator.
          </Alert>
        </Container>
      </SidebarLayout>
    )
  }

  // React Query to fetch categories with search and pagination
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories', query, page, pageSize],
    queryFn: () => getCategories({ query, page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: canRead, // Only fetch if user has read permission
  })

  const categories = response?.data ?? []
  const pagination = response?.pagination

  // Show error snackbar when query fails
  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? 'Failed to load categories')
          : 'Failed to load categories'
      showSnackbar({ message: errorMessage, severity: 'error' })
    }
  }, [isError, error, showSnackbar])

  // Mutation for deleting categories
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({
        queryKey: ['cabinet-paper-categories-search'],
      })

      // Extract success message from response
      const successMessage =
        response?.message ||
        response?.data?.message ||
        'Category deleted successfully!'

      showSnackbar({
        message: successMessage,
        severity: 'success',
      })

      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      console.error('Failed to delete category:', error)

      // Extract error message from response
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete category. Please try again.'

      showSnackbar({
        message: errorMessage,
        severity: 'error',
      })
    },
  })

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(0) // Reset to first page on search
  }

  const handlePageChange = (newPage?: number) => {
    if (newPage !== undefined) {
      setPage(newPage - 1) // Convert to 0-indexed
    }
  }

  const handlePageSizeChange = (newPageSize?: number) => {
    if (newPageSize !== undefined) {
      setPageSize(newPageSize)
      setPage(0) // Reset to first page when changing page size
    }
  }

  const handleOpenCategoryDialog = (category?: Category) => {
    // Check permission before opening dialog
    if (category && !canUpdate) {
      showSnackbar({
        message: "You don't have permission to edit categories",
        severity: 'error',
      })
      return
    }
    if (!category && !canCreate) {
      showSnackbar({
        message: "You don't have permission to create categories",
        severity: 'error',
      })
      return
    }
    setEditingCategory(category || null)
    setIsCategoryDialogOpen(true)
  }

  const handleCloseCategoryDialog = () => {
    setIsCategoryDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (category: Category) => {
    if (!canDelete) {
      showSnackbar({
        message: "You don't have permission to delete categories",
        severity: 'error',
      })
      return
    }
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete || !canDelete) return

    try {
      await deleteCategoryMutation.mutateAsync(String(categoryToDelete.id))
    } catch (error) {
      // Error is already handled in mutation onError
      console.error('Error deleting category:', error)
    }
  }

  const cancelDeleteCategory = () => {
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
              Categories
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
              }}
            >
              View and manage categories for organizing your content.
            </Typography>
          </Box>
          {canCreate && (
            <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>
              <AddButton
                label="Add new Category"
                tooltip="Add a new category"
                onClick={() => handleOpenCategoryDialog()}
              />
            </Box>
          )}
        </Box>

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
                placeholder="Search categories by name or description..."
                value={query}
                onChange={setQuery}
                onSearch={handleSearch}
              />
            </Box>
          </Box>
        </Paper>

        {/* Loading or Table */}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
              maxWidth: '1300px',
              mx: 'auto',
            }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : (
          <Paper
            elevation={3}
            sx={{
              maxWidth: '1300px',
              mx: 'auto',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 0,
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
              <Table
                sx={{ minWidth: { xs: 800, sm: 650 } }}
                aria-label="categories table"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? theme.palette.grey[800]
                          : theme.palette.grey[100],
                    }}
                  >
                    <TableCell sx={{ minWidth: 200 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          Category Name
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', md: 'table-cell' },
                        minWidth: 300,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        Description
                      </Typography>
                    </TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell sx={{ minWidth: 100 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Actions
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={canUpdate || canDelete ? 3 : 2}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No categories found.{' '}
                          {canCreate &&
                            'Click "Add new Category" to create one.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category: Category) => (
                      <TableRow
                        key={category.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell sx={{ minWidth: 200 }}>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight="medium"
                              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                              {category.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                display: { xs: 'block', md: 'none' },
                                lineHeight: 1.5,
                                mt: 0.5,
                              }}
                            >
                              {category.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ display: { xs: 'none', md: 'table-cell' } }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                            {category.description}
                          </Typography>
                        </TableCell>
                        {(canUpdate || canDelete) && (
                          <TableCell align="right">
                            {canUpdate && (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleOpenCategoryDialog(category)
                                }
                                title="Edit Category"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                            {canDelete && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteCategory(category)}
                                disabled={deleteCategoryMutation.isPending}
                                title="Delete Category"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {pagination && (
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </Paper>
        )}

        {/* Category Dialog */}
        <CategoryDialog
          open={isCategoryDialogOpen}
          onClose={handleCloseCategoryDialog}
          category={editingCategory}
        />

        {/* Delete Confirmation Dialog */}
        {canDelete && (
          <ConfirmationDialog
            open={deleteDialogOpen}
            onClose={cancelDeleteCategory}
            onConfirm={confirmDeleteCategory}
            title="Delete Category"
            message={
              categoryToDelete
                ? `Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`
                : 'Are you sure you want to delete this category?'
            }
            confirmText="Delete"
            cancelText="Cancel"
            variant="error"
            danger
            loading={deleteCategoryMutation.isPending}
          />
        )}
      </Container>
    </SidebarLayout>
  )
}
