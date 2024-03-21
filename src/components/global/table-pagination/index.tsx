import { ButtonGroup, Button, Pagination, Select, SelectItem } from '@nextui-org/react'
import { Row, Table } from '@tanstack/react-table'
import React, { ChangeEvent, useState } from 'react'
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

const TablePagination: (table: Table<any>) => [JSX.Element, Record<'pageIndex'|'pageSize', number>] = (table) => {
  const [pagination, setPagination] = useState<Record<'pageIndex'|'pageSize', number>>({
    pageIndex: 0,
    pageSize: 20
  })
  const [currentPageView, setCurrentPageView] = useState(pagination.pageIndex)
  const handleChangePagination = (control: 'nextPage' | 'prevPage' | 'clickSpecifyingPage' | 'ultimatePage' | 'firstPage', num?: number) => {
    switch (control) {
    case 'clickSpecifyingPage':
      if (num) {
        setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = num - 1 })
        setCurrentPageView(table.getState().pagination.pageIndex)
      }
      break
    case 'nextPage':
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = currentPageView < table.getPageCount() - 1 ? currentPageView + 1 : currentPageView })
      setCurrentPageView(table.getState().pagination.pageIndex)
      break
    case 'prevPage':
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = currentPageView > 0 ? currentPageView - 1 : currentPageView })
      setCurrentPageView(table.getState().pagination.pageIndex)
      break
    case 'ultimatePage':
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = table.getPageCount() - 1 })
      setCurrentPageView(table.getState().pagination.pageIndex)
      break
    case 'firstPage':
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = 0 })
      setCurrentPageView(table.getState().pagination.pageIndex)
      break
    }
  }
  const arrayTheActualCellsRenderInTable: string[] = []
  const renderedRows = table.getRowModel().rows
  renderedRows.forEach((row: { getVisibleCells: () => any }) => {
    const cells = row.getVisibleCells() // Obtén las celdas visibles de la fila
    cells.find((cell: { row: { id: string } }) => arrayTheActualCellsRenderInTable.push(cell.row.id))
  })

  const findElementInTableById = (id: string): Row<any> | undefined => {
    const allRows = table.getRowModel().flatRows
    return allRows.find((row: { id: string }) => row.id === id)
  }

  const goToPageContainingElementInTable = (id: string) => {
    const foundRow = findElementInTableById(id)
    if (foundRow) {
      const pageIndexTarget = Math.floor(foundRow.index / table.getState().pagination.pageSize)
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = pageIndexTarget })
      setCurrentPageView(pageIndexTarget)
    }
  }

  const handleChangeViewElementsTable = (e: ChangeEvent<HTMLSelectElement>) => {
    setPagination({ ...pagination, pageSize: table.getState().pagination.pageSize = parseInt(e.target.value) })

    if (findElementInTableById(arrayTheActualCellsRenderInTable[0])) {
      goToPageContainingElementInTable(arrayTheActualCellsRenderInTable[0])
    } else {
      handleChangePagination('firstPage')
    }
  }

  const buildComponentRender = <div className='flex flex-row justify-items-center items-center gap-2 h-max'>
    <ButtonGroup size='lg' className='[&_svg]:size-8 [&_svg]:duration-500 [&_button]:w-20 [&_button]:h-[100%] h-10'>
      <Button isIconOnly disabled={table.getState().pagination.pageIndex <= 0} onPress={() => handleChangePagination('firstPage')} className={`${table.getState().pagination.pageIndex <= 0 ? '[&_svg]:text-gray-400 bg-white' : 'bg-white'}`}><MdOutlineKeyboardDoubleArrowLeft /></Button>
      <Button isIconOnly disabled={table.getState().pagination.pageIndex <= 0} onPress={() => handleChangePagination('prevPage')} className={`${table.getState().pagination.pageIndex <= 0 ? '[&_svg]:text-gray-400 bg-white' : 'bg-white'}`}><MdOutlineKeyboardArrowLeft /></Button>
      <Button isIconOnly disabled={table.getState().pagination.pageIndex >= table.getPageCount() - 1} onPress={() => handleChangePagination('nextPage')} className={`${table.getState().pagination.pageIndex >= table.getPageCount() - 1 ? '[&_svg]:text-gray-400 bg-white' : 'bg-white'}`}><MdOutlineKeyboardArrowRight /></Button>
      <Button isIconOnly disabled={table.getState().pagination.pageIndex >= table.getPageCount() - 1} onPress={() => handleChangePagination('ultimatePage')} className={`${table.getState().pagination.pageIndex >= table.getPageCount() - 1 ? '[&_svg]:text-gray-400 bg-white' : 'bg-white'}`}><MdOutlineKeyboardDoubleArrowRight /></Button>
    </ButtonGroup>
    <Pagination
      total={table.getPageCount()}
      size='lg'
      page={currentPageView + 1}
      classNames={{ cursor: 'bg-slate-800', wrapper: 'border' }}
      onChange={(num) => handleChangePagination('clickSpecifyingPage', num)} />
    <h1 className=' text-primary font-medium text-center my-auto'>Pagina: <span className='font-bold'>{table.getState().pagination.pageIndex + 1} de {' ' + table.getPageCount()}</span></h1>
    <Select
      disallowEmptySelection
      aria-label='pagination'
      size='sm'
      className="w-48"
      selectedKeys={[table.getState().pagination.pageSize.toString()]}
      classNames={{
        trigger: 'bg-white'
      }}
      onChange={handleChangeViewElementsTable}
    >
      {[10, 20, 30, 40, 50].map(pageSize => (
        <SelectItem key={pageSize} value={pageSize} className=' text-primary'>
          {`Mostrar ${pageSize}`}
        </SelectItem>
      ))}
    </Select>
  </div>

  return (
    [buildComponentRender, table.getState().pagination]
  )
}

export default TablePagination
