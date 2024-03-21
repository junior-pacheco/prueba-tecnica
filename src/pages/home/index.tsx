import {  useMemo,useEffect,useState } from 'react'
import Grid from '../../components/global/grid/grid';
import Table from '../../components/global/table/Table';
import { CellContext, createColumnHelper } from '@tanstack/react-table'
import NotDataComponent from '../../components/global/not-data-component/NotDataComponent';
import { IFilter } from '@interface/shared/components/table-filter/TableFilter';

const Home = () => {
  const columnHelper = createColumnHelper<any>()
  const [products, setProducts] = useState([]);

  console.log('products', products)

  const avaliableFilters = useMemo<Array<IFilter<any>>>(() => [
    {
      name: 'title',
      column: 'title'
    },
    {
      name: 'condition',
      column: 'condition'
    },
    {
      name: 'Correo electronico',
      column: 'userEmail'
    }
  ], [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.mercadolibre.com/sites/MLA/search?seller_id=179571326');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.results);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);


  const columns = [
    columnHelper.accessor('title', {
      header: () => <span>title</span>
    }),
    columnHelper.accessor('condition', {
      header: () => <span>condition</span>
    }),

  ]

  return (
<Grid
          title='data'
        >
          <Table<any>
            columns={columns}
            data={products}
            availableFilters={avaliableFilters}
            enableTablePagination
            NotDataComponent={() => <NotDataComponent message='No data found' /> }
          />
        </Grid>
  );
};

export default Home;