import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme as useMuiTheme,
} from '@mui/material'
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useNavigate } from '@tanstack/react-router'
import { useTheme as useThemeContext } from '@/theme'
import { useAuth } from '@/core'

// Import the WebSocket service
import { webSocketService } from '@/services/WebSocketService'

// Define a type for our notification object
interface Notification {
  title: string
  message: string
  link?: string
}

interface NavbarProps {
  onMenuClick: () => void
}

// --- ADD THIS HELPER FUNCTION ---
/**
 * Safely extracts the token from the user object, which currently
 * has an incomplete type definition in the core auth module.
 * @param user The user object from the auth context.
 * @returns The user's JWT token, or undefined if not available.
 */
const getAuthToken = (user: any): string | undefined => {
  return user?.token
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const theme = useMuiTheme()
  const auth = useAuth()
  const navigate = useNavigate()
  const { mode, toggleTheme } = useThemeContext()

  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null)
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] =
    useState<null | HTMLElement>(null)

  // State for real-time notifications
  const [notifications, setNotifications] = useState<Array<Notification>>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // useEffect hook to manage the WebSocket connection
  // ... inside your Navbar component
  useEffect(() => {
    // --- USE THE HELPER FUNCTION HERE ---
    const token = getAuthToken(auth.user)

    if (token) {
      // ... the rest of your logic is unchanged
      const onNotificationReceived = (newNotification: Notification) => {
        setNotifications((prev) => [newNotification, ...prev])
        setUnreadCount((prev) => prev + 1)
      }
      webSocketService.connect(token, onNotificationReceived)
    }

    return () => {
      webSocketService.disconnect()
    }
  }, [auth.user]) // --- UPDATE THE DEPENDENCY ---

  // Helper function to get user initials
  const getUserInitials = () => {
    if (auth.profile?.fullName) {
      return auth.profile.fullName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (auth.user?.fullName) {
      return auth.user.fullName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return auth.user?.username
      ? auth.user.username.slice(0, 2).toUpperCase()
      : 'U'
  }

  // Helper function to get display name
  const getDisplayName = () => {
    return (
      auth.profile?.fullName ||
      auth.user?.fullName ||
      auth.user?.username ||
      'User'
    )
  }

  // Helper function to get user email
  const getUserEmail = () => {
    return auth.profile?.email || 'user@example.com'
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null)
  }

  const handleNotificationsMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setNotificationsMenuAnchor(event.currentTarget)
    setUnreadCount(0) // Reset unread count when menu is opened
  }

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null)
  }

  const handleLogout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Navigate to login regardless of logout success/failure
      handleProfileMenuClose()
      navigate({ to: '/login', search: { redirect: '/' } })
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={onMenuClick}
            edge="start"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button */}
          <Tooltip title="Search">
            <IconButton
              size="large"
              aria-label="search"
              color="inherit"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip
            title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
          >
            <IconButton
              size="large"
              aria-label="toggle theme"
              color="inherit"
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                invisible={unreadCount === 0}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 200,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" color="text.primary">
              {getDisplayName()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getUserEmail()}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          id="notifications-menu"
          anchorEl={notificationsMenuAnchor}
          open={Boolean(notificationsMenuAnchor)}
          onClose={handleNotificationsMenuClose}
          onClick={handleNotificationsMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 300,
              maxWidth: 400,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="h6" color="text.primary">
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  if (notification.link) navigate({ to: notification.link })
                  handleNotificationsMenuClose()
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.primary">
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <ListItemText primary="You have no new notifications" />
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
