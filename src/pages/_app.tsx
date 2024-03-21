// Importar los estilos globales
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import Layout from '../components/global/layout/Layout';
import Sidebar from '../components/base/sidebar/Sidebar';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => {
    return (
      <Layout>
        {page}
      </Layout>
    );
  });

  return (
    <Layout>
      <div className='flex gap-[21px] bg-red-500'>
        <div className=' bg-yellow-500'>
          <Component {...pageProps} />
        </div>
      </div>
    </Layout>
  );
}
