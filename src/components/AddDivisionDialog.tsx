import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface AddDivisionDialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (divisionData: DivisionFormData) => void
}

interface DivisionFormData {
  divisionName: string
  description: string
  managerName: string
  status: 'Active' | 'Inactive'
}

export const AddDivisionDialog: React.FC<AddDivisionDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = useState<DivisionFormData>({
    divisionName: '',
    description: '',
    managerName: '',
    status: 'Active',
  })

  const [errors, setErrors] = useState<Partial<DivisionFormData>>({})

  const statuses = [
    { value: 'Active', color: theme.palette.success.main },
    { value: 'Inactive', color: theme.palette.error.main },
  ]

  const handleInputChange =
    (field: keyof DivisionFormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
    ) => {
      const value = event.target ? event.target.value : event
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const validateForm = (): boolean => {
    const newErrors: Partial<DivisionFormData> = {}

    if (!formData.divisionName.trim()) {
      newErrors.divisionName = 'Division name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.managerName.trim()) {
      newErrors.managerName = 'Manager name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData)
      console.log('Division Data:', formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      divisionName: '',
      description: '',
      managerName: '',
      status: 'Active',
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          Add New Division
        </Typography>
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
              {/* Division Name */}
              <TextField
                fullWidth
                label="Division Name"
                variant="outlined"
                placeholder="Enter the division name"
                value={formData.divisionName}
                onChange={handleInputChange('divisionName')}
                error={!!errors.divisionName}
                helperText={errors.divisionName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                placeholder="Provide a detailed description of the division's responsibilities..."
                value={formData.description}
                onChange={handleInputChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* Manager Name */}
              <TextField
                fullWidth
                label="Manager Name"
                variant="outlined"
                placeholder="Enter the manager's name"
                value={formData.managerName}
                onChange={handleInputChange('managerName')}
                error={!!errors.managerName}
                helperText={errors.managerName}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* Status */}
              <FormControl sx={{ maxWidth: { xs: '100%', sm: '200px' } }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange('status')}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: 2,
                    },
                  }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: status.color,
                          }}
                        />
                        {status.value}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 120,
            boxShadow: theme.shadows[2],
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
          }}
        >
          Submit Division
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDivisionDialog
