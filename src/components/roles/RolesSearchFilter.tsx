import { Box } from '@mui/material'
import { SearchBar } from '@/components'

interface RolesSearchFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearch: (value: string) => void
}

export function RolesSearchFilter({
  searchTerm,
  onSearchChange,
  onSearch,
}: Readonly<RolesSearchFilterProps>) {
  return (
    <Box
      sx={{
        maxWidth: '1300px',
        mx: 'auto',
        mb: 3,
      }}
    >
      <SearchBar
        placeholder="Search roles by name or description..."
        value={searchTerm}
        onChange={onSearchChange}
        onSearch={onSearch}
      />
    </Box>
  )
}
