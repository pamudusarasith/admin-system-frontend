import { createFileRoute } from '@tanstack/react-router'
import { SearchBar } from '@/components'

export const Route = createFileRoute('/user-roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SearchBar
      placeholder="Search documents..."
      width="300px"
      height="100px"
      size="medium"
    />
  )
}
