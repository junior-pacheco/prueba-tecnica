import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { classNames } from '../../../data/interface/shared/components/custom-select/CustomSelect';

interface Category {
  id: string;
  name: string;
  values?: any;
  children_categories?: Category[];
}

const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.mercadolibre.com/sites/MLA/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`https://api.mercadolibre.com/categories/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const data = await response.json();
      setCategories(prevCategories => {
        return prevCategories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              children_categories: data.children_categories
            };
          }
          return category;
        });
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  return (
    <Accordion variant="splitted" className='text-primary font-bold'>
      {categories.map(category => (
        <AccordionItem className='bg-secondary' key={category.id} title={category.name} onClick={() => category.children_categories || fetchSubcategories(category.id)}>
          {category.children_categories && (
            <ul className="text-primary list-disc p-5">
              {category.children_categories.map(subcategory => (
                <li key={subcategory.id} className="mb-2">{subcategory.name}</li>
              ))}
            </ul>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Sidebar;
