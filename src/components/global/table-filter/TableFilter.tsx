import InputLabel from '../input-label/InputLabel'
import React, { useMemo, useRef, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { ColumnFilter } from '@tanstack/react-table'
import Chip from '../chip/Chip'
import CustomSelect from '../custom-select/Select'
import { IFilter, IFilterApplied, ITableFilter } from '@interface/shared/components/table-filter/TableFilter'
import { IOption } from '@interface/global/Option'

export default function TableFilter<T> ({ columnFilters, setColumnFilters, availableFilters }: ITableFilter<T>) {
  const [filterDisabledOption, setfilterDisabledOption] = useState<string[]>([])
  const inputFilterRef = useRef<string>('')

  const filterOptions = useMemo<Array<IOption>>(
    () => {
      return availableFilters.map((filter) => {
        return {
          id: filter.column as string,
          name: filter.name
        }
      })
    }, [availableFilters]
  )

  const appliedFilters = useMemo<Array<IFilterApplied<T>>>(
    () => {
      return columnFilters.map((filter) => {
        const name = availableFilters.find(available => available.column === filter.id) as IFilter<T>
        return {
          column: filter.id,
          value: filter.value as string,
          name: name?.name ?? filter.id
        }
      })
    }, [availableFilters, columnFilters]
  )

  const applyFilter = (column: string, value:string) => {
    if (!filterDisabledOption.includes(column)) {
      setfilterDisabledOption([...filterDisabledOption, column])
    }
    if (column === '') return
    const filters = new Map<string, ColumnFilter>()
    columnFilters.forEach((filter) => {
      filters.set(filter.id, { ...filter })
    })
    filters.set(column, { id: column, value })
    setColumnFilters(Array.from(filters.values()))
  }

  const deleteFilter = (column: string) => {
    setfilterDisabledOption(filterDisabledOption.filter(item => item !== column))
    if (column === '') return
    const filters = new Map<string, ColumnFilter>()
    columnFilters.forEach((filter) => {
      filters.set(filter.id, { ...filter })
    })
    filters.delete(column)
    setColumnFilters(Array.from(filters.values()))
  }

  return (
    <div className='flex justify-end w-[100%] h-[50px] 2xl:h-[70px] gap-2'>
      <div className='flex justify-end items-center w-[30%]'>
        <InputLabel
          radius='none'
          type="text"
          name="filterInput"
          variant='faded'
          onChange={(e) => { inputFilterRef.current = e.target.value }}
          startContent={<BsSearch className='pointer-events-auto text-3xl'/>}
          classNames={{
            inputWrapper: 'bg-white h-full'
          }}

          endContent={
            <CustomSelect
              label='Filter'
              radius='none'
              size='sm'
              variant='faded'
              options={filterOptions}
              disabledOptions={filterDisabledOption}
              onChange={(e) => applyFilter(e.target.value, inputFilterRef.current)}
              classNames={{
                trigger: 'bg-white border-none '
              }}
            />
          }
        />

      </div>
      <div className='flex flex-wrap items-center w-[70%] overflow-y-auto gap-8'>
        {
          appliedFilters.map((filter) => (

            <Chip
              key={10}
              size='lg'
              variant="shadow"
              onClose={() => deleteFilter(filter.column as string)}
              classNames={{
                base: 'bg-[#091638] tracking-wide text-white h-[40px]'
              }}
            >
              <p className='font-semibold text-[18px] 2xl:text-[19px]'>{filter.name}: <span className='text-[18px] 2xl:text-[19px] italic overflow-hidden text-ellipsis whitespace-nowrap'>{filter.value}</span> </p>
            </Chip>
          ))
        }
      </div>

    </div>
  )
}
