import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  ExpandLess,
  ExpandMore,
  MarkEmailUnread as MarkEmailUnreadIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { Link } from '@tanstack/react-router'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path?: string
  children?: Array<MenuItem>
}

const menuItems: Array<MenuItem> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <PeopleIcon />,
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        icon: <PeopleIcon />,
        path: '/users',
      },
      {
        id: 'users-roles',
        label: 'Roles & Permissions',
        icon: <SettingsIcon />,
        path: '/users/roles',
      },
    ],
  },
  {
    id: 'letters',
    label: 'Letter Management',
    icon: <EmailIcon />,
    children: [
      {
        id: 'all-letters',
        label: 'All Letters',
        icon: <EmailIcon />,
        path: '/letters',
      },
      {
        id: 'unassigned-letters',
        label: 'Unassigned Letters',
        icon: <MarkEmailUnreadIcon />,
        path: '/letters/unassigned',
      },
    ],
  },
  {
    id: 'cabinet',
    label: 'Cabinet Papers',
    icon: <ReceiptIcon />,
    children: [
      {
        id: 'all-letters',
        label: 'All Papers',
        icon: <ReceiptIcon />,
        path: '/papers',
      },
    ],
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [expandedItems, setExpandedItems] = useState<Array<string>>([])

  const handleItemToggle = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    )
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)

    if (hasChildren) {
      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleItemToggle(item.id)}
              sx={{
                minHeight: 48,
                px: 2.5,
                pl: depth * 2 + 2.5,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  },
                }}
              />
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      )
    }

    return (
      <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          component={Link}
          to={item.path || '/'}
          sx={{
            minHeight: 48,
            px: 2.5,
            pl: depth * 2 + 2.5,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.active': {
              backgroundColor: theme.palette.primary.main + '15',
              borderRight: `3px solid ${theme.palette.primary.main}`,
              '& .MuiListItemIcon-root': {
                color: theme.palette.primary.main,
              },
              '& .MuiListItemText-primary': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 3,
              justifyContent: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    )
  }

  const drawerWidth = 280

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 0,
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* User Profile */}
      <Box sx={{ p: 2, mt: theme.spacing(8) }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: theme.palette.primary.main,
            }}
          >
            JD
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              John Doe
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
    </Drawer>
  )
}
