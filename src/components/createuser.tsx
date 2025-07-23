import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import { FormControl } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

interface CreateUserProps {
  onClose?: () => void
}

export function CreateUser({ onClose }: CreateUserProps) {
  const theme = useTheme()

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Create User
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          display: 'flex',
          mx: 'auto',
        }}
      > */}
      <Box sx={{ width: '100%' }}>
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
              sx={{
                '& .MuiTextField-root': {
                  m: 1,
                  width: 'calc(100% - 16px)',
                },
                '& .MuiFormControl-root': {
                  m: 1,
                  width: 'calc(100% - 16px)',
                },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  name="username"
                  label="Username"
                  placeholder="Please insert the username here..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettingsOutlinedIcon
                          sx={{ color: theme.palette.grey[600] }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Please insert the email here..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon
                          sx={{ color: theme.palette.grey[600] }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Box>
          </Grid>
          <Grid size={6} color={theme.palette.text.primary}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': {
                  m: 1,
                  width: 'calc(100% - 16px)',
                },
                '& .MuiFormControl-root': {
                  m: 1,
                  width: 'calc(100% - 16px)',
                },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <FormControl variant="outlined">
                  <InputLabel>Division</InputLabel>
                  <Select name="division" label="Division">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Administration Division">
                      Administration Division
                    </MenuItem>
                    <MenuItem value="Finance Division">
                      Finance Division
                    </MenuItem>
                    <MenuItem value="Establishment Division">
                      Establishment Division
                    </MenuItem>
                    <MenuItem value="Planning Division">
                      Planning Division
                    </MenuItem>
                    <MenuItem value="Education Quality Development Division">
                      Education Quality Development Division
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select name="role" label="Role">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Minister of Education">
                      Minister of Education
                    </MenuItem>
                    <MenuItem value="Permanent Secretary">
                      Permanent Secretary
                    </MenuItem>
                    <MenuItem value="Additional Secretary">
                      Additional Secretary
                    </MenuItem>
                    <MenuItem value="Parliamentary Secretary">
                      Parliamentary Secretary
                    </MenuItem>
                    <MenuItem value="Director Generals">
                      Director Generals
                    </MenuItem>
                    <MenuItem value="Director of Education">
                      Director of Education
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            mt: 4,
            flexWrap: 'wrap',
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 2, px: 4 }}
            onClick={async () => {
              // Collect form data
              const username = (
                document.querySelector(
                  'input[name="username"]',
                ) as HTMLInputElement
              ).value
              const email = (
                document.querySelector(
                  'input[name="email"]',
                ) as HTMLInputElement
              ).value
              const division = (
                document.querySelector(
                  'select[name="division"]',
                ) as HTMLSelectElement
              ).value
              const role = (
                document.querySelector(
                  'select[name="role"]',
                ) as HTMLSelectElement
              ).value

              // Send to /users API
              try {
                const response = await fetch('/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, email, division, role }),
                })
                if (response.ok) {
                  alert('User created!')
                  if (onClose) onClose()
                } else {
                  alert('Failed to create user')
                }
              } catch (error) {
                alert('Error creating user')
              }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
