import React, { FC } from 'react'
import Button from '../button/Button'
import { IButtonConfig, ITableAction } from '@interface/shared/components/table-action/TableAction'

const TableAction: FC<ITableAction> = (props) => {
  return (
    <div className='flex justify-end w-[10%] gap-[10px]'>
      {props.buttons && props.buttons.map((button: IButtonConfig, index: number) => (
        <Button
          key={index}
          isIconOnly={button.isIconOnly}
          variant='flat'
          onClick={button.onClick}
          endContent={button.endContent}
          disabled={button.disabled}
          className={`2xl:h-[40px] 2xl:w-[128px] h-[40px] w-[100px] ${props.className} ${button.className}`}
        >
          {button.icon && <span className='icon text-[40px]'>{button.icon}</span>}
          {button.text && button.text}
        </Button>
      ))}
    </div>
  )
}

export default TableAction
