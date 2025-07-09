import { createFileRoute } from '@tanstack/react-router'
import { SearchBar } from '@/components'

export const Route = createFileRoute('/user-roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <SearchBar
        placeholder="Search..."
        minWidth="200px"
        minHeight="40px"
        fullWidth={false}
      />
    </div>
  )
}
