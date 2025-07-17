import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Avatar,
  Box,
  Breadcrumbs,
  Checkbox,
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
import { CreateUser, SidebarLayout, AddButton } from '@/components'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
})

function createData(
  id: string,
  name: string,
  email: string,
  phone: string,
  branch: string,
  role: string,
  status: 'Active' | 'Pending' | 'Banned' | 'Rejected',
  avatarUrl: string,
) {
  return { id, name, email, phone, branch, role, status, avatarUrl }
}

const rows = [
  createData(
    '1',
    'Nimal Perera',
    'nimal.p@email.lk',
    '+94 77 123 4567',
    'Language Translation Branch ',
    'Minister of Education',
    'Active',
    'broken-image.jpg',
  ),
  createData(
    '2',
    'Kamala Silva',
    'kamala.s@email.lk',
    '+94 71 987 6543',
    'Legal Branch',
    'Permanent Secretary',
    'Pending',
    'https://placehold.co/40x40/33FF57/FFFFFF?text=KS',
  ),
  createData(
    '3',
    'Saman Kumara',
    'saman.k@email.lk',
    '+94 76 234 5678',
    'Transport Branch',
    'Additional Secretary',
    'Banned',
    'https://placehold.co/40x40/3357FF/FFFFFF?text=SK',
  ),
  createData(
    '4',
    'Dilani Fernando',
    'dilani.f@email.lk',
    '+94 72 345 6789',
    'Parliamentary Affairs',
    'Parliamentary Secretary',
    'Rejected',
    'https://placehold.co/40x40/FF33E9/FFFFFF?text=DF',
  ),
  createData(
    '5',
    'Ranjith Bandara',
    'ranjith.b@email.lk',
    '+94 70 456 7890',
    'General Administration Branch',
    'Director Generals',
    'Pending',
    'https://placehold.co/40x40/E9FF33/FFFFFF?text=RB',
  ),
]

function RouteComponent() {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getStatusBadge = (
    status: 'Active' | 'Pending' | 'Banned' | 'Rejected',
  ) => {
    let bgColor = ''
    let textColor = '#FFFFFF'
    switch (status) {
      case 'Active':
        bgColor = '#2E7D32'
        break
      case 'Pending':
        bgColor = '#F57F17'
        break
      case 'Banned':
        bgColor = '#D32F2F'
        break
      case 'Rejected':
        bgColor = '#7B1FA2'
        break
      default:
        bgColor = '#424242'
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
        {status}
      </Box>
    )
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
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={0}
                onChange={() => {}}
                aria-label="basic tabs example"
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
                        20
                      </Box>
                    </Box>
                  }
                ></Tab>
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
                        4
                      </Box>
                    </Box>
                  }
                ></Tab>
                <Tab
                  label={
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      Pending{' '}
                      <Box
                        bgcolor={theme.palette.warning.light}
                        borderRadius={1.4}
                        minWidth={24}
                        sx={{ textAlign: 'center' }}
                        px={0.8}
                        color={theme.palette.warning.dark}
                      >
                        10
                      </Box>
                    </Box>
                  }
                ></Tab>
                <Tab
                  label={
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      Banned{' '}
                      <Box
                        bgcolor={theme.palette.error.light}
                        borderRadius={1.4}
                        minWidth={24}
                        sx={{ textAlign: 'center' }}
                        px={0.8}
                        color={theme.palette.error.dark}
                      >
                        7
                      </Box>
                    </Box>
                  }
                ></Tab>
                <Tab
                  label={
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                      Rejected{' '}
                      <Box
                        bgcolor={theme.palette.grey[400]}
                        borderRadius={1.4}
                        minWidth={24}
                        sx={{ textAlign: 'center' }}
                        px={0.8}
                        color={theme.palette.grey[700]}
                      >
                        2
                      </Box>
                    </Box>
                  }
                ></Tab>
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
                sx={{ borderRadius: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              ></TextField>
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
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            src={row.avatarUrl}
                            alt={row.name}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight="medium"
                              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                              {row.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              }}
                            >
                              {row.email}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                display: { xs: 'block', md: 'none' },
                              }}
                            >
                              {row.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', md: 'table-cell' } }}
                      >
                        {row.phone}
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: 'none', lg: 'table-cell' } }}
                      >
                        {row.branch}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {row.role}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  1-10 of {rows.length}
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
