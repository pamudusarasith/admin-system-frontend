import React from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Paper,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import { useNavigate } from '@tanstack/react-router'
import type { CabinetPaper } from '@/api'

interface CabinetPaperHeaderProps {
  paper: CabinetPaper
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void
  getStatusColor: (status: string) => string
  getCategoryColor: (category: string) => string
}

export const CabinetPaperHeader: React.FC<CabinetPaperHeaderProps> = ({
  paper,
  onMenuClick,
  getStatusColor,
  getCategoryColor,
}) => {
  const navigate = useNavigate()

  return (
    <Box sx={{ mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate({ to: '/cabinet-papers' })}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Cabinet Papers
      </Button>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/cabinet-papers">
          Cabinet Papers
        </Link>
        <Typography color="text.primary">{paper.referenceId}</Typography>
      </Breadcrumbs>

      {/* Cabinet Paper Title Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          backgroundColor: (t) => t.palette.background.paper,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 1, lineHeight: 1.25 }}
            >
              {paper.subject}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Reference: {paper.referenceId}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Chip
                label={paper.category.name}
                size="small"
                sx={{
                  px: 1,
                  fontSize: 11,
                  letterSpacing: 0.4,
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: getCategoryColor(paper.category.name),
                }}
              />
              <Chip
                label={
                  typeof paper.status === 'string'
                    ? paper.status.replaceAll('_', ' ')
                    : String(paper.status).replaceAll('_', ' ')
                }
                size="small"
                sx={{
                  px: 1,
                  fontSize: 11,
                  letterSpacing: 0.4,
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: getStatusColor(String(paper.status)),
                }}
              />
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Button
              variant="outlined"
              onClick={onMenuClick}
              sx={{ minWidth: 40, borderRadius: 2 }}
            >
              <MoreVertIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
