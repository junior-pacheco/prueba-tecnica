import React, { useRef, useState, useEffect, useCallback, ChangeEvent } from 'react'
import {
  ColumnFiltersState,
  FilterMeta,
  Row,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  rankItem
} from '@tanstack/match-sorter-utils'
import TableFilter from '../table-filter/TableFilter'
// import TablePagination from '../table-pagination/TablePagination'
import { Pagination, Select, SelectItem } from '@nextui-org/react'


import { useVirtual } from '@tanstack/react-virtual'
import { ITable } from '@/data/interface/shared/components/table/Table'
import useTableColumnResize from '@/core/hooks/table-rezise/TableColumResize'

function fuzzyFilter<T> (row: Row<T>, columnId: string, value: any, addMeta: (meta: FilterMeta) => void): boolean {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank
  })
  return itemRank.passed
}

export default function Table<T> ({ enableTableFooter, tableHeight, enableTableFilter, availableFilters, TableAction, enableTablePagination, onRowSelection, scrollAction, NotDataComponent, clearState, actionClear, ...props }: ITable<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const scrollableRef = useRef<HTMLTableSectionElement>(null)
  const rowSelectionRef = useRef<Map<string, Row<T>>>(new Map())
  const rowSelectionNotify = useRef<boolean>(false)
  const [pagination, setPagination] = useState<Record<'pageIndex'|'pageSize', number>>({
    pageIndex: 0,
    pageSize: 10
  })
  const [currentPage, setCurrentPage] = useState(1)

  const columnWidth = useTableColumnResize(props.columns.length, !!props.enableRowSelection)
  const onRowSelectionHandler = (row: Row<T>) :boolean => {
    if (rowSelectionRef.current.get(row.id)) {
      if (!row.getIsSelected()) {
        rowSelectionNotify.current = true
        rowSelectionRef.current.delete(row.id)
      }
    } else if (row.getIsSelected()) {
      rowSelectionNotify.current = true
      rowSelectionRef.current.set(row.id, row)
    }

    if (rowSelectionNotify.current) {
      rowSelectionNotify.current = false
      if (onRowSelection) {
        const selected = table.getSelectedRowModel().flatRows.map(e => e.original)
        onRowSelection(selected)
      }
    }
    return true
  }

  const table = useReactTable({
    ...props,
    columns: props.columns.map((column) => {
      return {
        ...column,
        size: column.id === 'rowSelection' ? 30 : columnWidth
      }
    }),
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      filterFn: 'includesString'
    },
    state: {
      columnFilters,
      rowSelection,
      pagination
    },
    columnResizeMode: 'onChange',
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: props.enableRowSelection ? onRowSelectionHandler : false,
    getPaginationRowModel: enableTablePagination ? getPaginationRowModel() : undefined
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtual({
    parentRef: scrollableRef,
    size: rows.length,
    overscan: 10
  })

  const { virtualItems: virtualRows, totalSize } = rowVirtualizer
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  const scrollHandler = useCallback((event?: HTMLTableSectionElement | null) => {
    if (!event) return
    const { scrollHeight, scrollTop, clientHeight } = event

    const clientCurrentScrollTop = scrollHeight - clientHeight - scrollTop
    if (clientCurrentScrollTop < 5 && scrollAction) {
      scrollAction()
    }
  }, [scrollAction]
  )
  const arrayTheActualCellsRenderInTable: Array<string> = []
  const renderRows = table.getRowModel().rows
  renderRows.forEach((row) => {
    const cells = row.getVisibleCells()
    cells.forEach((cell) => arrayTheActualCellsRenderInTable.push(cell.row.id))
  })

  const findRowForId = (id: string) => {
    const allRows = table.getRowModel().flatRows
    return allRows.find((row) => row.id === id)
  }

  const goToPageContainingElement = (id:string) => {
    const findRow = findRowForId(arrayTheActualCellsRenderInTable[0])
    if (findRow) {
      const indexCurrentPage = Math.floor(findRow?.index / table.getState().pagination.pageSize)
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = indexCurrentPage })
      setCurrentPage(indexCurrentPage + 1)
    }
  }
  const handleChangePagination = (num: number) => {
    setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = num - 1 })
    setCurrentPage(num)
  }

  const handleSelectViewElements = (e:ChangeEvent<HTMLSelectElement>) => {
    setPagination({ ...pagination, pageSize: table.getState().pagination.pageSize = parseInt(e.target.value) })
    if (findRowForId(arrayTheActualCellsRenderInTable[0])) {
      goToPageContainingElement(arrayTheActualCellsRenderInTable[0])
    } else {
      setPagination({ ...pagination, pageIndex: table.getState().pagination.pageIndex = 0 })
      setCurrentPage(table.getState().pagination.pageIndex + 1)
    }
  }

  useEffect(() => {
    if (clearState && actionClear) {
      setRowSelection({})
      actionClear(!clearState)
      scrollHandler(scrollableRef.current)
    }
  }, [actionClear, clearState, scrollHandler])

  const customStyles = {
    root: {
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    } as React.CSSProperties,
    containerTable: {
      flex: 1
      // backgroundColor: '#fff'
    } as React.CSSProperties
  }

  return (
    <div
      id='table'
      className={`max-h-[90vh] 2xl:max-h-[80vh] gap-5`}
      style={customStyles.root}
    >
      {!enableTableFilter && (
        <div className="container_header_action w-[100%] h-[40px] 2xl:h-[69px] min-[3000px]:h-[80px] flex">
          <TableFilter<T>
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            availableFilters={availableFilters ?? []}
          />
          {TableAction && <TableAction />}
        </div>
      )}
      <div className='w-[80vw] h-[90vh] 2xl:w-[84vw] overflow-y-auto' style={customStyles.containerTable}>
        <table className="table flex-col rounded-[10px]">
          <thead className="sticky z-20 shadow-xl top-0 w-full">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`ps-5 h-[40px] 2xl:h-[73px] relative text-[15px]  2xl:text-[24px] bg-primary text-background ${
                      (header.column.id === 'state' || header.column.id === 'options')
                        ? 'text-center'
                        : ''
                    }`}
                    style={{
                      width: header.getSize(),
                      maxWidth: header.getSize()
                    }}
                  >
                    <div
                      className={`flex items-center bg-primary overflow-hidden text-ellipsis whitespace-nowrap${
                        (header.column.id === 'state' || header.column.id === 'options')
                          ? 'flex justify-center text-center '
                          : ''
                      }`}
                    >
                      <span className="flex-shrink-0">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-[2px] bg-primary cursor-col-resize select-none touch-none transition-opacity ${
                          header.column.getIsResizing()
                            ? 'bg-primary'
                            : 'border-r-2 border-primary hover:border-primary'
                        }`}

                      />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody
            id="scrollable-table"
            ref={scrollableRef}
            onScroll={(e) => scrollHandler(e.target as HTMLTableSectionElement)}
          >
            {paddingTop > 0 && (
              <tr>
                <td colSpan={props.columns.length} style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {props.data.length === 0 && NotDataComponent
              ? (
                <tr className='tr_not_data'>
                  <td className='h-full w-full' colSpan={props.columns.length}>
                    <NotDataComponent />
                  </td>
                </tr>
              )
              : (
                rowVirtualizer.virtualItems.map((virtualRow, index) => {
                  const row = rows[virtualRow.index] as Row<T>
                  const colors = ['bg-[#F0F0F0]', 'bg-white']
                  const rowColor = colors[index % colors.length]

                  return (
                    <tr
                      key={row.id}
                      className={`gap-2 ${rowColor}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="ps-4 h-[30px] 2xl:h-[73px] text-[15px] text-primary  2xl:text-[20px] "
                          style={{
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                            textAlign: cell.id.match(/rowSelection/g) ? 'center' : 'left'
                          }}
                        >
                          <div className="whitespace-nowrap p-1  overflow-hidden  overflow-ellipsis">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            {paddingBottom > 0 && (
              <tr>
                <td colSpan={props.columns.length} style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>

          {enableTablePagination && props.data.length > 0 && (
            <tfoot>
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id} className="p-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      {enableTablePagination &&
      <div className="flex justify-end w-[100%] h-[30px] 2xl:h-[40px]  items-center">
        <div className='flex gap-4  bg-white items-center'>
          <Pagination
            isCompact
            showShadow
            disableCursorAnimation
            showControls
            aria-label='pagination'
            total={table.getPageCount()}
            page={currentPage}
            classNames={{ cursor: 'bg-primary', wrapper: 'border' }}
            onChange={handleChangePagination}
          />
          <h1 className=' text-black text-[20px]  2xl:text-[20px]'>Page: {table.getState().pagination.pageIndex + 1} out of{' '} {table.getPageCount()}</h1>
          <Select
            disallowEmptySelection
            size='sm'
            className="w-48"
            selectedKeys={[pagination.pageSize.toString()]}
            classNames={{
              trigger: 'bg-white'
            }}
            onChange={handleSelectViewElements}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <SelectItem key={pageSize} value={pageSize} className=' text-black'>
                {`Show ${pageSize}`}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      }
    </div>
  )
}
