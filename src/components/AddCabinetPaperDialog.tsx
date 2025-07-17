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
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

interface AddCabinetPaperDialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (paperData: CabinetPaperFormData) => void
}

interface CabinetPaperFormData {
  referenceNumber: string
  title: string
  about: string
  status: 'Approved' | 'Submitted' | 'Considered'
  category: string
  attachments: File[]
}

export const AddCabinetPaperDialog: React.FC<AddCabinetPaperDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = useState<CabinetPaperFormData>({
    referenceNumber: '',
    title: '',
    about: '',
    status: 'Approved',
    category: '',
    attachments: [],
  })

  const [errors, setErrors] = useState<Partial<CabinetPaperFormData>>({})

  const categories = [
    'Finance',
    'Education',
    'Health',
    'Infrastructure',
    'Policy',
    'Technology',
    'Sports',
    'Legal',
    'Environment',
    'Agriculture',
    'Defense',
    'Transportation',
  ]

  const statuses = [
    { value: 'Submitted', color: theme.palette.warning.main },
    { value: 'Approved', color: theme.palette.success.main },
    { value: 'Considered', color: theme.palette.error.main },
  ]

  const allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ]

  const handleInputChange =
    (field: keyof CabinetPaperFormData) =>
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(
      (file) =>
        allowedFileTypes.includes(file.type) && file.size <= 10 * 1024 * 1024, // 10MB limit
    )

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CabinetPaperFormData> = {}

    if (!formData.referenceNumber.trim()) {
      newErrors.referenceNumber = 'Reference number is required'
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.about.trim()) {
      newErrors.about = 'About section is required'
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData)
      console.log('Cabinet Paper Data:', formData)
      alert('Cabinet Paper submitted successfully!')
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      referenceNumber: '',
      title: '',
      about: '',
      status: 'Considered',
      category: '',
      attachments: [],
    })
    setErrors({})
    onClose()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          Add New Cabinet Paper
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
              {/* Reference Number and Status Row */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  variant="outlined"
                  placeholder="e.g., CP-2025-021"
                  value={formData.referenceNumber}
                  onChange={handleInputChange('referenceNumber')}
                  error={!!errors.referenceNumber}
                  helperText={errors.referenceNumber}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <FormControl sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
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

              {/* Title */}
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                placeholder="Enter the cabinet paper title"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* Category */}
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={handleInputChange('category')}
                  error={!!errors.category}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderRadius: 2,
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* About Cabinet Paper */}
              <TextField
                fullWidth
                label="About Cabinet Paper"
                variant="outlined"
                multiline
                rows={5}
                placeholder="Provide a detailed description of the cabinet paper..."
                value={formData.about}
                onChange={handleInputChange('about')}
                error={!!errors.about}
                helperText={errors.about}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* File Attachments */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Attachments (Optional)
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{
                    borderRadius: 2,
                    borderStyle: 'dashed',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    padding: 2,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      borderColor: theme.palette.primary.dark,
                    },
                  }}
                  fullWidth
                >
                  Upload Files (PDF, DOCX, PNG, JPEG)
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </Button>

                {/* Attached Files List */}
                {formData.attachments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Stack spacing={1}>
                      {formData.attachments.map((file, index) => (
                        <Chip
                          key={index}
                          icon={<AttachFileIcon />}
                          label={`${file.name} (${formatFileSize(file.size)})`}
                          onDelete={() => removeAttachment(index)}
                          deleteIcon={<DeleteIcon />}
                          variant="outlined"
                          sx={{
                            justifyContent: 'space-between',
                            '& .MuiChip-label': {
                              maxWidth: { xs: '200px', sm: '300px' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
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
          Submit Paper
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCabinetPaperDialog
