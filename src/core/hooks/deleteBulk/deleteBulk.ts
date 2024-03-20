import { Row } from '@tanstack/react-table'
import { useCallback, useRef, useState } from 'react'

const useDeleteBulk = <T>(key: string) => {
  const [multiEdit, setMultiEdit] = useState<boolean>(false)
  const selectedRows = useRef<Array<number>>([])

  const multiSelectHandler = useCallback((selectedFlatRows: Array<Row<T>>) => {
    const state = selectedFlatRows.length > 1
    if (multiEdit !== state) setMultiEdit(state)

    selectedRows.current = selectedFlatRows.map((selectRow) => {
      return (selectRow.original as any)[`${key}`]
    })
  }, [key, multiEdit])

  const preparedIds = useCallback((): Array<number> => selectedRows.current, [])

  return {
    multiSelectHandler,
    multiEdit,
    preparedIds
  }
}

export default useDeleteBulk
