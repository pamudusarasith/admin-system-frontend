import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse, Letter, User } from '@/api'
import { assignUser, getUsers } from '@/api'
import { useSnackbar } from '@/components'

interface AssignUserDialogProps {
  readonly letter: Letter
  readonly open: boolean
  readonly onClose: () => void
}

const PAGE_SIZE = 10

interface UserOption extends User {
  readonly highlight?: string
}

export const AssignUserDialog: React.FC<AssignUserDialogProps> = ({
  letter,
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
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)

  useEffect(() => {
    if (!open) {
      setSearchTerm('')
      setDebouncedSearch('')
      setAutocompleteOpen(false)
      setSelectedUser(null)
    }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const divisionId = letter.assignedDivision?.id
    ? Number(letter.assignedDivision.id)
    : undefined

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['users-search', debouncedSearch, divisionId],
    queryFn: ({ pageParam = 0 }) =>
      getUsers({
        query: debouncedSearch || undefined,
        divisionId,
        page: pageParam,
        pageSize: PAGE_SIZE,
        assignableOnly: true,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination
      if (!pagination) return undefined
      const nextPage = pagination.page + 1
      return nextPage < pagination.totalPages ? nextPage : undefined
    },
    initialPageParam: 0,
    enabled: open && autocompleteOpen && divisionId !== undefined,
    staleTime: 5 * 60 * 1000,
  })

  const userOptions: Array<UserOption> = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.data ?? [])
        .map((user) => ({
          ...user,
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

  const assignUserMutation = useMutation({
    mutationFn: (userId: number) => assignUser(letter.id, userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['letter', letter.id] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      const message = response.message?.trim() || 'User assigned successfully.'
      showSnackbar({ message, severity: 'success' })
      handleClose()
    },
    onError: (e: AxiosError<ApiResponse<unknown>>) => {
      const message =
        e.response?.data.message?.trim() ||
        'Failed to assign user. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const handleClose = useCallback(() => {
    setSearchTerm('')
    setSelectedUser(null)
    setAutocompleteOpen(false)
    onClose()
  }, [onClose])

  const handleAssign = useCallback(() => {
    if (!selectedUser) return
    assignUserMutation.mutate(selectedUser.id)
  }, [assignUserMutation, selectedUser])

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
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PersonAddIcon color="primary" />
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                Assign User
              </Typography>
            </Stack>
            {letter.assignedDivision && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, ml: 4.5 }}
              >
                Division: <strong>{letter.assignedDivision.name}</strong>
              </Typography>
            )}
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
        </Box>
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
                  Search User
                </Typography>
                <Autocomplete
                  open={autocompleteOpen}
                  onOpen={() => setAutocompleteOpen(true)}
                  onClose={() => setAutocompleteOpen(false)}
                  options={userOptions}
                  loading={loading}
                  inputValue={searchTerm}
                  value={selectedUser}
                  onChange={(_event, value) => {
                    setSelectedUser(value)
                    if (value) {
                      setAutocompleteOpen(false)
                    }
                  }}
                  onInputChange={(_event, value, reason) => {
                    if (reason === 'reset') return
                    setSearchTerm(value)
                  }}
                  getOptionLabel={(option) =>
                    option.fullName || option.username
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterOptions={(options) => options}
                  noOptionsText={
                    debouncedSearch
                      ? 'No users match your search.'
                      : 'No users available.'
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
                        placeholder="Type to search users..."
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
                        <PersonIcon color="primary" fontSize="small" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {option.fullName || option.username}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 0.5 }}
                        >
                          {option.email && (
                            <Typography variant="body2" color="text.secondary">
                              {option.email}
                            </Typography>
                          )}
                          {option.role && (
                            <Chip
                              label={option.role}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Stack>
                        {option.division && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            Division: {option.division}
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
                  {letter.assignedDivision ? (
                    <>
                      Showing users from{' '}
                      <strong>{letter.assignedDivision.name}</strong> division.
                      Start typing to search or scroll to explore.
                    </>
                  ) : (
                    'Start typing or scroll to explore available users. Results update automatically.'
                  )}
                </Typography>
                {hasError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Unable to load users. Please try again.
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
                  Selected User
                </Typography>
                {selectedUser ? (
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
                          <PersonIcon color="primary" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {selectedUser.fullName || selectedUser.username}
                          </Typography>
                          {selectedUser.email && (
                            <Typography variant="body2" color="text.secondary">
                              {selectedUser.email}
                            </Typography>
                          )}
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {selectedUser.role && (
                          <Chip
                            label={`Role: ${selectedUser.role}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        {selectedUser.division && (
                          <Chip
                            label={`Division: ${selectedUser.division}`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {selectedUser.isActive !== undefined && (
                          <Chip
                            label={
                              selectedUser.isActive ? 'Active' : 'Inactive'
                            }
                            size="small"
                            color={
                              selectedUser.isActive ? 'success' : 'default'
                            }
                            variant="outlined"
                          />
                        )}
                      </Stack>

                      {selectedUser.phoneNumber && (
                        <Typography variant="body2" color="text.secondary">
                          Phone: {selectedUser.phoneNumber}
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
                      No user selected yet.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {letter.assignedDivision
                        ? `Use the search above to choose a user from the ${letter.assignedDivision.name} division.`
                        : 'Use the search above to choose the most suitable user for this letter.'}
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
          startIcon={<PersonAddIcon />}
          disabled={!selectedUser || assignUserMutation.isPending}
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
          {assignUserMutation.isPending ? 'Assigning...' : 'Assign User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
