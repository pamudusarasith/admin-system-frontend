import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import { Paper, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import IconButton from '@mui/material/IconButton'

export default function EUser() {
  const theme = useTheme()

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
      </Box>

      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit">
            User
          </Link>
          <Typography color="text.primary">Create new user</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={3} padding={3}>
        <Grid size={4}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Box
              height="240px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection={'column'}
            >
              <Box alignItems="center">
                <Box
                  border={1}
                  borderColor={theme.palette.grey[200]}
                  sx={{
                    borderRadius: '50%',
                    width: 130,
                    height: 130,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    justifySelf: 'center',
                    marginBottom: 2,
                  }}
                >
                  <Box
                    bgcolor={theme.palette.grey[200]}
                    sx={{
                      borderRadius: '50%',
                      width: 120,
                      height: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton size="small">
                      <AddAPhotoIcon />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary">
                      Upload Photo
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ justifySelf: 'center' }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                  max size of 3 Mb
                </Typography>
              </Box>
            </Box>
            <Box
              justifyContent="space-between"
              display="flex"
              alignItems="center"
            >
              <Typography>
                <h4>Email verified</h4>
                <p>
                  Disabling this will automatically send the user a verification
                  email
                </p>
              </Typography>
              <Switch />
            </Box>
          </Paper>
        </Grid>
        <Grid size={8}>
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              padding={2}
              borderRadius={4}
            >
              <Grid size={6} color={theme.palette.text.primary}>
                <Box
                  component="form"
                  sx={{ '& .MuiTextField-root': { m: 1, width: '21ch' } }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField label="Full Name" />
                    <TextField
                      label="Phone number"
                      placeholder="Enter Phone number"
                    />
                    <TextField label="Branch" select />
                    <TextField label="Role" select />
                  </div>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box
                  component="form"
                  sx={{ '& .MuiTextField-root': { m: 1, width: '21ch' } }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField label="Username" />
                    <TextField label="Email address" />
                    <TextField label="Division" select />
                  </div>
                </Box>
              </Grid>
              <Grid
                size={12}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background: theme.palette.grey[900],
                  }}
                >
                  Create user
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
