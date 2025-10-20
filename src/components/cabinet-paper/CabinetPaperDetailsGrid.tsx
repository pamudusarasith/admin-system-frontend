import React from 'react'
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AttachFile as AttachIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  Update as UpdateIcon,
} from '@mui/icons-material'
import type { Attachment, Category, User } from '@/api'
import { getFileTypeDescription } from '@/utils'

interface CabinetPaperDetailsGridProps {
  submittedBy: User
  category: Category
  summary?: string
  attachments: Array<Attachment>
  createdAt: string
  updatedAt: string
}

export const CabinetPaperDetailsGrid: React.FC<
  CabinetPaperDetailsGridProps
> = ({ submittedBy, category, summary, attachments, createdAt, updatedAt }) => {
  const theme = useTheme()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDownload = (attachment: Attachment) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        mb: 3,
      }}
    >
      {/* Summary Section */}
      {summary && (
        <Paper
          sx={{
            p: 2.5,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 3,
            gridColumn: '1 / -1',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1.5, opacity: 0.75, letterSpacing: 0.5 }}
          >
            Summary
          </Typography>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}
            color="text.primary"
          >
            {summary}
          </Typography>
        </Paper>
      )}

      {/* Submitted By Card */}
      <Paper
        sx={{
          p: 2.5,
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, opacity: 0.75, letterSpacing: 0.5 }}
        >
          Submitted By
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {submittedBy.fullName
              ? submittedBy.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              : submittedBy.username[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {submittedBy.fullName || submittedBy.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {submittedBy.email}
            </Typography>
            {submittedBy.role && (
              <Typography variant="body2" color="text.secondary">
                {submittedBy.role}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Category Card */}
      <Paper
        sx={{
          p: 2.5,
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, opacity: 0.75, letterSpacing: 0.5 }}
        >
          Category
        </Typography>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="body2" color="text.secondary">
              {category.description}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Dates Card */}
      <Paper
        sx={{
          p: 2.5,
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, opacity: 0.75, letterSpacing: 0.5 }}
        >
          Timeline
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarIcon
              sx={{ fontSize: 20, color: theme.palette.primary.main }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatDate(createdAt)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <UpdateIcon
              sx={{ fontSize: 20, color: theme.palette.secondary.main }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatDate(updatedAt)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Attachments Card */}
      <Paper
        sx={{
          p: 2.5,
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, opacity: 0.75, letterSpacing: 0.5 }}
        >
          Attachments ({attachments.length})
        </Typography>
        {attachments.length > 0 ? (
          <Stack spacing={1.5}>
            {attachments.map((attachment) => (
              <Box
                key={attachment.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark'
                      ? t.palette.grey[800]
                      : t.palette.grey[50],
                  border: (t) => `1px solid ${t.palette.divider}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: (t) =>
                      t.palette.mode === 'dark'
                        ? t.palette.grey[700]
                        : t.palette.grey[100],
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1,
                  }}
                >
                  <AttachIcon
                    sx={{ fontSize: 20, color: theme.palette.primary.main }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {attachment.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getFileTypeDescription(
                        attachment.fileType || '',
                        attachment.fileName,
                      )}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDownload(attachment)}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '20',
                    },
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No attachments available
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
