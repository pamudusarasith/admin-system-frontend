import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    // First check authentication
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
        replace: true,
      })
    }

    // Check if account setup is required (except when already on account-setup page)
    if (location.pathname !== '/account-setup') {
      const profile = context.auth.profile

      if (profile?.accountSetupRequired) {
        throw redirect({
          to: '/account-setup',
          search: {
            // Save current location for redirect after account setup
            redirect: location.href,
          },
          replace: true,
        })
      }
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
