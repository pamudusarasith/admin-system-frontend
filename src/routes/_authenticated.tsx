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

    // Check if account setup is required (except when already on profile page)
    if (location.pathname !== '/profile') {
      const profile = context.auth.profile

      if (profile?.accountSetupRequired) {
        throw redirect({
          to: '/profile',
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
