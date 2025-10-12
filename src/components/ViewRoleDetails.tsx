import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
  Popover,
} from '@mui/material'
import {
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material'
import type { Role } from '@/api'

interface ViewRoleDetailsProps {
  open: boolean
  onClose: () => void
  role: (Role & { userCount?: number; icon?: React.ReactNode }) | null
}

const ViewRoleDetails: React.FC<ViewRoleDetailsProps> = ({
  open,
  onClose,
  role,
}) => {
  const theme = useTheme()

  if (!role) return null

  const getIconForRole = (roleName: string): React.ReactNode => {
    const name = roleName.toLowerCase()
    if (name.includes('admin')) return <AdminIcon />
    if (name.includes('manager')) return <BusinessIcon />
    if (name.includes('support')) return <SupportIcon />
    return <PersonIcon />
  }


  // Group permissions by mainCategory and subCategory
  type PermissionObj = {
    mainCategory: string
    subCategory: string | null
    label: string
    description?: string
  }
  // Also keep a map of label to description for quick lookup
  const groupPermissions = (permissions: PermissionObj[]) => {
    const grouped: Record<string, Record<string, PermissionObj[]>> = {}
    permissions.forEach((perm) => {
      const main = perm.mainCategory || 'Other'
      const sub = perm.subCategory || ''
      if (!grouped[main]) grouped[main] = {}
      if (!grouped[main][sub]) grouped[main][sub] = []
      grouped[main][sub].push(perm)
    })
    return grouped
  }
  const groupedPermissions = groupPermissions(role.permissions as any)

  // State for popover
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [popoverContent, setPopoverContent] = useState<string>('')
  const handleInfoClick = (event: React.MouseEvent<HTMLElement>, description?: string) => {
    setAnchorEl(event.currentTarget)
    setPopoverContent(description || 'No description available')
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
    setPopoverContent('')
  }
  const openPopover = Boolean(anchorEl)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        },
      }}
    >
      {/* Header Section */}
      <DialogTitle
        sx={{
          p: 0,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ p: 3, position: 'relative' }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: theme.palette.text.secondary,
              '&:hover': {
                bgcolor: `${theme.palette.primary.main}20`,
                color: theme.palette.primary.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: -3,
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  zIndex: -1,
                  opacity: 0.8,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  width: 72,
                  height: 72,
                  border: `3px solid ${theme.palette.background.paper}`,
                  fontSize: '2rem',
                }}
              >
                {role.icon || getIconForRole(role.name)}
              </Avatar>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {role.name}
              </Typography>
              <Box
                sx={{
                  width: 60,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 2,
                  mb: 1,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                {role.description}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogTitle>

      {/* Content Section */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Stats Section */}
          <Box
            sx={{
              display: 'flex',
              gap: 8,
              mb: 4,
              flexWrap: 'wrap',
              overflowY: 'auto',
              marginLeft: { xs: 0, sm: '24px', md: '50px' },
              marginRight: { xs: 0, sm: '24px', md: '50px' },
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <Box sx={{ flex: 1, maxWidth: '250px' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.main}20 100%)`,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  borderRadius: 3,
                  position: 'relative',
                  minHeight: 110,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: theme.palette.primary.main,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <PeopleIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.primary.main,
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                    mb: 0.2,
                  }}
                >
                  {role.userCount ?? 0}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Active Users
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, maxWidth: '250px' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}10 0%, ${theme.palette.secondary.main}20 100%)`,
                  border: `1px solid ${theme.palette.secondary.main}30`,
                  borderRadius: 3,
                  position: 'relative',
                  minHeight: 110,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: theme.palette.secondary.main,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <SecurityIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.secondary.main,
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.secondary.main,
                    mb: 0.2,
                  }}
                >
                  {role.permissions.length}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Permissions
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, maxWidth: '250px' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.success.main}10 0%, ${theme.palette.success.main}20 100%)`,
                  border: `1px solid ${theme.palette.success.main}30`,
                  borderRadius: 3,
                  position: 'relative',
                  minHeight: 110,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: theme.palette.success.main,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <CheckIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.success.main,
                    mb: 0.5,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.success.main,
                    mb: 0.2,
                  }}
                >
                  Active
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Status
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Permissions Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <SecurityIcon color="primary" />
              Permissions & Access Control
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(groupedPermissions).map(([mainCategory, subGroups]) => (
                <Box key={mainCategory} sx={{ flex: 1 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      background: theme.palette.background.paper,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 3.5,
                      }}
                    >
                      {mainCategory}
                    </Typography>
                    {Object.entries(subGroups).map(([subCategory, perms], idx, arr) => (
                      <React.Fragment key={subCategory}>
                        <Box sx={{ ml: subCategory ? 2 : 0, mb: 1 }}>
                          {subCategory && (
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 500, color: theme.palette.text.secondary, mb: 2.5 }}
                            >
                              {subCategory}
                            </Typography>
                          )}
                          <Box sx={{ mb: 3 }} />
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr',
                                md: '1fr 1fr',
                                lg: '1fr 1fr 1fr',
                              },
                              gap: 2.5,
                            }}
                          >
                            {perms.map((perm, lidx) => (
                              <Box
                                key={perm.label + lidx}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  background: `${theme.palette.primary.main}10`,
                                  color: theme.palette.text.primary,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  mb: 1.5,
                                  gap: 0.5,
                                }}
                              >
                                {perm.label}
                                <IconButton
                                  size="small"
                                  sx={{ ml: 0.5, p: 0.5 }}
                                  aria-label={`Show info for ${perm.label}`}
                                  onClick={e => handleInfoClick(e, perm.description)}
                                >
                                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="12" cy="12" r="10" stroke={theme.palette.primary.main} strokeWidth="2" fill="none" />
                                      <rect x="11" y="10" width="2" height="6" rx="1" fill={theme.palette.primary.main} />
                                      <rect x="11" y="7" width="2" height="2" rx="1" fill={theme.palette.primary.main} />
                                    </svg>
                                  </Box>
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        {typeof idx !== 'undefined' && arr && idx < arr.length - 1 && (
                          <Box sx={{ my: 1 }}>
                            <Divider sx={{ ml: subCategory ? 2 : 0 }} />
                          </Box>
                        )}
                      </React.Fragment>
                    ))}
                  </Paper>
                </Box>
              ))}
              {/* Popover for permission description */}
              <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { p: 2, maxWidth: 300 } }}
              >
                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                  {popoverContent}
                </Typography>
              </Popover>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            marginTop: 2,
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewRoleDetails
