import React, { useState } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  fullWidth?: boolean
  disabled?: boolean
  variant?: 'outlined' | 'filled' | 'standard'
  size?: 'small' | 'medium'
  autoFocus?: boolean
  debounceMs?: number
  minWidth?: string | number
  minHeight?: string | number
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  fullWidth = true,
  disabled = false,
  variant = 'outlined',
  size = 'medium',
  autoFocus = false,
  debounceMs = 300,
  minWidth,
  minHeight,
}) => {
  const theme = useTheme()
  const [internalValue, setInternalValue] = useState('')
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  )

  const isControlled = controlledValue !== undefined
  const searchValue = isControlled ? controlledValue : internalValue

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }

    // Debounced search
    if (onSearch && debounceMs > 0) {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      const timer = setTimeout(() => {
        onSearch(newValue)
      }, debounceMs)

      setDebounceTimer(timer)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onSearch?.(searchValue)

      // Clear debounce timer since we're searching immediately
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        setDebounceTimer(null)
      }
    }
  }

  const handleClear = () => {
    const newValue = ''

    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
    }

    onClear?.()
    onSearch?.(newValue)

    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      setDebounceTimer(null)
    }
  }

  const handleSearchClick = () => {
    onSearch?.(searchValue)
  }

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : 'auto',
        minWidth: minWidth,
        minHeight: minHeight,
      }}
    >
      <TextField
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={handleSearchClick}
                disabled={disabled}
                size={size}
                sx={{
                  color: theme.palette.action.active,
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                disabled={disabled}
                size={size}
                sx={{
                  color: theme.palette.action.active,
                  '&:hover': {
                    color: theme.palette.error.main,
                  },
                }}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              '& fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
            '&.Mui-focused': {
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
              '& fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputBase-input': {
            fontSize: size === 'small' ? '0.875rem' : '1rem',
            fontWeight: 400,
            '&::placeholder': {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          },
        }}
      />
    </Box>
  )
}

export default SearchBar
