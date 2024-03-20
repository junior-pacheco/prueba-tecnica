import { useState, useCallback } from 'react'

interface Dialog {
  open: boolean;
  title: string;
  content: string;
  showSecondaryButton: boolean;
  primaryOnClick: () => void
}

const useDialog = () => {
  const [dialog, setDialog] = useState<Dialog>({
    open: false,
    title: '',
    content: '',
    showSecondaryButton: false,
    primaryOnClick: () => console.log('close')
  })

  const openDialog = useCallback((newTitle: string, newContent: string, newSecondaryButton: boolean, primaryOnClick: () => void) => {
    setDialog({
      open: true,
      title: newTitle,
      content: newContent,
      showSecondaryButton: newSecondaryButton,
      primaryOnClick
    })
  }, [])

  const closeDialog = useCallback(() => {
    setDialog({
      ...dialog,
      open: false
    })
  }, [dialog])

  return { dialog, openDialog, closeDialog }
}

export default useDialog
