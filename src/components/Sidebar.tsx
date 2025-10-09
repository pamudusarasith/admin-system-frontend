import React, { useEffect, useState } from 'react'
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
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Email as EmailIcon,
  ExpandLess,
  ExpandMore,
  MarkEmailUnread as MarkEmailUnreadIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { Link } from '@tanstack/react-router'
import { Permission as P, useAuth } from '@/core'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  authorities?: Array<string>
  path?: {
    to: string
    search?: { [key: string]: string }
  }
  children?: Array<MenuItem>
}

const menuItems: Array<MenuItem> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: { to: '/' },
  },
  {
    id: 'letters',
    label: 'Letter Management',
    icon: <EmailIcon />,
    authorities: [
      P.letterAllRead,
      P.letterUnassignedRead,
      P.letterDivisionRead,
      P.letterOwnRead,
    ],
    children: [
      {
        id: 'all-letters',
        label: 'All Letters',
        icon: <EmailIcon />,
        path: { to: '/letters' },
      },
      {
        id: 'pending-division',
        label: 'Pending Division Assignment',
        icon: <ScheduleIcon />,
        authorities: [P.letterAllRead, P.letterUnassignedRead],
        path: { to: '/letters', search: { status: 'NEW' } },
      },
      {
        id: 'pending-person',
        label: 'Assigned to Division',
        icon: <AssignmentIcon />,
        authorities: [P.letterAllRead, P.letterDivisionRead],
        path: { to: '/letters', search: { status: 'ASSIGNED_TO_DIVISION' } },
      },
      {
        id: 'my-letters',
        label: 'My Assigned Letters',
        icon: <MarkEmailUnreadIcon />,
        authorities: [P.letterAllRead, P.letterOwnRead],
        path: { to: '/letters', search: { status: 'ASSIGNED_TO_OFFICER' } },
      },
    ],
  },
  {
    id: 'divisions',
    label: 'Division Management',
    icon: <BusinessIcon />,
    children: [
      {
        id: 'all-divisions',
        label: 'All Divisions',
        icon: <BusinessIcon />,
        path: { to: '/divisions' },
      },
      {
        id: 'division-workload',
        label: 'Division Workload',
        icon: <AssignmentIcon />,
        path: { to: '/divisions/workload' },
      },
    ],
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
        path: { to: '/users' },
      },
      {
        id: 'users-roles',
        label: 'Roles & Permissions',
        icon: <SettingsIcon />,
        path: { to: '/roles' },
      },
    ],
  },
  {
    id: 'cabinet',
    label: 'Cabinet Papers',
    icon: <ReceiptIcon />,
    children: [
      {
        id: 'all-papers',
        label: 'All Papers',
        icon: <ReceiptIcon />,
        path: { to: '/papers' },
      },
    ],
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme()
  const { hasAnyAuthority } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [expandedItems, setExpandedItems] = useState<Array<string>>([])
  const [selectedId, setSelectedId] = useState<string>('dashboard')

  useEffect(() => {
    const storedSelectedId = localStorage.getItem('selectedSidebarItem')
    if (storedSelectedId) {
      setSelectedId(storedSelectedId)
    }
  }, [])

  const handleItemToggle = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    )
  }

  const handleItemSelect = (itemId: string) => {
    localStorage.setItem('selectedSidebarItem', itemId)
    setSelectedId(itemId)
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (item.authorities && !hasAnyAuthority(item.authorities)) return null

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
        <Link
          to={item.path?.to || '/'}
          search={item.path?.search}
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
              pl: depth * 2 + 2.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                borderRight: `3px solid ${theme.palette.primary.main}`,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
                borderLeft: 0,
              },
            }}
            selected={item.id === selectedId}
            onClick={() => handleItemSelect(item.id)}
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
        </Link>
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
