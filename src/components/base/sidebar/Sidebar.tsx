import React, { FC, useContext, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Restricted from '@components/global/restricted/Restricted'
import Dialog from '@components/global/dialog/Dialog'
import useDialog from '../../../../core/hooks/dialog/dialogHook'
import { IconLogo, IconLogout, IconNavbarClose } from '@components/global/Icon/sidebar/interface/IconSidebar'
import { FaAlignRight } from 'react-icons/fa'
import { AuthContext } from '@context/auth/AuthContext'
import { ISidebarOption, ISidebar } from '../../../../data/interfaces/shared/components/base/sidebar/Sidebar'

const SidebarOption: FC<ISidebarOption> = (props) => {
  const [hover, setHover] = useState<boolean>(false)
  const router = useRouter()
  const isActive: boolean = Boolean(router.asPath.startsWith(props.href))

  return (
    <div
      onPointerOver={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={`flex justify-between items-center w-full  h-[40px] cursor-pointer ${props.icon ? 'gap-[20px]' : ''}`}
    >
      <Link
        className={`flex justify-between items-center w-full h-full text-center ${isActive || hover ? 'text-[#1D85FF]' : 'text-[#949090]'}`}
        href={props.href}
      >
        <div className='flex   !h-full items-center gap-[10px] w-[70%]'>
          <span className='flex justify-center items-center'>{props.icon}</span>
          {
            props.closeNavbar && <span className='flex justify-center h-full font-semibold items-center w-[40px] text-[14px] leading-[16.8px]  text-[#051d50]'>{props.name}</span>
          }
        </div>
        {/* <div className={isActive || hover ? styles.active : ''}/> */}
        <div className={`${isActive || hover ? 'w-[6px] h-[40px] bg-gradient-to-tr from-blue-500 via-blue-600 to-blue-700 rounded-[50px]' : ''}`}/>
      </Link>
    </div>
  )
}

const Sidebar: FC<ISidebar> = (props) => {
  const { openDialog, dialog, closeDialog } = useDialog()
  const { logout } = useContext(AuthContext)
  const options = useMemo<ISidebarOption[]>(() => props.options, [props.options])
  const { user: { permissions } } = useContext(AuthContext)

  return (
    <div className={`h-full bg-white flex flex-col justify-between shadow-md`}>
      <div className={` flex items-center  justify-center  h-[70px] `} >
        <div className={`flex items-center justify-between    ${props.expanded ? 'w-[80%]' : 'w-[70%]'}`}>
          <Link href={'/'}>
            { props.expanded ? <IconLogo /> : <IconNavbarClose /> }
          </Link>
          <FaAlignRight onClick={() => props.setExpanded(!props.expanded)} size={24} className='text-[#1D85FF] cursor-pointer'/>
        </div>
      </div>
      <div className='flex flex-col  items-center gap-[10px] p-[20px]'>
        {options.map((option, i) => (
          <Restricted key={i} permissions={permissions} required={option.permission ?? ''}>
            <SidebarOption
              key={i}
              name={option.name}
              href={option.href}
              icon={option.icon}
              closeNavbar={props.expanded}
            />
          </Restricted>
        ))}
      </div>

      {/* <div className='flex justify-center bg-red-500 items-center gap-[10px] w-full h-[12%]'> */}
      <div className=' flex justify-between items-center w-full  h-[12%]'>
        <div className={`flex items-center  p-[20px] `}>

          <button onClick={() => openDialog(
            'Logout',
            'Are you sure you want to Logout?',
            true,
            () => logout()
          )} className=' flex justify-between items-center w-full h-full text-center cursor-pointer border-none  hover:opacity-50 '>
            <span className='flex justify-center items-center w-[40px]'><IconLogout width='19px' height='19px'/></span>
            {
              props.expanded && <span className='font-semibold text-[14px] leading-[16.8px] text font-[../../fonts/Ubarnist-Regular] text-[#08369A] '>Logout</span>
            }
          </button>
        </div>
        <Dialog
          {...dialog}
          secondaryOnClick={closeDialog}
        />
      </div>
    </div>
  )
}

export default Sidebar
