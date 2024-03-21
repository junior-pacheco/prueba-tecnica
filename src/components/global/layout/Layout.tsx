import React from 'react'
import { ILayout } from '@interface/shared/components/layout/Layout'
import Sidebar from '../../base/sidebar/Sidebar'

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className='flex gap-[21px] p-[25px] h-screen'>
      <div className='flex-none 2xl:w-[200px] w-[150px] min-[3000px]:w-[250px] overflow-y-auto'>
        <Sidebar/>
      </div>
      <div className='flex-1 '>
        {children}
      </div>
    </div>
  )
}

export default Layout
