import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard, SidebarLayout } from '@/components'

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
