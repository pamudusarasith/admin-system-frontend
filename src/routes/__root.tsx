import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { AuthState } from '@/auth'
import { ThemeProvider } from '@/theme'

interface RouterContext {
  auth: AuthState
}

const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <ThemeProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  ),
})
