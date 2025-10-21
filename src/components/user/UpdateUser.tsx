import React, { useCallback, useEffect, useState } from 'react'
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
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse, Division, Role, User } from '@/api'
import type { UpdateUserPayload } from '@/schemas'
import { getDivisions, getRoles, updateUser } from '@/api'
import { updateUserSchema } from '@/schemas'
import { useSnackbar } from '@/components'

interface UpdateUserProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly user: User | null
}

const PAGE_SIZE = 10

export function UpdateUser({ open, onClose, user }: UpdateUserProps) {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // State for autocomplete
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [divisionSearchTerm, setDivisionSearchTerm] = useState('')
  const [debouncedRoleSearch, setDebouncedRoleSearch] = useState('')
  const [debouncedDivisionSearch, setDebouncedDivisionSearch] = useState('')
  const [roleAutocompleteOpen, setRoleAutocompleteOpen] = useState(false)
  const [divisionAutocompleteOpen, setDivisionAutocompleteOpen] =
    useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(
    null,
  )

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setRoleSearchTerm('')
      setDivisionSearchTerm('')
      setDebouncedRoleSearch('')
      setDebouncedDivisionSearch('')
      setRoleAutocompleteOpen(false)
      setDivisionAutocompleteOpen(false)
      setSelectedRole(null)
      setSelectedDivision(null)
    }
  }, [open])

  // Initialize form when user data is available
  useEffect(() => {
    if (user && open) {
      form.setFieldValue('username', user.username)
      form.setFieldValue('email', user.email || '')
      form.setFieldValue('fullName', user.fullName || '')
      form.setFieldValue('phoneNumber', user.phoneNumber || '')
      
      // Set search terms to find the current role/division
      setRoleSearchTerm(user.role)
      setDivisionSearchTerm(user.division)
      setDebouncedRoleSearch(user.role)
      setDebouncedDivisionSearch(user.division)
    }
  }, [user, open])

  // Debounce search terms
  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedRoleSearch(roleSearchTerm.trim())
    }, 300)
    return () => globalThis.clearTimeout(timer)
  }, [roleSearchTerm])

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      setDebouncedDivisionSearch(divisionSearchTerm.trim())
    }, 300)
    return () => globalThis.clearTimeout(timer)
  }, [divisionSearchTerm])

  // Fetch roles with infinite scroll
  const {
    data: rolesData,
    isLoading: rolesLoading,
    isFetchingNextPage: rolesFetchingNextPage,
    hasNextPage: rolesHasNextPage,
    fetchNextPage: rolesFetchNextPage,
    error: rolesError,
  } = useInfiniteQuery({
    queryKey: ['roles-search', debouncedRoleSearch],
    queryFn: ({ pageParam = 0 }) =>
      getRoles({
        query: debouncedRoleSearch || undefined,
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
    enabled: open && roleAutocompleteOpen,
  })

  // Fetch divisions with infinite scroll
  const {
    data: divisionsData,
    isLoading: divisionsLoading,
    isFetchingNextPage: divisionsFetchingNextPage,
    hasNextPage: divisionsHasNextPage,
    fetchNextPage: divisionsFetchNextPage,
    error: divisionsError,
  } = useInfiniteQuery({
    queryKey: ['divisions-search', debouncedDivisionSearch],
    queryFn: ({ pageParam = 0 }) =>
      getDivisions({
        query: debouncedDivisionSearch || undefined,
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
    enabled: open && divisionAutocompleteOpen,
  })

  const roles = rolesData?.pages.flatMap((page) => page.data || []) || []
  const divisions =
    divisionsData?.pages.flatMap((page) => page.data || []) || []

  // Auto-select role when it matches the user's current role
  useEffect(() => {
    if (user && roles.length > 0 && !selectedRole) {
      const matchingRole = roles.find((r) => r.name === user.role)
      if (matchingRole) {
        setSelectedRole(matchingRole)
        form.setFieldValue('roleId', Number(matchingRole.id))
      }
    }
  }, [roles, user, selectedRole])

  // Auto-select division when it matches the user's current division
  useEffect(() => {
    if (user && divisions.length > 0 && !selectedDivision) {
      const matchingDivision = divisions.find((d) => d.name === user.division)
      if (matchingDivision) {
        setSelectedDivision(matchingDivision)
        form.setFieldValue('divisionId', Number(matchingDivision.id))
      }
    }
  }, [divisions, user, selectedDivision])

  const handleRoleScroll = useCallback(
    (event: React.SyntheticEvent) => {
      const listboxNode = event.currentTarget
      const position = listboxNode.scrollTop + listboxNode.clientHeight
      if (
        listboxNode.scrollHeight - position <= 1 &&
        rolesHasNextPage &&
        !rolesFetchingNextPage
      ) {
        rolesFetchNextPage()
      }
    },
    [rolesHasNextPage, rolesFetchingNextPage, rolesFetchNextPage],
  )

  const handleDivisionScroll = useCallback(
    (event: React.SyntheticEvent) => {
      const listboxNode = event.currentTarget
      const position = listboxNode.scrollTop + listboxNode.clientHeight
      if (
        listboxNode.scrollHeight - position <= 1 &&
        divisionsHasNextPage &&
        !divisionsFetchingNextPage
      ) {
        divisionsFetchNextPage()
      }
    },
    [divisionsHasNextPage, divisionsFetchingNextPage, divisionsFetchNextPage],
  )

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserPayload) => {
      if (!user?.id) {
        throw new Error('User ID is required')
      }
      return updateUser(user.id, data)
    },
    onSuccess: (response: ApiResponse<void>) => {
      const message =
        response.message?.trim() || 'User updated successfully!'
      showSnackbar({ message, severity: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      handleClose()
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to update user. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      phoneNumber: '',
      divisionId: 0,
      roleId: 0,
    } as UpdateUserPayload,
    validators: {
      onChange: updateUserSchema,
    },
    onSubmit: ({ value }) => {
      updateUserMutation.mutate(value)
    },
  })

  const handleClose = () => {
    form.reset()
    setSelectedRole(null)
    setSelectedDivision(null)
    onClose()
  }

  if (!user) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
              <EditIcon
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
              Update User
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
                {/* Username */}
                <form.Field name="username">
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
                        Username *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter username (min. 6 characters)"
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
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
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
                    </Box>
                  )}
                </form.Field>

                {/* Email */}
                <form.Field name="email">
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
                        Email *
                      </Typography>
                      <TextField
                        fullWidth
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter email address"
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
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
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
                    </Box>
                  )}
                </form.Field>

                {/* Full Name */}
                <form.Field name="fullName">
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
                        Full Name *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter full name"
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
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
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
                    </Box>
                  )}
                </form.Field>

                {/* Phone Number */}
                <form.Field name="phoneNumber">
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
                        Phone Number *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter 10-digit phone number"
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
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
                              </InputAdornment>
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
                    </Box>
                  )}
                </form.Field>

                {/* Division Autocomplete */}
                <form.Field name="divisionId">
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
                        Division *
                      </Typography>
                      <Autocomplete
                        open={divisionAutocompleteOpen}
                        onOpen={() => setDivisionAutocompleteOpen(true)}
                        onClose={() => setDivisionAutocompleteOpen(false)}
                        options={divisions}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedDivision}
                        onChange={(_, newValue) => {
                          setSelectedDivision(newValue)
                          field.handleChange(Number(newValue?.id) || 0)
                        }}
                        onInputChange={(_, newInputValue) => {
                          setDivisionSearchTerm(newInputValue)
                        }}
                        inputValue={divisionSearchTerm}
                        loading={divisionsLoading}
                        loadingText="Loading divisions..."
                        noOptionsText={(() => {
                          if (divisionsError) return 'Error loading divisions'
                          if (divisionsLoading) return 'Loading...'
                          return 'No divisions found'
                        })()}
                        ListboxProps={{
                          onScroll: handleDivisionScroll,
                          style: { maxHeight: '250px' },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search and select division"
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
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {divisionsLoading ||
                                    divisionsFetchingNextPage ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
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
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body1">
                                {option.name}
                              </Typography>
                              {option.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {option.description}
                                </Typography>
                              )}
                            </Box>
                          </li>
                        )}
                        sx={{
                          '& .MuiAutocomplete-popupIndicator': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Box>
                  )}
                </form.Field>

                {/* Role Autocomplete */}
                <form.Field name="roleId">
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
                        Role *
                      </Typography>
                      <Autocomplete
                        open={roleAutocompleteOpen}
                        onOpen={() => setRoleAutocompleteOpen(true)}
                        onClose={() => setRoleAutocompleteOpen(false)}
                        options={roles}
                        getOptionLabel={(option) => option.name || ''}
                        value={selectedRole}
                        onChange={(_, newValue) => {
                          setSelectedRole(newValue)
                          field.handleChange(Number(newValue?.id) || 0)
                        }}
                        onInputChange={(_, newInputValue) => {
                          setRoleSearchTerm(newInputValue)
                        }}
                        inputValue={roleSearchTerm}
                        loading={rolesLoading}
                        loadingText="Loading roles..."
                        noOptionsText={(() => {
                          if (rolesError) return 'Error loading roles'
                          if (rolesLoading) return 'Loading...'
                          return 'No roles found'
                        })()}
                        ListboxProps={{
                          onScroll: handleRoleScroll,
                          style: { maxHeight: '250px' },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search and select role"
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
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {rolesLoading || rolesFetchingNextPage ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
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
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body1">
                                {option.name}
                              </Typography>
                              {option.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {option.description}
                                </Typography>
                              )}
                            </Box>
                          </li>
                        )}
                        sx={{
                          '& .MuiAutocomplete-popupIndicator': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    </Box>
                  )}
                </form.Field>
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            gap: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateUserMutation.isPending}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
            }}
          >
            {updateUserMutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Updating...
              </>
            ) : (
              'Update User'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
