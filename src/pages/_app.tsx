import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/global/layout/Layout';

interface LayoutComponent {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = (Component as LayoutComponent).getLayout ?? ((page) => {
    return (
      <Layout>
        {page}
      </Layout>
    );
  });

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
