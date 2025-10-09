import type { Components, Theme } from '@mui/material/styles'

export const createComponents = (theme: Theme): Components<Theme> => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        boxShadow: `0 2px 8px ${theme.palette.primary.main}30`,
        '&:hover': {
          boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 18,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 30px rgba(0, 0, 0, 0.4)'
              : '0 8px 30px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      elevation1: {
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
              boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
            },
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 9,
        fontWeight: 500,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 9,
        margin: '2px 8px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}10`,
          transform: 'translateX(4px)',
        },
        '&.Mui-selected': {
          backgroundColor: `${theme.palette.primary.main}15`,
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}20`,
          },
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        height: 8,
      },
      bar: {
        borderRadius: 12,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 9,
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        marginTop: 4,
        minWidth: 180,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        margin: '2px 4px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}10`,
        },
      },
    },
  },
})
