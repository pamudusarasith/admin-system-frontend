import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import {
  Article as ArticleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import type { CabinetPaper } from '@/api'

interface CabinetPaperCardProps {
  readonly paper: CabinetPaper
  readonly index: number
  readonly onCardClick: (id: number) => void
  readonly formatTimeAgo: (date: string) => string
  readonly getStatusColor: (status: string) => string
  readonly getCategoryColor: (category: string) => string
}

export function CabinetPaperCard({
  paper,
  index,
  onCardClick,
  formatTimeAgo,
  getStatusColor,
  getCategoryColor,
}: CabinetPaperCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
          borderColor: (theme) => theme.palette.primary.main,
        },
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
        '@keyframes fadeInUp': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
      onClick={() => onCardClick(paper.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
              flexShrink: 0,
            }}
          >
            <ArticleIcon
              sx={{
                fontSize: 28,
                color: 'primary.main',
              }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header: Reference ID and Status */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  letterSpacing: 0.5,
                }}
              >
                {paper.referenceId}
              </Typography>
              <Chip
                label={
                  typeof paper.status === 'string'
                    ? paper.status
                    : String(paper.status)
                }
                size="small"
                sx={{
                  backgroundColor: getStatusColor(String(paper.status)),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  borderRadius: 1.5,
                }}
              />
            </Box>

            {/* Subject */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {paper.subject}
            </Typography>

            {/* Summary */}
            {paper.summary && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.6,
                }}
              >
                {paper.summary}
              </Typography>
            )}

            {/* Footer: Category, Submitter, Date */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 3 }}
              sx={{ mt: 2 }}
            >
              {/* Category */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={paper.category.name || '—'}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: getCategoryColor(paper.category.name || ''),
                    color: getCategoryColor(paper.category.name || ''),
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              </Box>

              {/* Submitter */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                }}
              >
                <PersonIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {paper.submittedByUser.fullName ||
                    paper.submittedByUser.username}
                </Typography>
              </Box>

              {/* Date */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                }}
              >
                <CalendarIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {formatTimeAgo(paper.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
