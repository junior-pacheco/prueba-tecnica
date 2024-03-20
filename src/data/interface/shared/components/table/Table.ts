import { IFilter } from '../table-filter/TableFilter'
import { TableOptions } from '@tanstack/react-table'

export interface ITable<T> extends Omit<TableOptions<T>, 'getCoreRowModel'> {
  NotDataComponent?: () => JSX.Element;
  enableTableFooter?: boolean;
  tableHeight?: number | string;
  enableTableFilter?: boolean;
  availableFilters?: Array<IFilter<T>>;
  onRowSelection?: (rows: Array<T>) => void
  enableTablePagination?: boolean;
  TableAction?: () => JSX.Element
  scrollAction?: () => void;
  clearState?: boolean;
  actionClear?: (confirmation: boolean) => void;
}
