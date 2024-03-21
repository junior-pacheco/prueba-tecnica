import React, { FC } from 'react'
import { Image } from '@nextui-org/react'
import { INotDataComponent } from '@interface/shared/components/not-data-component/NotDataComponent'

const NotDataComponent: FC<INotDataComponent> = ({ message, imageSrc }) => {
  return (
    <div className='2xl:h-[50vh] h-[36vh] flex flex-col items-center justify-center bg-[#F0F0F0] w-full'>
      <Image radius='none' className='2xl:h-[271px] h-[120px] w-[538px] min-[3000px]:h-[400px]' alt='Mvision_screens' src={imageSrc}/>
      <h1 className='text-[#B6BAC4] font-bold 2xl:text-[50px] text-[20px]'>{message}.</h1>
    </div>
  )
}

export default NotDataComponent
