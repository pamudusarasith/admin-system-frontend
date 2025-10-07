import React from 'react'
import {
  Box,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'

interface FileUploadFieldProps {
  field: {
    state: {
      value: Array<File>
      meta: {
        isValid: boolean
        errors: Array<
          | {
              message?: string
            }
          | undefined
        >
      }
    }
    pushValue: (value: File) => void
    removeValue: (index: number) => void
    validate: (cause: 'change' | 'blur' | 'submit') => unknown
  }
  label?: string
  accept?: Record<string, Array<string>>
  maxSize?: number
  multiple?: boolean
  helperText?: string
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  label = 'Attachments',
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = true,
  helperText = 'Drag & drop files here, or click to select',
}) => {
  const theme = useTheme()

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept,
      maxSize,
      multiple,
      onDrop: (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
          field.pushValue(file)
        })
        // Validate after adding files
        setTimeout(() => field.validate('change'), 100)
      },
    })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = () => {
    // You can customize icons based on file type
    return <FileIcon />
  }

  const getBorderColor = () => {
    if (isDragReject) return theme.palette.error.main
    if (isDragActive) return theme.palette.success.main
    if (!field.state.meta.isValid) return theme.palette.error.main
    return theme.palette.primary.main
  }

  const getBackgroundColor = () => {
    if (isDragReject) return alpha(theme.palette.error.main, 0.08)
    if (isDragActive) return alpha(theme.palette.success.main, 0.08)
    return alpha(theme.palette.primary.main, 0.04)
  }

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        {label}
      </Typography>

      {/* Dropzone Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${getBorderColor()}`,
          borderRadius: 3,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: getBackgroundColor(),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: isDragReject
              ? theme.palette.error.dark
              : theme.palette.primary.dark,
            backgroundColor: isDragReject
              ? alpha(theme.palette.error.main, 0.12)
              : alpha(theme.palette.primary.main, 0.08),
            transform: 'scale(1.01)',
          },
          '&:active': {
            transform: 'scale(0.99)',
          },
        }}
      >
        <input {...getInputProps()} />

        {/* Upload Icon with Animation */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            mb: 2,
            transition: 'all 0.3s ease',
            ...(isDragActive && {
              backgroundColor: alpha(theme.palette.success.main, 0.2),
              transform: 'scale(1.1)',
            }),
            ...(isDragReject && {
              backgroundColor: alpha(theme.palette.error.main, 0.2),
            }),
          }}
        >
          <UploadIcon
            sx={{
              fontSize: 32,
              color: (() => {
                if (isDragReject) return theme.palette.error.main
                if (isDragActive) return theme.palette.success.main
                return theme.palette.primary.main
              })(),
              transition: 'all 0.3s ease',
              ...(isDragActive && {
                animation: 'bounce 0.6s ease infinite',
              }),
            }}
          />
        </Box>

        {/* Text Content */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: (() => {
              if (isDragReject) return theme.palette.error.main
              if (isDragActive) return theme.palette.success.main
              return theme.palette.text.primary
            })(),
            mb: 0.5,
          }}
        >
          {(() => {
            if (isDragReject) return 'File type not accepted'
            if (isDragActive) return 'Drop files here'
            return 'Upload Files'
          })()}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 1,
          }}
        >
          {helperText}
        </Typography>

        {Boolean(maxSize) && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              display: 'block',
            }}
          >
            Maximum file size: {formatFileSize(maxSize)}
          </Typography>
        )}

        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            ...(isDragActive && {
              opacity: 1,
            }),
          }}
        />
      </Box>

      {/* Error Message */}
      {!field.state.meta.isValid && field.state.meta.errors.length > 0 && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.error.main,
            mt: 1,
            fontSize: '0.875rem',
          }}
        >
          {field.state.meta.errors.map((e) => e?.message).join(', ')}
        </Typography>
      )}

      {/* Selected Files List */}
      {field.state.value.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.secondary,
              mb: 1.5,
            }}
          >
            Selected Files ({field.state.value.length})
          </Typography>
          <Stack spacing={1}>
            {field.state.value.map((file: File, i: number) => (
              <Box
                key={`${file.name}-${i}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    transform: 'translateX(4px)',
                  },
                }}
              >
                {/* File Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    flexShrink: 0,
                  }}
                >
                  {getFileIcon()}
                </Box>

                {/* File Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>

                {/* Delete Button */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    field.removeValue(i)
                    setTimeout(() => field.validate('change'), 100)
                  }}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    flexShrink: 0,
                    '&:hover': {
                      color: theme.palette.error.main,
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Keyframes for bounce animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </Box>
  )
}
