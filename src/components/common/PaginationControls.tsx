import {
  Box,
  MenuItem,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import type { Pagination as PaginationType } from '@/api'

export interface PaginationControlsProps {
  pagination: PaginationType
  onPageChange: (page?: number) => void
  onPageSizeChange: (size?: number) => void
  pageSizeOptions?: Array<number>
  showPageSize?: boolean
  siblingCount?: number
  boundaryCount?: number
}

export function PaginationControls({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  siblingCount = 1,
  boundaryCount = 1,
}: Readonly<PaginationControlsProps>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const { totalPages } = pagination

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    onPageChange(value)
  }

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    onPageSizeChange(Number(event.target.value))
  }

  if (totalPages === 0) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Left side: Page size selector and info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {showPageSize && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Items per page:
            </Typography>
            <Select
              value={pagination.pageSize}
              onChange={handleSizeChange}
              size="small"
              sx={{
                minWidth: 70,
                '& .MuiSelect-select': {
                  py: 0.5,
                  fontSize: '0.875rem',
                },
              }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>

      {/* Center/Right: Pagination controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Pagination
          count={totalPages}
          page={pagination.page + 1}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          siblingCount={isTablet ? 0 : siblingCount}
          boundaryCount={boundaryCount}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[2],
              },
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              boxShadow: theme.shadows[3],
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}
