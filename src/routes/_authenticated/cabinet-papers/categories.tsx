import {
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

export const Route = createFileRoute('/_authenticated/cabinet-papers/categories')({
  component: CategoryPage,
})

function CategoryPage() {
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({
        queryKey: ['cabinet-paper-categories-search'],
      })
      showSnackbar({
        message: 'Category deleted successfully!',
        severity: 'success',
      })
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    },
    onError: (err: AxiosError<ApiResponse<any>>) => {
      const message =
        err.response?.data.message?.trim() ?? 'Failed to delete category'
      showSnackbar({ message, severity: 'error' })
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
    setEditingCategory(category || null)
    setIsCategoryDialogOpen(true)
  }

  const handleCloseCategoryDialog = () => {
    setIsCategoryDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return

    try {
      await deleteCategoryMutation.mutateAsync(String(categoryToDelete.id))
    } catch (e) {
      console.error('Error deleting category:', e)
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
          <Box sx={{ alignSelf: { xs: 'flex-start', md: 'flex-start' } }}>
            <AddButton
              label="Add new Category"
              tooltip="Add a new category"
              onClick={() => handleOpenCategoryDialog()}
            />
          </Box>
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
              <Box>
                <SearchBar
                  placeholder="Search categories by name or description..."
                  value={query}
                  onChange={setQuery}
                  onSearch={handleSearch}
                />
              </Box>
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
                    <TableCell sx={{ minWidth: 100 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No categories found. Click "Add new Category" to
                          create one.
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
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenCategoryDialog(category)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCategory(category)}
                            disabled={deleteCategoryMutation.isPending}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <Divider />
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
      </Container>
    </SidebarLayout>
  )
}
