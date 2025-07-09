import { createFileRoute } from '@tanstack/react-router'
import { SearchBar } from '@/components'

export const Route = createFileRoute('/user-roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SearchBar placeholder="Search users..." size="medium" />
    </div>
  )
}
