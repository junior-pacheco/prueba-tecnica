import { UIEvent, useRef, useState, useEffect } from 'react'
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
import TablePagination from '../table-pagination'
import { ITable } from '@interface/shared/components/table/Table'

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
  const scrollableRef = useRef<any>(null)
  const rowSelectionRef = useRef<Map<string, Row<T>>>(new Map())
  const rowSelectionNotify = useRef<boolean>(false)

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
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter<T>
    },
    state: {
      columnFilters,
      rowSelection
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: props.enableRowSelection ? onRowSelectionHandler : false,
    getPaginationRowModel: enableTablePagination ? getPaginationRowModel() : undefined
  })

  const scrollHandler = (event: UIEvent<HTMLElement>) => {
    const clientCurrentScrollTop = event.currentTarget.scrollHeight - event.currentTarget.clientHeight
    if (scrollableRef.current.scrollTop === clientCurrentScrollTop) {
      if (scrollAction !== undefined) scrollAction()
    }
  }

  const [tablePaginationComponentRender, { pageIndex, pageSize }]: [JSX.Element, Record<'pageIndex' | 'pageSize', number>] = TablePagination(table)
  useEffect(() => {
    if (clearState && actionClear) {
      setRowSelection({})
      actionClear(!clearState)
    }
    table.setState((state) => ({ ...state, pagination: { ...state.pagination, pageIndex } }))
    table.setState((state) => ({ ...state, pagination: { ...state.pagination, pageSize } }))
  }, [actionClear, clearState, pageIndex, pageSize, table])

  return (
    <div className={`${enableTablePagination ? 'grid grid-rows-[50px_2fr_40px] gap-1 p-2' : 'grid grid-rows-[50px_2fr] gap-1 p-2'}`}>
      {
        !enableTableFilter &&
        <div className="flex justify-between items-center gap-[10px]">
          <TableFilter<T>
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            availableFilters={availableFilters ?? []}
          />
          {
            TableAction &&
            <TableAction />
          }
        </div>
      }
      <table className='table flex-col border-collapse rounded-[10px] mt-[10px] min-w-full'>
        <thead style={{height:'80px'}} className='table table-fixed sticky top-0 w-full rounded-[5px] bg-primary text-white'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className='bg-none' key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const { column: { columnDef }, getContext, id } = header
                const text = flexRender(columnDef.header, getContext())
                return (
                  <th
                    key={id}
                    className='outline-none h-[50px] text-center text-[18px] [&>*:first-child]:rounded-[10px_0_0_10px] [&>*:last-child]:rounded-[0_10px_0_10px] '
                    // className={props.enableRowSelection ? 'enable_checkox' : ''}
                    style={{ width: columnDef.size === 0 ? 'auto' : columnDef.size }}
                  >
                    {
                      columnDef.size && columnDef.size > 80 && !id.match(/btn_ico/)
                        ? <div className='text_column' style={{ maxWidth: columnDef.size === 0 ? 'auto' : columnDef.size }}>
                          {text}
                        </div>
                        : id.match(/btn_ico/)
                          ? text
                          : <div className='text_column' style={{ maxWidth: columnDef.size === 0 ? 'auto' : columnDef.size }}>
                            {text}
                          </div>
                    }
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className='flex flex-col gap-[10px] w-full overflow-y-auto'
          style={{
            background: '#ffffff',
            height: tableHeight || enableTablePagination ? `calc(100vh - ${tableHeight ?? '280px'})` : 'calc(100vh - 220px)'
          }}
          id="scrollable-table"
          ref={scrollableRef}
          onScroll={scrollHandler}
        >
          {
            props.data.length === 0 && NotDataComponent
              ? <tr className='flex items-center justify-center h-full hover:bg-none hover:transition-all'>
                <td>
                  <NotDataComponent />
                </td>
              </tr>
              : table.getRowModel().rows.map(row => (
                <tr className='table table-fixed w-full text-[14px] hover:bg-[#eaeaea] transition-all' key={row.id} style={{ background: (row.original as any).color }}>
                  {row.getVisibleCells().map(cell => {
                    const { column: { columnDef }, getContext, id } = cell
                    const text = flexRender(columnDef.cell, getContext())
                    return (
                      <td
                        key={id}
                        // className={props.enableRowSelection ? 'enable_checkox' : ''}
                        className='h-[30px] text-ellipsis whitespace-nowrap overflow-hidden max-w-[180px]  '
                        style={{
                          maxWidth: columnDef.maxSize === 0 ? 'auto' : columnDef.maxSize,
                          width: columnDef.size === 0 ? 'auto' : columnDef.size,
                          textAlign: 'center'
                        }}
                      >
                        {
                          columnDef.size && columnDef.size > 80 && !id.match(/btn_ico/)
                            ? <div style={{
                              maxWidth: columnDef.maxSize === 0 ? 'auto' : columnDef.maxSize,
                              width: columnDef.size === 0 ? 'auto' : columnDef.size,
                              textAlign: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {text}
                            </div>
                            : id.match(/btn_ico/)
                              ? <div className='!w-full flex items-center justify-center'>
                                {text}
                              </div>
                              : <div style={{ maxWidth: columnDef.size === 0 ? 'auto' : columnDef.size }}>
                                {text}
                              </div>
                        }
                      </td>
                    )
                  })}
                </tr>
              ))
          }
        </tbody>

        {
          enableTableFooter && <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        }
      </table>
      {
        enableTablePagination &&
        tablePaginationComponentRender
      }
    </div>
  )
}
