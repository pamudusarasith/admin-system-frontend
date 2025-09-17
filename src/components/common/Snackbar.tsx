import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Alert, Snackbar } from '@mui/material'
import type { AlertColor } from '@mui/material'

type SnackbarOptions = {
  message: string
  severity?: AlertColor
  autoHideDuration?: number
}

type SnackbarContextValue = {
  showSnackbar: (options: SnackbarOptions | string) => void
  hideSnackbar: () => void
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined,
)

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext)
  if (!ctx)
    throw new Error(
      'useSnackbar must be used within a SnackbarProvider. Wrap your component tree with <SnackbarProvider>.',
    )
  return ctx
}

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Required<SnackbarOptions>>({
    message: '',
    severity: 'info',
    autoHideDuration: 5000,
  })

  const showSnackbar = useCallback((opts: SnackbarOptions | string) => {
    const next =
      typeof opts === 'string'
        ? { message: opts, severity: 'info' as const, autoHideDuration: 5000 }
        : { severity: 'info' as const, autoHideDuration: 5000, ...opts }
    setOptions(next)
    setOpen(true)
  }, [])

  const hideSnackbar = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ showSnackbar, hideSnackbar }),
    [showSnackbar, hideSnackbar],
  )

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options.autoHideDuration}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return
          setOpen(false)
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={options.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {options.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
