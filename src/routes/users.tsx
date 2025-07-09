import { createFileRoute } from '@tanstack/react-router'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Stack, Typography, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Paper from '@mui/material/Paper'
import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export const Route = createFileRoute('/users')({
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

  const getStatusBadge = (
    status: 'Active' | 'Pending' | 'Banned' | 'Rejected',
  ) => {
    let bgColor = ''
    let textColor = ''
    switch (status) {
      case 'Active':
        bgColor = theme.palette.success.light
        textColor = theme.palette.success.dark
        break
      case 'Pending':
        bgColor = theme.palette.warning.light
        textColor = theme.palette.warning.dark
        break
      case 'Banned':
        bgColor = theme.palette.error.light
        textColor = theme.palette.error.dark
        break
      case 'Rejected':
        bgColor = theme.palette.grey[400]
        textColor = theme.palette.grey[700]
        break
      default:
        bgColor = theme.palette.grey[300]
        textColor = theme.palette.grey[800]
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
    <Container fixed sx={{ py: 3, fontFamily: 'Inter, sans-serif' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mt: 2,
          justifyContent: 'space-between',
          mb: 2,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' }, fontWeight: 'bold' }}
        >
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit">
            User
          </Link>
          <Typography color="text.primary">List</Typography>
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
            sx={{ borderRadius: 0 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="user table">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" />
                  </TableCell>
                  <TableCell>
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
                  <TableCell>Phone number</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={row.avatarUrl} alt={row.name} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {row.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {row.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton>
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
            }}
          >
            <FormControlLabel
              label="Dense"
              control={<Switch />}
              sx={{ mr: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page: 5
              </Typography>
              <KeyboardArrowDownIcon />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 2, mr: 1 }}
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
  )
}
