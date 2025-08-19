import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
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
  },
  loader: ({ location }) => {
    // If user is accessing the authenticated root, redirect to dashboard
    if (location.pathname === '/') {
      throw redirect({ to: '/dashboard', replace: true })
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
