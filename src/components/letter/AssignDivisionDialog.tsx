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
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Apartment as ApartmentIcon,
  Close as CloseIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse, Division } from '@/api'
import { assignDivision, getDivisions } from '@/api'
import { useSnackbar } from '@/components'

interface AssignDivisionDialogProps {
  readonly letterId: number
  readonly open: boolean
  readonly onClose: () => void
}

const PAGE_SIZE = 10

interface DivisionOption extends Division {
  readonly highlight?: string
}

export const AssignDivisionDialog: React.FC<AssignDivisionDialogProps> = ({
  letterId,
  open,
  onClose,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] =
    useState<DivisionOption | null>(null)

  useEffect(() => {
    if (!open) {
      setSearchTerm('')
      setDebouncedSearch('')
      setAutocompleteOpen(false)
      setSelectedDivision(null)
    }
  }, [open])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [searchTerm])

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['divisions-search', debouncedSearch],
    queryFn: ({ pageParam = 0 }) =>
      getDivisions({
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

  const divisionOptions: Array<DivisionOption> = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.data ?? [])
        .map((division) => ({
          ...division,
          highlight: debouncedSearch,
        })) ?? []
    )
  }, [data, debouncedSearch])

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

  const assignDivisionMutation = useMutation({
    mutationFn: (divisionId: string) => assignDivision(letterId, divisionId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['letter', letterId] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      const message =
        response.message?.trim() || 'Division assigned successfully.'
      showSnackbar({ message, severity: 'success' })
      handleClose()
    },
    onError: (e: AxiosError<ApiResponse<any>>) => {
      const message =
        e.response?.data.message?.trim() ||
        'Failed to assign division. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const handleClose = useCallback(() => {
    setSearchTerm('')
    setSelectedDivision(null)
    setAutocompleteOpen(false)
    onClose()
  }, [onClose])

  const handleAssign = useCallback(() => {
    if (!selectedDivision) return
    assignDivisionMutation.mutate(selectedDivision.id)
  }, [assignDivisionMutation, selectedDivision])

  const loading = isLoading || isFetchingNextPage
  const hasError = Boolean(error)

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
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <SwapHorizIcon color="primary" />
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{ fontWeight: 700, color: theme.palette.text.primary }}
          >
            Assign Division
          </Typography>
        </Stack>
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
        <Card elevation={0} sx={{ borderRadius: 0, background: 'transparent' }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  Search Division
                </Typography>
                <Autocomplete
                  open={autocompleteOpen}
                  onOpen={() => setAutocompleteOpen(true)}
                  onClose={() => setAutocompleteOpen(false)}
                  options={divisionOptions}
                  loading={loading}
                  inputValue={searchTerm}
                  value={selectedDivision}
                  onChange={(_event, value) => {
                    setSelectedDivision(value)
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
                      ? 'No divisions match your search.'
                      : 'No divisions available.'
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
                    const { InputProps: inputProps, ...restParams } = params

                    return (
                      <TextField
                        {...restParams}
                        placeholder="Type to search divisions..."
                        fullWidth
                        slotProps={{
                          input: {
                            ...inputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? (
                                  <CircularProgress color="primary" size={20} />
                                ) : null}
                                {inputProps.endAdornment}
                              </React.Fragment>
                            ),
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: `${theme.palette.background.paper}AA`,
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
                        <ApartmentIcon color="primary" fontSize="small" />
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
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1.5 }}
                >
                  Start typing or scroll to explore available divisions. Results
                  update automatically.
                </Typography>
                {hasError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Unable to load divisions. Please try again.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ borderStyle: 'dashed', opacity: 0.6 }} />

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Selected Division
                </Typography>
                {selectedDivision ? (
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderColor: `${theme.palette.primary.main}44`,
                      background: `${theme.palette.primary.light}10`,
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            backgroundColor: `${theme.palette.primary.main}14`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ApartmentIcon color="primary" />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {selectedDivision.name}
                          </Typography>
                        </Box>
                      </Stack>

                      {selectedDivision.description && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedDivision.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Box
                    sx={{
                      border: `1px dashed ${theme.palette.divider}`,
                      borderRadius: 3,
                      p: { xs: 2, sm: 3 },
                      textAlign: 'center',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      No division selected yet.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Use the search above to choose the most suitable division
                      for this letter.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2.5, sm: 3.5 },
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
        <Button
          onClick={handleAssign}
          variant="contained"
          startIcon={<SwapHorizIcon />}
          disabled={!selectedDivision || assignDivisionMutation.isPending}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 160,
            boxShadow: theme.shadows[2],
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {assignDivisionMutation.isPending
            ? 'Assigning...'
            : 'Assign Division'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
