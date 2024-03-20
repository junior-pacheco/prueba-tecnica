import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'
import { Image } from '@nextui-org/react'

import React from 'react'
import Button from '@/components/global/button/Button'

const ErrorPage = () => {
  const router = useRouter()
  const errorMessage = 'we can\'t seem to find the page you\'re looking for.'
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8">
      <Image alt='404_not_found' className='!w-[412px] !h-[284px] ' src='img/error404.png' />
      <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">Page Not Found</p>
      <p className="text-gray-500 mt-4 pb-4 border-b-2 text-center mb-4">{`Sorry, ${errorMessage}`}</p>
      <Button
        startContent={<IoIosArrowBack />}
        radius='sm'
        onClick = {() => router.back()}
        text={'Return Back'}
      />
    </div>
  )
}

export default ErrorPage
