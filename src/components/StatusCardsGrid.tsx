import React from 'react'
import { Box, useTheme } from '@mui/material'
import {
  Assignment as AssignmentIcon,
  Inbox as InboxIcon,
  Reply as ReplyIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { StatusCard } from './StatusCard'

interface StatusCardsGridProps {
  statusCounts: Record<string, number>
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  getStatusColor: (status: string) => string
}

export const StatusCardsGrid: React.FC<StatusCardsGridProps> = ({
  statusCounts,
  statusFilter,
  onStatusFilterChange,
  getStatusColor,
}) => {
  const theme = useTheme()
  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'Pending':
        return <ScheduleIcon />
      case 'In Progress':
        return <TrendingUpIcon />
      case 'Completed':
        return <AssignmentIcon />
      case 'Returned':
        return <ReplyIcon />
      default:
        return <InboxIcon />
    }
  }

  const getStatusColorForCard = (type: string) => {
    if (type === 'All') return theme.palette.grey[500]
    return getStatusColor(type)
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(5, 1fr)',
        },
        gap: 2,
        mb: 4,
      }}
    >
      {Object.entries(statusCounts).map(([statusType, count]) => (
        <StatusCard
          key={statusType}
          statusText={statusType}
          value={count.toString()}
          icon={getStatusIcon(statusType)}
          isSelected={statusFilter === statusType}
          color={getStatusColorForCard(statusType)}
          onClick={() => onStatusFilterChange(statusType)}
        />
      ))}
    </Box>
  )
}
