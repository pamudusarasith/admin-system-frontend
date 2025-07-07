import { createFileRoute } from '@tanstack/react-router'
import {
  Home as HomeIcon,
  Login as LoginIcon,
  NoAccounts as NoAccountsIcon,
} from '@mui/icons-material'
import { ErrorPage } from '../components'

export const Route = createFileRoute('/403')({
  component: Error403Page,
})

function Error403Page() {
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
      errorCode="403"
      title="Access Forbidden"
      description="You don't have the necessary permissions to access this resource. If you believe this is an error, please contact your administrator."
      icon={<NoAccountsIcon />}
      buttons={buttons}
    />
  )
}
