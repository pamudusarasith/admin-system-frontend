import { createFileRoute } from '@tanstack/react-router'
import {
  Home as HomeIcon,
  Lock as LockIcon,
  Login as LoginIcon,
} from '@mui/icons-material'
import { ErrorPage } from '../components'

export const Route = createFileRoute('/401')({
  component: Error401Page,
})

function Error401Page() {
  const buttons = [
    {
      label: 'Sign In',
      icon: <LoginIcon />,
      to: '/login',
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
      errorCode="401"
      title="Unauthorized Access"
      description="Sorry, you don't have permission to access this resource. Please check your credentials or contact an administrator for assistance."
      icon={<LockIcon />}
      buttons={buttons}
    />
  )
}
