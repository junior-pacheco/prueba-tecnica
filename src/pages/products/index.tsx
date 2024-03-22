import { useMemo, useEffect, useState } from 'react';
import Grid from '../../components/global/grid/grid';
import Table from '../../components/global/table/Table';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import NotDataComponent from '../../components/global/not-data-component/NotDataComponent';
import { IFilter } from '@interface/shared/components/table-filter/TableFilter';
import Button from '../../components/global/button/Button';
import { useRouter } from 'next/router'; 

interface Category {
  id: string;
  name: string;
  children_categories?: Category[];
}

const Home = () => {
  const columnHelper = createColumnHelper<any>();
  const [products, setProducts] = useState([]);
  const router = useRouter(); 

  const avaliableFilters = useMemo<Array<IFilter<any>>>(() => [
    {
      name: 'Nombre',
      column: 'title'
    },
    {
      name: 'Condicion',
      column: 'condition'
    },
    {
      name: 'Precio',
      column: 'price'
    }
  ], []);


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
      header: () => <span>Nombre</span>
    }),
    columnHelper.accessor('condition', {
      header: () => <span>Condicion</span>
    }),
    columnHelper.accessor('price', {
      header: () => <span>Precio</span>
    }),
    columnHelper.display({
      id: 'btn_ico_shcedules',
      header: () => <span>permalink</span>,
      cell: ({ row: { original: { permalink } } }: CellContext<any, unknown>) => {
        return (
          <div className='flex justify-center gap-5 w-full'>
            <Button
              isIconOnly
              variant='flat'
              onClick={() => window.open(permalink, '_blank')} 
              className='rounded w-[25px] h-[25px] text-primary text-2xl bg-background shadow-[0_2px_3px_0_rgba(0,0,0,0.5)]'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 17H7q-2.075 0-3.537-1.463T2 12q0-2.075 1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12q0 2.075-1.463 3.538T17 17z"/></svg>
            </Button>
          </div>
        );
      }
    }),
  ];



  return (
    <Grid
      title='Productos'
    
    >
      <Table<any>
        columns={columns}
        data={products}
        availableFilters={avaliableFilters}
        enableTablePagination
        NotDataComponent={() => <NotDataComponent message='No data found' />}
      />
    </Grid>
  );
};

export default Home;