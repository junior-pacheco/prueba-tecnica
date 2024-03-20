import 'react-toastify/dist/ReactToastify.css'
import React, { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Layout from '@/components/global/layout/Layout'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function App ({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => {
    return (
      <Layout>
        {page}
      </Layout>
    )
  })

  return (
    <>

              {getLayout(<Component {...pageProps} />)}
 
    </>
  )
}

export default App
