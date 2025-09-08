import React from 'react'
import { Box, Paper, Typography, LinearProgress } from '@mui/material'
// Removed Grid import

interface DivisionWorkloadProps {
  divisionName: string
  totalTasks: number
  completedTasks: number
  pendingTasks: number
}

const DivisionWorkloadCard: React.FC<DivisionWorkloadProps> = ({
  divisionName,
  totalTasks,
  completedTasks,
  pendingTasks,
}) => {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {divisionName}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {completedTasks} / {totalTasks} tasks completed
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="body2" color="primary">
          Completed: {completedTasks}
        </Typography>
        <Typography variant="body2" color="warning.main">
          Pending: {pendingTasks}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {totalTasks}
        </Typography>
      </Box>
    </Paper>
  )
}

export default DivisionWorkloadCard
