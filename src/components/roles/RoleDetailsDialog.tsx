import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Role } from '@/api'
import type { Permission, PermissionCategory } from '@/api/permissions'
import { getPermissions } from '@/api/permissions'

interface RoleDetailsDialogProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly role: Role | null
}

export function RoleDetailsDialog({
  open,
  onClose,
  role,
}: RoleDetailsDialogProps) {
  const theme = useTheme()
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  )

  // Fetch permissions to get labels and descriptions
  const { data: permissionsResponse } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000,
    enabled: open && Boolean(role),
  })

  const permissionCategories = permissionsResponse?.data ?? []

  if (!role) return null

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Filter categories to only show those with assigned permissions
  const getAssignedPermissionsForCategory = (
    category: PermissionCategory,
  ): Array<Permission> => {
    const assigned: Array<Permission> = []

    // Check direct permissions
    if (category.permissions) {
      for (const perm of category.permissions) {
        if (role.permissions.includes(perm.name)) {
          assigned.push(perm)
        }
      }
    }

    return assigned
  }

  const getAssignedPermissionsForSubCategory = (
    subCategory: PermissionCategory,
  ): Array<Permission> => {
    const assigned: Array<Permission> = []

    if (subCategory.permissions) {
      for (const perm of subCategory.permissions) {
        if (role.permissions.includes(perm.name)) {
          assigned.push(perm)
        }
      }
    }

    return assigned
  }

  const hasAnyAssignedPermissions = (category: PermissionCategory): boolean => {
    const directPerms = getAssignedPermissionsForCategory(category)
    if (directPerms.length > 0) return true

    return (
      category.subCategories?.some(
        (sub) => getAssignedPermissionsForSubCategory(sub).length > 0,
      ) ?? false
    )
  }

  const categoriesWithPermissions = permissionCategories.filter((category) =>
    hasAnyAssignedPermissions(category),
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SecurityIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {role.name}
              </Typography>
              <Chip
                label={`${role.permissions.length} ${role.permissions.length === 1 ? 'Permission' : 'Permissions'}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              {role.userCount !== undefined && (
                <Chip
                  icon={<PeopleIcon />}
                  label={`${role.userCount} ${role.userCount === 1 ? 'User' : 'Users'}`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>
            {role.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {role.description}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {role.permissions.length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.default',
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <SecurityIcon
              sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
            />
            <Typography variant="body1" color="text.secondary">
              No permissions assigned to this role
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {categoriesWithPermissions.map((category) => {
              const directPerms = getAssignedPermissionsForCategory(category)
              const subsWithPerms =
                category.subCategories?.filter(
                  (sub) => getAssignedPermissionsForSubCategory(sub).length > 0,
                ) ?? []

              return (
                <Box
                  key={category.id}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                  }}
                >
                  {/* Category Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        transition: 'transform 0.2s',
                        transform: expandedCategories.has(category.id)
                          ? 'rotate(180deg)'
                          : 'rotate(0deg)',
                      }}
                    >
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Category Content */}
                  {expandedCategories.has(category.id) && (
                    <>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        {/* Direct Permissions */}
                        {directPerms.length > 0 && (
                          <Stack
                            spacing={1}
                            sx={{ mb: subsWithPerms.length > 0 ? 2 : 0 }}
                          >
                            {directPerms.map((perm) => (
                              <Box
                                key={perm.id}
                                sx={{
                                  p: 1.5,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500, mb: 0.5 }}
                                >
                                  {perm.label}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {perm.description}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        )}

                        {/* Divider between direct permissions and subcategories */}
                        {directPerms.length > 0 && subsWithPerms.length > 0 && (
                          <Divider sx={{ my: 2 }} />
                        )}

                        {/* Sub Categories */}
                        {subsWithPerms.map((subCategory, idx) => {
                          const subPerms =
                            getAssignedPermissionsForSubCategory(subCategory)
                          return (
                            <Box key={subCategory.id}>
                              {idx > 0 && <Divider sx={{ my: 2 }} />}
                              <Box
                                sx={{
                                  p: 1,
                                  bgcolor: 'action.hover',
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {subCategory.name}
                                </Typography>
                              </Box>
                              <Stack spacing={1}>
                                {subPerms.map((perm) => (
                                  <Box
                                    key={perm.id}
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 1,
                                      bgcolor: 'background.paper',
                                      border: `1px solid ${theme.palette.divider}`,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 500, mb: 0.5 }}
                                    >
                                      {perm.label}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {perm.description}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          )
                        })}
                      </Box>
                    </>
                  )}
                </Box>
              )
            })}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}
