import { createFileRoute } from '@tanstack/react-router'
import {
  ErrorOutline as ErrorOutlineIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { ErrorPage } from '../components'

export const Route = createFileRoute('/500')({
  component: Error500Page,
})

function Error500Page() {
  const buttons = [
    {
      label: 'Refresh Page',
      icon: <RefreshIcon />,
      to: '/',
      variant: 'contained' as const,
    },
    {
      label: 'Go Home',
      icon: <HomeIcon />,
      to: '/',
      variant: 'outlined' as const,
    },
  ]

  return (
    <ErrorPage
      errorCode="500"
      title="Internal Server Error"
      description="Something went wrong on our end. We're working to fix this issue. Please try again in a few moments."
      icon={<ErrorOutlineIcon />}
      buttons={buttons}
      helpText="If the problem persists, please contact our support team"
    />
  )
}
