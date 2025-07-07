import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  SearchOff as SearchOffIcon,
} from '@mui/icons-material'
import { ErrorPage } from '../components'

export const Route = createFileRoute('/404')({
  component: Error404Page,
})

function Error404Page() {
  const buttons = [
    {
      label: 'Go Home',
      icon: <HomeIcon />,
      to: '/',
      variant: 'contained' as const,
    },
    {
      label: 'Go Back',
      icon: <ArrowBackIcon />,
      to: '/',
      variant: 'outlined' as const,
      navigateOptions: { replace: true },
    },
  ]

  return (
    <ErrorPage
      errorCode="404"
      title="Page Not Found"
      description="The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
      icon={<SearchOffIcon />}
      buttons={buttons}
      helpText="Check the URL for typos or use the navigation menu to find what you're looking for"
    />
  )
}
