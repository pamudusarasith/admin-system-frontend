import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material'
import type { LetterFormData } from '../schemas/letter'

interface AddLetterDialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (letterData: LetterFormData) => void
}

export const AddLetterDialog: React.FC<AddLetterDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = useState<LetterFormData>({
    reference: '',
    sender_details: {
      name: '',
      email: '',
      phone_number: '',
      address: '',
    },
    priority: 'NORMAL',
    mode_of_arrival: 'REGISTERED_POST',
    received_date: new Date().toISOString().split('T')[0],
    sent_date: undefined,
    subject: '',
    content: '',
    attachments: undefined,
  })

  const [errors, setErrors] = useState<Partial<LetterFormData>>({})

  const priorities = [
    { value: 'NORMAL', color: theme.palette.success.main, label: 'Normal' },
    { value: 'HIGH', color: theme.palette.error.main, label: 'High' },
    { value: 'URGENT', color: theme.palette.warning.main, label: 'Urgent' },
  ]

  const modesOfArrival = [
    'REGISTERED_POST',
    'UNREGISTERED_POST',
    'EMAIL',
    'WHATSAPP',
    'HAND_DELIVERED',
    'FAX',
    'OTHER',
  ]

  const allowedFileTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const handleInputChange =
    (field: keyof LetterFormData) =>
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

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, received_date: date }))
    if (errors.received_date) {
      setErrors((prev) => ({ ...prev, received_date: undefined }))
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
      attachments: [...(prev.attachments || []), ...validFiles],
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<LetterFormData> = {}

    if (!formData.reference.trim()) {
      newErrors.reference = 'Reference number is required'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    if (!formData.sender_details.name.trim()) {
      // Note: We'll need to add sender_details validation in a nested way
      // For now, we'll use a simple approach
      newErrors.reference = 'Sender name is required' // Using reference field for error display
    }
    // Content is optional in the schema, so no validation needed
    if (!formData.received_date) {
      newErrors.received_date = 'Receiving date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      reference: '',
      subject: '',
      sender_details: {
        name: '',
        email: '',
        phone_number: '',
        address: '',
      },
      priority: 'NORMAL',
      mode_of_arrival: 'REGISTERED_POST',
      received_date: new Date().toISOString().split('T')[0],
      sent_date: undefined,
      content: '',
      attachments: undefined,
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
          Add New Letter
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
              {/* Reference Number */}
              <TextField
                fullWidth
                label="Reference Number"
                variant="outlined"
                value={formData.reference}
                onChange={handleInputChange('reference')}
                error={!!errors.reference}
                helperText={errors.reference}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* Subject */}
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                value={formData.subject}
                onChange={handleInputChange('subject')}
                error={!!errors.subject}
                helperText={errors.subject}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              {/* Sender Details Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Sender Details
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Sender Name"
                    variant="outlined"
                    value={formData.sender_details.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sender_details: {
                          ...prev.sender_details,
                          name: e.target.value,
                        },
                      }))
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={formData.sender_details.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sender_details: {
                            ...prev.sender_details,
                            email: e.target.value,
                          },
                        }))
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      value={formData.sender_details.phone_number}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sender_details: {
                            ...prev.sender_details,
                            phone_number: e.target.value,
                          },
                        }))
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.sender_details.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sender_details: {
                          ...prev.sender_details,
                          address: e.target.value,
                        },
                      }))
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Priority and Mode of Arrival */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={handleInputChange('priority')}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: priority.color,
                            }}
                          />
                          {priority.value}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
                  <InputLabel>Mode of Arrival</InputLabel>
                  <Select
                    value={formData.mode_of_arrival}
                    label="Mode of Arrival"
                    onChange={handleInputChange('mode_of_arrival')}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: 2,
                      },
                    }}
                  >
                    {modesOfArrival.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Date Fields */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Receiving Date"
                  type="date"
                  value={formData.received_date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  error={!!errors.received_date}
                  helperText={errors.received_date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Sent Date (Optional)"
                  type="date"
                  value={formData.sent_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sent_date: e.target.value || undefined }))}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>

              {/* Content/Description */}
              <TextField
                fullWidth
                label="Content"
                variant="outlined"
                multiline
                rows={4}
                value={formData.content}
                onChange={handleInputChange('content')}
                error={!!errors.content}
                helperText={errors.content}
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
                  Attachments
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
                  Upload Files (PNG, JPEG, PDF, DOCX)
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.docx"
                    onChange={handleFileUpload}
                  />
                </Button>

                {/* Attached Files List */}
                {(formData.attachments?.length || 0) > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Stack spacing={1}>
                      {formData.attachments?.map((file, index) => (
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
          Submit Letter
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddLetterDialog
