import { createFileRoute } from '@tanstack/react-router'
import { SidebarLayout } from '@/components'
import { ProtectedRoute } from '@/AuthProvider'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <ProtectedRoute>
      <SidebarLayout>hi</SidebarLayout>
    </ProtectedRoute>
  )
}
