import { useMemo, useEffect, useState } from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import Grid from '../../components/global/grid/grid';
import Table from '../../components/global/table/Table';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import NotDataComponent from '../../components/global/not-data-component/NotDataComponent';
import { IFilter } from '@interface/shared/components/table-filter/TableFilter';
import Button from '../../components/global/button/Button';

const Home = () => {
  const router = useRouter();
  const columnHelper = createColumnHelper<any>();
  const [filteredProducts, setFilteredProducts] = useState([]);


  const avaliableFilters = useMemo<Array<IFilter<any>>>(() => [
    {
      name: 'Nombre',
      column: 'title'
    },

  ], []);

  useEffect(() => {
    const fetchProducts = async () => {
     
      try {
        const response = await fetch(`https://api.mercadolibre.com/categories/${ router.query.subcategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const {children_categories} = await response.json();
        if (router.query.category) {
          setFilteredProducts(children_categories);
        } else {
          setFilteredProducts(children_categories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();
  }, [router.query]);
  
  const columns = [
    columnHelper.accessor('name', {
      header: () => <span>Nombre</span>
    }),
  ];


  const buttons: Array<any> = [
    {
      text:'Todos los productos',
      onClick: () => router.push('/products'),
      className: 'bg-[#5AC8FB] hover:bg-[#28BBFF] w-[200px]'
    }
  ]


  return (
    <Grid
      title='Categoria Producto'
      buttons={buttons}
    >
      <Table<any>
        columns={columns}
        data={filteredProducts}
        availableFilters={avaliableFilters}
        enableTablePagination
        NotDataComponent={() => <NotDataComponent message='No se encontraron datos' />}
      />
    </Grid>
  );
};

export default Home;
