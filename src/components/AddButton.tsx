import React from 'react'
import { Button, IconButton, Tooltip, useTheme } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { SxProps, Theme } from '@mui/material'

interface AddButtonProps {
  /**
   * Text to display on the button. If not provided, only the icon will be shown.
   */
  label?: string
  /**
   * Function to call when the button is clicked.
   */
  onClick?: () => void
  /**
   * Whether the button is in a loading state.
   */
  loading?: boolean
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean
  /**
   * The tooltip text to display on hover.
   */
  tooltip?: string
  /**
   * The size of the button. Defaults to 'medium'.
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * The variant of the button. Defaults to 'contained'.
   */
  variant?: 'text' | 'outlined' | 'contained'
  /**
   * The color of the button. Defaults to 'primary'.
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  /**
   * Whether to use a circular icon button. Defaults to false (or true when no label is provided).
   */
  iconOnly?: boolean
  /**
   * CSS properties to apply to the button.
   */
  sx?: SxProps<Theme>
  /**
   * Additional custom icon to use instead of the default AddIcon.
   */
  icon?: React.ReactNode
  /**
   * Whether the button should take the full width of its container.
   */
  fullWidth?: boolean
}

/**
 * A customizable button for adding items or triggering create actions,
 * that respects the application's theme.
 */
export const AddButton: React.FC<AddButtonProps> = ({
  label,
  onClick,
  loading = false,
  disabled = false,
  tooltip,
  size = 'medium',
  variant = 'contained',
  color = 'primary',
  iconOnly: forcedIconOnly,
  sx = {},
  icon,
  fullWidth = false,
}) => {
  const theme = useTheme()

  // If iconOnly is explicitly set, use that. Otherwise, if no label is provided, default to icon-only
  const iconOnly = forcedIconOnly !== undefined ? forcedIconOnly : !label

  const buttonSizes = {
    small: {
      padding: iconOnly ? '6px' : '6px 12px',
      fontSize: '0.8125rem',
      iconSize: '1rem',
    },
    medium: {
      padding: iconOnly ? '8px' : '8px 16px',
      fontSize: '0.875rem',
      iconSize: '1.25rem',
    },
    large: {
      padding: iconOnly ? '12px' : '12px 24px',
      fontSize: '0.9375rem',
      iconSize: '1.5rem',
    },
  }

  const currentSize = buttonSizes[size]
  const IconComponent = icon || <AddIcon fontSize={size} />

  const buttonStyles = {
    borderRadius: iconOnly ? '50%' : '16px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: variant === 'contained' ? theme.shadows[2] : 'none',
    transition: 'all 0.3s ease',
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: variant === 'contained' ? theme.shadows[4] : 'none',
    },
    ...(sx as any),
  }

  return tooltip ? (
    <Tooltip title={tooltip}>
      {iconOnly ? (
        <IconButton
          color={color}
          size={size}
          disabled={disabled || loading}
          onClick={onClick}
          sx={buttonStyles}
          aria-label={label || tooltip || 'Add'}
        >
          {IconComponent}
        </IconButton>
      ) : (
        <Button
          variant={variant}
          color={color}
          size={size}
          disabled={disabled || loading}
          onClick={onClick}
          startIcon={IconComponent}
          sx={buttonStyles}
          fullWidth={fullWidth}
        >
          {label}
        </Button>
      )}
    </Tooltip>
  ) : iconOnly ? (
    <IconButton
      color={color}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      sx={buttonStyles}
      aria-label={label || 'Add'}
    >
      {IconComponent}
    </IconButton>
  ) : (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={IconComponent}
      sx={buttonStyles}
      fullWidth={fullWidth}
    >
      {label}
    </Button>
  )
}

export default AddButton
