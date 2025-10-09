import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Modal,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ArrowUpwardSharp as ArrowUpwardSharpIcon,
  Edit as EditIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import type { User } from '@/api'
import { AddButton, CreateUser, SidebarLayout } from '@/components'
import { getUsers } from '@/api'

export const Route = createFileRoute('/_authenticated/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch users using TanStack Query
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<Array<User>>({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  // Filter users based on active tab and search query
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.division.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === 1) return user.isActive === true && matchesSearch
    if (activeTab === 2) return user.isActive === false && matchesSearch
    return matchesSearch // All users
  })

  // Count users by status
  const allCount = users.length
  const activeCount = users.filter((user) => user.isActive === true).length
  const inactiveCount = users.filter((user) => user.isActive === false).length

  const getStatusBadge = (isActive: boolean | null) => {
    let bgColor = ''
    const textColor = '#FFFFFF'
    let label = ''

    if (isActive === true) {
      bgColor = '#2E7D32'
      label = 'Active'
    } else if (isActive === false) {
      bgColor = '#D32F2F'
      label = 'Inactive'
    } else {
      bgColor = '#424242'
      label = 'Unknown'
    }

    return (
      <Box
        component="span"
        sx={{
          bgcolor: bgColor,
          color: textColor,
          borderRadius: 1.4,
          px: 1,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 60,
        }}
      >
        {label}
      </Box>
    )
  }

  const generateAvatarUrl = (user: User) => {
    const initials = user.fullName
      ? user.fullName
          .split(' ')
          .map((name) => name[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : user.username.substring(0, 2).toUpperCase()
    return `https://placehold.co/40x40/3357FF/FFFFFF?text=${initials}`
  }

  return (
    <SidebarLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            // mt: 2,
            justifyContent: 'space-between',
            mb: 2,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              fontWeight: 'bold',
            }}
          >
            Users
          </Typography>
          <AddButton
            label="Add User"
            onClick={handleOpen}
            tooltip="Create a new user"
            size="medium"
            variant="contained"
            color="primary"
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-user-modal"
            aria-describedby="create-user-form"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
                maxWidth: 1000,
                maxHeight: '90vh',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                overflow: 'auto',
              }}
            >
              <CreateUser onClose={handleClose} />
            </Box>
          </Modal>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit">
              Dashboard
            </Link>
            <Link underline="hover" color="inherit">
              User Management
            </Link>
            <Typography color="text.primary">All Users</Typography>
          </Breadcrumbs>
        </Box>

        <Paper
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2 }}
        >
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              Failed to load users:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </Alert>
          )}

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="user status tabs"
                textColor="inherit"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab
                  label={
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      All{' '}
                      <Box
                        bgcolor={'text.primary'}
                        borderRadius={1.4}
                        minWidth={24}
                        px={0.8}
                        color={theme.palette.primary.contrastText}
                        sx={{ textAlign: 'center' }}
                      >
                        {allCount}
                      </Box>
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      Active{' '}
                      <Box
                        bgcolor={theme.palette.success.light}
                        borderRadius={1.4}
                        minWidth={24}
                        sx={{ textAlign: 'center' }}
                        px={0.8}
                        color={theme.palette.success.dark}
                      >
                        {activeCount}
                      </Box>
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      Inactive{' '}
                      <Box
                        bgcolor={theme.palette.error.light}
                        borderRadius={1.4}
                        minWidth={24}
                        sx={{ textAlign: 'center' }}
                        px={0.8}
                        color={theme.palette.error.dark}
                      >
                        {inactiveCount}
                      </Box>
                    </Box>
                  }
                />
              </Tabs>
            </Box>

            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <FormControl
                sx={{
                  minWidth: 120,
                  flexShrink: 0,
                  width: { xs: '100%', sm: 'auto' },
                }}
                size="small"
              >
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select label="Role" sx={{ borderRadius: 2 }}></Select>
              </FormControl>

              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ borderRadius: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />
            </Box>

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
                aria-label="user table"
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
                    <TableCell
                      padding="checkbox"
                      sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                    >
                      <Checkbox color="primary" />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        Name{' '}
                        <ArrowUpwardSharpIcon
                          sx={{
                            fontSize: '1rem',
                            color: theme.palette.grey[700],
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', md: 'table-cell' },
                        minWidth: 120,
                      }}
                    >
                      Phone number
                    </TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', lg: 'table-cell' },
                        minWidth: 180,
                      }}
                    >
                      Branch
                    </TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Role</TableCell>
                    <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
                    <TableCell sx={{ minWidth: 100 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Loading users...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          {searchQuery
                            ? 'No users found matching your search.'
                            : 'No users found.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell
                          padding="checkbox"
                          sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                        >
                          <Checkbox color="primary" />
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ minWidth: 200 }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Avatar
                              src={generateAvatarUrl(user)}
                              alt={user.fullName || user.username}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight="medium"
                                sx={{
                                  fontSize: { xs: '0.875rem', sm: '1rem' },
                                }}
                              >
                                {user.fullName || user.username}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                }}
                              >
                                {user.email || 'No email'}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  display: { xs: 'block', md: 'none' },
                                }}
                              >
                                {user.phoneNumber || 'No phone'}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{ display: { xs: 'none', md: 'table-cell' } }}
                        >
                          {user.phoneNumber || 'No phone'}
                        </TableCell>
                        <TableCell
                          sx={{ display: { xs: 'none', lg: 'table-cell' } }}
                        >
                          {user.division}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {user.role}
                          </Typography>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <Divider />
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <FormControlLabel
                label="Dense"
                control={<Switch />}
                sx={{ mr: { xs: 0, sm: 2 } }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Rows per page: 5
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    ml: { xs: 1, sm: 2 },
                    mr: 1,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  1-{filteredUsers.length} of {filteredUsers.length}
                </Typography>
                <IconButton size="small" disabled>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton size="small">
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </SidebarLayout>
  )
}
