import { createFileRoute } from '@tanstack/react-router'
import { SidebarLayout, AdminDashboard } from '@/components'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <SidebarLayout>
      <AdminDashboard />
    </SidebarLayout>
  )
}
