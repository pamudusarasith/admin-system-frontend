import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { PermissionItem } from './PermissionItem'
import { SubCategory } from './SubCategory'
import type { PermissionCategory as PermissionCategoryType } from '@/api/permissions'

interface CategoryHeaderProps {
  readonly category: PermissionCategoryType
  readonly isExpanded: boolean
  readonly isAllSelected: boolean
  readonly isIndeterminate: boolean
  readonly onToggleExpand: () => void
  readonly onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function CategoryHeader({
  category,
  isExpanded,
  isAllSelected,
  isIndeterminate,
  onToggleExpand,
  onToggleAll,
}: CategoryHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        bgcolor: 'background.default',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        transition: 'background-color 0.2s',
      }}
      onClick={onToggleExpand}
    >
      <IconButton
        size="small"
        sx={{
          transition: 'transform 0.2s',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          onToggleExpand()
        }}
      >
        {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </IconButton>
      <FormControlLabel
        control={
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={(e) => {
              e.stopPropagation()
              onToggleAll(e)
            }}
          />
        }
        label={
          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {category.name}
          </Typography>
        }
        sx={{ m: 0, flex: 1 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      />
    </Box>
  )
}

interface CategoryContentProps {
  readonly category: PermissionCategoryType
  readonly selectedPermissions: Array<string>
  readonly onPermissionToggle: (
    permissionName: string,
    checked: boolean,
  ) => void
}

export function CategoryContent({
  category,
  selectedPermissions,
  onPermissionToggle,
}: CategoryContentProps) {
  const hasDirectPermissions =
    category.permissions && category.permissions.length > 0
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0

  return (
    <>
      <Divider />
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        {/* Direct Permissions */}
        {hasDirectPermissions && (
          <Box sx={{ mb: 2 }}>
            <FormGroup>
              {category.permissions!.map((permission) => (
                <PermissionItem
                  key={permission.id}
                  permission={permission}
                  isSelected={selectedPermissions.includes(permission.name)}
                  onToggle={onPermissionToggle}
                />
              ))}
            </FormGroup>
          </Box>
        )}

        {/* Divider between direct permissions and subcategories */}
        {hasDirectPermissions && hasSubCategories && <Divider sx={{ my: 2 }} />}

        {/* Sub Categories */}
        {category.subCategories?.map((subCategory, idx) => (
          <SubCategory
            key={subCategory.id}
            subCategory={subCategory}
            selectedPermissions={selectedPermissions}
            onPermissionToggle={onPermissionToggle}
            showDivider={idx > 0}
          />
        ))}
      </Box>
    </>
  )
}

interface PermissionCategoryBoxProps {
  readonly category: PermissionCategoryType
  readonly isExpanded: boolean
  readonly selectedPermissions: Array<string>
  readonly onToggleExpand: () => void
  readonly onToggleAll: (e: React.ChangeEvent<HTMLInputElement>) => void
  readonly onPermissionToggle: (
    permissionName: string,
    checked: boolean,
  ) => void
  readonly areAllPermissionsSelected: (
    category: PermissionCategoryType,
    selected: Array<string>,
  ) => boolean
  readonly areSomePermissionsSelected: (
    category: PermissionCategoryType,
    selected: Array<string>,
  ) => boolean
}

export function PermissionCategoryBox({
  category,
  isExpanded,
  selectedPermissions,
  onToggleExpand,
  onToggleAll,
  onPermissionToggle,
  areAllPermissionsSelected,
  areSomePermissionsSelected,
}: PermissionCategoryBoxProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <CategoryHeader
        category={category}
        isExpanded={isExpanded}
        isAllSelected={areAllPermissionsSelected(category, selectedPermissions)}
        isIndeterminate={areSomePermissionsSelected(
          category,
          selectedPermissions,
        )}
        onToggleExpand={onToggleExpand}
        onToggleAll={onToggleAll}
      />

      {isExpanded && (
        <CategoryContent
          category={category}
          selectedPermissions={selectedPermissions}
          onPermissionToggle={onPermissionToggle}
        />
      )}
    </Box>
  )
}
