import React, { FC } from 'react'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { IGrid } from '@interface/shared/components/grid/Grid.'

const Grid: FC<IGrid> = ({ children, title, text, buttons, permissions }) => {
  const router = useRouter()
  const { asPath } = router

  const pathParts = asPath.split('/').filter(Boolean)

  return (
    <main className='flex flex-col gap-[21px] h-full w-full'>
      <header className='rounded-[8px] h-[116px] min-[3000px]:h-[250px] flex flex-col'>
        <div className='flex items-center justify-between h-full'>
          <div className='w-[60%] ms-[50px] overflow-y-hidden h-full flex flex-col justify-center'>
            <div className=' flex items-center h-[54px]'>
              <Breadcrumbs size='lg' isDisabled className='font-medium' color='secondary' separator="/">
                {pathParts.map((part, index) => (
                  <BreadcrumbItem key={index} href={`/${pathParts.slice(0, index + 1).join('/')}`}>
                    {part}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            </div>
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
