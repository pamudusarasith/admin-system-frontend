import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory, updateCategory, type Category } from '@/api/categories'

interface CategoryDialogProps {
  open: boolean
  onClose: () => void
  category?: Category | null
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  category,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const isEditing = Boolean(category)

  useEffect(() => {
    if (open) {
      if (category) {
        setName(category.name)
        setDescription(category.description || '')
      } else {
        setName('')
        setDescription('')
      }
      setErrors({})
    }
  }, [open, category])

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
    }

    if (isEditing && category) {
      updateMutation.mutate({ id: String(category.id), data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={isLoading}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              error={Boolean(errors.description)}
              helperText={errors.description}
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CategoryDialog
