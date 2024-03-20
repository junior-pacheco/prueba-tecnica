import React, { FC, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '@context/auth/AuthContext'
import Restricted from '@components/global/restricted/Restricted'
import { INavbar, INavbarItem, INavbarOption } from '../../../../data/interfaces/shared/components/base/navbar/Navbar'

const CreateItem: FC<INavbarItem> = (props) => {
  const [hover, setHover] = useState<boolean>(false)
  const active: boolean = Boolean(props.option?.href === props.router.asPath)

  return (
    <>
      <li
        onPointerOver={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        className={`flex justify-center items-center w-[136px] h-full 
        ${active ? 'text-[#1D85FF]' : ''} 
        ${active ? 'bg-[#ededed]' : ''} 
        border-b-[2px] border-solid border-[#1D85FF'] ${hover ? 'cursor-pointer' : ''} ${hover ? 'transition-[0.2s]' : ''}`}
        onClick={() => { props.option.href ? props.router.push(props.option.href) : props.option.back ? props.router.back() : props.router.reload() }}
      >
        <div className='flex justify-center items-center'>
          <h4>{props.option?.name}</h4>
        </div>
      </li>
    </>
  )
}
const Navbar: FC<INavbar> = (props) => {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const options: INavbarOption[] = props.options ?? []
  const { user: { permissions } } = useContext(AuthContext)
  const [avatarBackground, setAvatarBackground] = useState<string>('')

  const generateAvatarBackground = (): string => {
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let color = '#'
    array.forEach((element, index) => {
      if (index > 5) {
        return
      }
      const randomElement: string | number = array[Math.floor(Math.random() * array.length)]
      color = color.concat('' + randomElement)
    })
    return color
  }
  useEffect(() => {
    document.title = `Gelice ${router.asPath.replaceAll('/', '/ ')}`
    const color = generateAvatarBackground()
    setAvatarBackground(color)
  }, [router.asPath, router.route])

  return (
    <div className='flex justify-between items-center w-full h-full py-4'>
      <div className='h-[70px]'>
        <ul className='flex items-center h-full'>
          {
            options.map((option, key) => (
              <Restricted key={key} permissions={permissions} required={option.permission ?? ''}>
                <CreateItem key={key} router={router} option={option} />
              </Restricted>
            ))
          }
        </ul>
      </div>
      <div className='flex items-center mr-[48px] gap-5' >
        <div className='text-[#7d888f] text-end'>
          <p className='text-[#051d50] font-[../../../assets/fonts/Urbanist-bold]'>{user.data.userFullName ?? 'User'}</p>
          <p>{user.data.roles ?? 'Role'}</p>
        </div>
        {user && avatarBackground &&
          <div
            className='rounded-[15%] h-[40px] w-[40px] flex border border-solid border-black'
            style={{ backgroundColor: avatarBackground }}>
            <p className='text-center font-bold'>
              {user.data.userFullName.split(' ')[0].substring(0, 1)}
              {user.data.roles ? `${user.data.roles.substring(0, 1)}` : ''}
            </p>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar
