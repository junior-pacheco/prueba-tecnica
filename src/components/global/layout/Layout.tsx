import React, { CSSProperties, FC, useState } from 'react'
import { ILayout } from '../../../../data/interfaces/shared/components/layout/Layout'
import Sidebar from '@components/base/sidebar/Sidebar'
import { ISidebarOption } from '../../../../data/interfaces/shared/components/base/sidebar/Sidebar'
import { IconLicenses, IconProjects, IconSettings, IconUsers } from '../Icon/sidebar/interface/IconSidebar'
import { IIconSidebar } from '../Icon/sidebar/IconSidebar.interface'
import Navbar from '@components/base/navbar/Navbar'

const Layout: FC<ILayout> = ({ children, NavbarComponent }) => {
  const NavBarSelected = NavbarComponent ?? Navbar
  const [expanded, setExpanded] = useState<boolean>(true)

  const stylesIcon: CSSProperties = {
    display: 'flex',
    width: '40px',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const iconConfig: IIconSidebar = {
    width: '24',
    height: '24'
  }

  console.log(iconConfig)

  const staticOptions: ISidebarOption[] = [
    {
      href: '/software',
      name: 'Software',
      icon: <div style={stylesIcon}><IconProjects{...iconConfig}/></div>,
      permission: 'software:read'
    },
    {
      href: '/users',
      name: 'Users',
      icon: <div style={stylesIcon}><IconUsers {...iconConfig}/></div>,
      permission: 'user:read'
    },
    {
      href: '/licenses',
      name: 'Licenses',
      icon: <div style={stylesIcon}><IconLicenses {...iconConfig}/></div>,
      permission: 'license:read'
    },
    {
      href: '/settings',
      name: 'Settings',
      icon: <div style={stylesIcon}><IconSettings {...iconConfig}/></div>
    }
  ]

  return (
    <aside className={`grid h-screen  w-screen ${expanded ? ' grid-cols-[213px_auto] transition-all duration-500 transform  ' : 'grid-cols-[110px_auto]  transition-all duration-500 transform'}`}>
      <div className={`${expanded ? 'auto ' : 'w-[110px]'}  shadow-sm`}
      >
        <Sidebar
          options={staticOptions}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </div>
      <div className='grid grid-rows-[60px_auto] gap-[10px]'>
        <div className='h-[70px] '>
          <NavBarSelected />
        </div>
        <div className='flex h-full items-center justify-center'>
          {children}
        </div>
      </div>
    </aside>
  )
}

export default Layout
