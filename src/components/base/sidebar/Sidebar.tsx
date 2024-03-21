import { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/react';

interface Category {
  id: string;
  name: string;
  values?: Category[];
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
        console.log('data', data)
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const renderCategory = (category: Category) => {
    return (
      <AccordionItem key={category.id} title={category.name}>
        {category.values && (
          <Accordion>
            {category.values.map(value => (
              <AccordionItem key={value.id} title={value.name}></AccordionItem>
            ))}
          </Accordion>
        )}
      </AccordionItem>
    );
  };

  return (
    <Accordion>
      {categories.map(category => (
        renderCategory(category)
      ))}
    </Accordion>
  );
};

export default Sidebar;
