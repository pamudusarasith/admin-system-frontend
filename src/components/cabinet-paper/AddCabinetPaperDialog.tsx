import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse, CabinetPaperCategory } from '@/api'
import type { CabinetPaperFormData } from '@/schemas'
import { FileUploadField, useSnackbar } from '@/components'
import { createCabinetPaper, getCategories } from '@/api'
import { cabinetPaperFormDataSchema, cabinetPaperStatusEnum } from '@/schemas'

interface AddCabinetPaperDialogProps {
  open: boolean
  onClose: () => void
}

const PAGE_SIZE = 10

interface CategoryOption extends CabinetPaperCategory {
  readonly highlight?: string
}

export const AddCabinetPaperDialog: React.FC<AddCabinetPaperDialogProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null)

  useEffect(() => {
    if (!open) {
      setSearchTerm('')
      setDebouncedSearch('')
      setAutocompleteOpen(false)
      setSelectedCategory(null)
    }
  }, [open])

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)

    return () => globalThis.clearTimeout(timer)
  }, [searchTerm])

  // Fetch categories with infinite query
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['cabinet-paper-categories-search', debouncedSearch],
    queryFn: ({ pageParam = 0 }) =>
      getCategories({
        query: debouncedSearch || undefined,
        page: pageParam,
        pageSize: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination
      if (!pagination) return undefined
      const nextPage = pagination.page + 1
      return nextPage < pagination.totalPages ? nextPage : undefined
    },
    initialPageParam: 0,
    enabled: open && autocompleteOpen,
    staleTime: 5 * 60 * 1000,
  })

  const categoryOptions: Array<CategoryOption> = useMemo(() => {
    return (
      categoriesData?.pages
        .flatMap((page) => page.data ?? [])
        .map((category) => ({
          ...category,
          highlight: debouncedSearch,
        })) ?? []
    )
  }, [categoriesData, debouncedSearch])

  const handleListboxScroll = useCallback(
    (event: React.SyntheticEvent) => {
      const listboxNode = event.currentTarget as HTMLElement

      const scrollThreshold =
        listboxNode.scrollHeight - listboxNode.clientHeight
      const currentScroll = listboxNode.scrollTop

      if (
        currentScroll >= scrollThreshold - 64 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        void fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  )

  const createCabinetPaperMutation = useMutation({
    mutationFn: (paperFormData: CabinetPaperFormData) => {
      return createCabinetPaper(paperFormData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cabinet-papers'] })
      handleClose()
      showSnackbar({
        message: data.message?.trim() || 'Cabinet paper created successfully!',
        severity: 'success',
      })
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'An unexpected error occurred. Please try again.'
      showSnackbar({
        message,
        severity: 'error',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      referenceId: '',
      subject: '',
      summary: '',
      categoryId: 0,
      status: 'DRAFT' as const,
      attachments: [] as Array<File>,
    } as CabinetPaperFormData,
    onSubmit: ({ value }) => {
      createCabinetPaperMutation.mutate(value)
    },
    validators: {
      onChange: cabinetPaperFormDataSchema,
    },
  })

  // Sync selectedCategory with form field
  useEffect(() => {
    if (selectedCategory) {
      form.setFieldValue('categoryId', selectedCategory.id)
    }
  }, [selectedCategory, form])

  const handleClose = () => {
    form.reset()
    setSelectedCategory(null)
    setSearchTerm('')
    setAutocompleteOpen(false)
    onClose()
  }

  const loading = isLoadingCategories || isFetchingNextPage

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          },
        },
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
              }}
            >
              <ArticleIcon
                sx={{
                  fontSize: 28,
                  color: 'primary.main',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Create Cabinet Paper
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.error.main,
                backgroundColor: `${theme.palette.error.main}10`,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 0,
              background: 'transparent',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Reference ID */}
                <form.Field name="referenceId">
                  {(field) => (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        Reference ID *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="e.g., CP-2025-001"
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                        helperText={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                                .map((e) => e?.message)
                                .join(', ')
                            : ''
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </form.Field>

                {/* Subject */}
                <form.Field name="subject">
                  {(field) => (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        Subject *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter cabinet paper subject..."
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                        helperText={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                                .map((e) => e?.message)
                                .join(', ')
                            : ''
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </form.Field>

                {/* Summary */}
                <form.Field name="summary">
                  {(field) => (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        Summary
                      </Typography>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter a brief summary of the cabinet paper..."
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                        helperText={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                                .map((e) => e?.message)
                                .join(', ')
                            : ''
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </form.Field>

                {/* Category and Status Row */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    // make children (category + status) equal width on sm+ and full width on xs
                    '& > *': {
                      flex: { xs: '0 0 100%', sm: '1 1 0' },
                    },
                  }}
                >
                  {/* Category */}
                  <form.Field name="categoryId">
                    {(field) => (
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          Category *
                        </Typography>
                        <Autocomplete
                          open={autocompleteOpen}
                          onOpen={() => setAutocompleteOpen(true)}
                          onClose={() => setAutocompleteOpen(false)}
                          options={categoryOptions}
                          loading={loading}
                          inputValue={searchTerm}
                          value={selectedCategory}
                          onChange={(_event, value) => {
                            setSelectedCategory(value)
                            if (value) {
                              setAutocompleteOpen(false)
                            }
                          }}
                          onInputChange={(_event, value, reason) => {
                            if (reason === 'reset') return
                            setSearchTerm(value)
                          }}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          filterOptions={(options) => options}
                          noOptionsText={
                            debouncedSearch
                              ? 'No categories match your search.'
                              : 'No categories available.'
                          }
                          slotProps={{
                            listbox: {
                              sx: {
                                maxHeight: 280,
                                '&::-webkit-scrollbar': {
                                  width: 8,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  borderRadius: 4,
                                  backgroundColor: `${theme.palette.primary.main}44`,
                                },
                              },
                              onScroll: handleListboxScroll,
                            },
                          }}
                          renderInput={(params) => {
                            const { InputProps: inputProps, ...restParams } =
                              params

                            return (
                              <TextField
                                {...restParams}
                                placeholder="Type to search categories..."
                                fullWidth
                                error={
                                  !field.state.meta.isValid &&
                                  field.state.meta.isTouched
                                }
                                helperText={
                                  field.state.meta.isTouched
                                    ? field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(', ')
                                    : ''
                                }
                                slotProps={{
                                  input: {
                                    ...inputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {loading ? (
                                          <CircularProgress
                                            color="primary"
                                            size={20}
                                          />
                                        ) : null}
                                        {inputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  },
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                  },
                                }}
                              />
                            )
                          }}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              {...props}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                py: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 2,
                                  backgroundColor: `${theme.palette.primary.main}14`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CategoryIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {option.name}
                                </Typography>
                                {option.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                  >
                                    {option.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          )}
                        />
                      </Box>
                    )}
                  </form.Field>

                  {/* Status */}
                  <form.Field name="status">
                    {(field) => (
                      <FormControl
                        fullWidth
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          Status *
                        </Typography>
                        <Select
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(e.target.value as any)
                          }
                          onBlur={field.handleBlur}
                          sx={{
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          {cabinetPaperStatusEnum.options.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.replaceAll('_', ' ')}
                            </MenuItem>
                          ))}
                        </Select>
                        {!field.state.meta.isValid &&
                          field.state.meta.isTouched && (
                            <FormHelperText>
                              {field.state.meta.errors
                                .map((e) => e?.message)
                                .join(', ')}
                            </FormHelperText>
                          )}
                      </FormControl>
                    )}
                  </form.Field>
                </Stack>

                {/* File Attachments */}
                <form.Field name="attachments" mode="array">
                  {(field) => (
                    <FileUploadField
                      field={{
                        ...field,
                        state: {
                          ...field.state,
                          value: field.state.value || [],
                        },
                      }}
                      label="Attachments"
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg'],
                        'application/pdf': ['.pdf'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                          ['.docx'],
                        'text/plain': ['.txt'],
                      }}
                      maxSize={200 * 1024 * 1024} // 200MB
                      multiple={true}
                      helperText="Drag & drop files here, or click to select (PNG, JPEG, PDF, DOCX, TXT)"
                    />
                  )}
                </form.Field>
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 100,
            }}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!canSubmit || createCabinetPaperMutation.isPending}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 140,
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {createCabinetPaperMutation.isPending || isSubmitting
                  ? 'Creating...'
                  : 'Create Paper'}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
