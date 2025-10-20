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
  Email as EmailIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse, Division, Role } from '@/api'
import type { CreateUserPayload } from '@/schemas'
import { createUser, getDivisions, getRoles } from '@/api'
import { createUserSchema } from '@/schemas'
import { useSnackbar } from '@/components'

interface CreateUserProps {
  readonly open: boolean
  readonly onClose: () => void
}

const PAGE_SIZE = 10

export function CreateUser({ open, onClose }: CreateUserProps) {
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

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (response) => {
      const message =
        response.message?.trim() || 'User created successfully!'
      showSnackbar({ message, severity: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      handleClose()
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to create user. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      divisionId: 0,
      roleId: 0,
    } as CreateUserPayload,
    validators: {
      onChange: createUserSchema,
    },
    onSubmit: ({ value }) => {
      createUserMutation.mutate(value)
    },
  })

  const handleClose = () => {
    form.reset()
    setSelectedRole(null)
    setSelectedDivision(null)
    onClose()
  }

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
              <PersonAddIcon
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
              Create User
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
                        loading={divisionsLoading}
                        value={selectedDivision}
                        onChange={(_, newValue) => {
                          setSelectedDivision(newValue)
                          field.handleChange(Number(newValue?.id) || 0)
                          setDivisionAutocompleteOpen(false)
                        }}
                        inputValue={divisionSearchTerm}
                        onInputChange={(_, newValue) => {
                          setDivisionSearchTerm(newValue)
                        }}
                        slotProps={{
                          listbox: {
                            onScroll: handleDivisionScroll,
                            style: { maxHeight: 250 },
                          },
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
                                    {divisionsLoading ? (
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
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body2">
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
                        noOptionsText={(() => {
                          if (divisionsError) return 'Error loading divisions'
                          if (divisionSearchTerm) return 'No divisions found'
                          return 'Type to search divisions'
                        })()}
                        loadingText={
                          <>
                            Loading divisions...
                            {divisionsFetchingNextPage && ' (loading more...)'}
                          </>
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
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
                        loading={rolesLoading}
                        value={selectedRole}
                        onChange={(_, newValue) => {
                          setSelectedRole(newValue)
                          field.handleChange(Number(newValue?.id) || 0)
                          setRoleAutocompleteOpen(false)
                        }}
                        inputValue={roleSearchTerm}
                        onInputChange={(_, newValue) => {
                          setRoleSearchTerm(newValue)
                        }}
                        slotProps={{
                          listbox: {
                            onScroll: handleRoleScroll,
                            style: { maxHeight: 250 },
                          },
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
                                    {rolesLoading ? (
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
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body2">
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
                        noOptionsText={(() => {
                          if (rolesError) return 'Error loading roles'
                          if (roleSearchTerm) return 'No roles found'
                          return 'Type to search roles'
                        })()}
                        loadingText={
                          <>
                            Loading roles...
                            {rolesFetchingNextPage && ' (loading more...)'}
                          </>
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
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
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
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
                disabled={!canSubmit || isSubmitting || createUserMutation.isPending}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                {isSubmitting || createUserMutation.isPending
                  ? 'Creating...'
                  : 'Create User'}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
