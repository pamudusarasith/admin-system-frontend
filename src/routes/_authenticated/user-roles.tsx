import { createFileRoute } from '@tanstack/react-router'
import { AddButton, SearchBar } from '@/components'

export const Route = createFileRoute('/_authenticated/user-roles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <SearchBar
        placeholder="Search documents..."
        width="700px"
        height="50px"
        size="medium"
      />

      <div>
        <AddButton label="Add Task" onClick={() => console.log('Clicked')} />
      </div>
    </>
  )
}
