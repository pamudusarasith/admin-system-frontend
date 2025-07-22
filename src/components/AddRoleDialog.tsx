import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface AddRoleDialogProps {
  open: boolean
  onClose: () => void
  onSubmit?: (roleData: RoleFormData) => void
  editMode?: boolean
  initialData?: RoleFormData
}

interface RoleFormData {
  id?: string
  name: string
  description: string
  permissions: string[]
}

// Available permission sections and their actions
const PERMISSION_SECTIONS = [
  {
    id: 'USER_MANAGEMENT',
    label: 'User Management',
    permissions: [
      { id: 'user:read', label: 'Read' },
      { id: 'user:create', label: 'Create' },
      { id: 'user:update', label: 'Update' },
      { id: 'user:delete', label: 'Delete' },
    ],
  },
  {
    id: 'LETTER_MANAGEMENT',
    label: 'Letter Management',
    permissions: [
      { id: 'letter:read', label: 'Read' },
      { id: 'letter:create', label: 'Create' },
      { id: 'letter:update', label: 'Update' },
      { id: 'letter:delete', label: 'Delete' },
    ],
  },
  {
    id: 'CABINET_PAPER_MANAGEMENT',
    label: 'Cabinet Paper Management',
    permissions: [
      { id: 'cabinetPaper:read', label: 'Read' },
      { id: 'cabinetPaper:create', label: 'Create' },
      { id: 'cabinetPaper:update', label: 'Update' },
      { id: 'cabinetPaper:delete', label: 'Delete' },
    ],
  },
  {
    id: 'DIVISION_MANAGEMENT',
    label: 'Division Management',
    permissions: [
      { id: 'division:read', label: 'Read' },
      { id: 'division:create', label: 'Create' },
      { id: 'division:update', label: 'Update' },
      { id: 'division:delete', label: 'Delete' },
    ],
  },
] as const

export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editMode = false,
  initialData,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: [],
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof RoleFormData, string>>
  >({})

  // Reset form data when dialog opens or initial data changes
  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setFormData(initialData)
      } else {
        setFormData({
          name: '',
          description: '',
          permissions: [],
        })
      }
      setErrors({})
    }
  }, [open, editMode, initialData])

  const handleInputChange =
    (field: keyof RoleFormData) =>
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

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((id) => id !== permissionId)

      return { ...prev, permissions: newPermissions }
    })

    // Clear permission error when user changes selection
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected'
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
      name: '',
      description: '',
      permissions: [],
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {editMode ? 'Edit Role' : 'Add New Role'}
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
              {/* Role Name */}
              <TextField
                fullWidth
                label="Role Name"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
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

              {/* Permissions Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  Permissions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 2,
                  }}
                >
                  Select the permissions that users with this role should have
                </Typography>

                <FormControl
                  component="fieldset"
                  variant="standard"
                  error={!!errors.permissions}
                >
                  <FormGroup>
                    <Stack spacing={3}>
                      {PERMISSION_SECTIONS.map((section) => (
                        <Box key={section.id}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              mb: 1,
                            }}
                          >
                            {section.label}
                          </Typography>
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr 1fr',
                                md: '1fr 1fr 1fr 1fr',
                              },
                              gap: 1,
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                              backgroundColor: theme.palette.background.default,
                            }}
                          >
                            {section.permissions.map((permission) => (
                              <FormControlLabel
                                key={permission.id}
                                control={
                                  <Checkbox
                                    checked={formData.permissions.includes(
                                      permission.id,
                                    )}
                                    onChange={(event) =>
                                      handlePermissionChange(
                                        permission.id,
                                        event.target.checked,
                                      )
                                    }
                                    sx={{
                                      '&.Mui-checked': {
                                        color: theme.palette.primary.main,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      color: theme.palette.text.primary,
                                    }}
                                  >
                                    {permission.label}
                                  </Typography>
                                }
                                sx={{
                                  alignItems: 'center',
                                  m: 0,
                                  '& .MuiFormControlLabel-label': {
                                    ml: 1,
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </FormGroup>
                  {errors.permissions && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.error.main,
                        mt: 1,
                      }}
                    >
                      {errors.permissions}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Selected Permissions Summary */}
              {/* {formData.permissions.length > 0 && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.default,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Selected Permissions ({formData.permissions.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.permissions.map((permissionId) => {
                      const permission = AVAILABLE_PERMISSIONS.find(p => p.id === permissionId)
                      return (
                        <Chip
                          key={permissionId}
                          label={permission?.label || permissionId}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                          }}
                        />
                      )
                    })}
                  </Box>
                </Box>
              )} */}
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
          {editMode ? 'Update Role' : 'Create Role'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddRoleDialog
