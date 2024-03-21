import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const HomePage: NextPage = () => {
  const [load, setLoad] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!load) {
      setLoad(true)
      router.push('/home')
    }
  }, [load, router])

  return <></>
}

export default HomePage
