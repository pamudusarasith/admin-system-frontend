import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '@/theme'
import { AuthProvider } from '@/AuthProvider'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  ),
})
