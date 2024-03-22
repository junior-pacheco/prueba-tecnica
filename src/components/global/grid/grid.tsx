import React, { FC } from 'react'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { IGrid } from '@interface/shared/components/grid/Grid.'
import Button from '../button/Button'

const Grid: FC<IGrid> = ({ children, title, text, buttons, permissions }) => {
  const router = useRouter()
  const { asPath } = router

  const pathParts = asPath.split('/').filter(Boolean)

  return (
    <main className='flex flex-col gap-[21px] h-full w-full'>
      <header className='rounded-[8px] h-[100px] flex flex-col'>
        {buttons?.map(button => (
                <Button
                  isIconOnly
                  variant='light'
                  className='!rounded-full w-[50px] h-[50px] text-primary text-2xl bg-background shadow-[0_2px_3px_0_rgba(0,0,0,0.3)]'
                  key={12}
                  {...button}
                >
                  {button.icon}
                </Button>
            ))}
        <div className='flex items-center justify-between h-full'>

          <div className='w-[60%] ms-[50px] overflow-y-hidden h-full flex flex-col justify-center'>
            <div >
              <h3 className='text-primary font-Montserrat-Bold text-[22px] 2xl:text-[40px] min-[3000px]:text-[50px]'>
                {title}
              </h3>
              <p className='text-[#4b4b4b] text-sm'>
                {text}
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className='flex flex-col items-center p-1  rounded-[8px] h-[100%] overflow-x-auto'>
        {children}
      </div>
    </main>
  )
}

export default Grid
