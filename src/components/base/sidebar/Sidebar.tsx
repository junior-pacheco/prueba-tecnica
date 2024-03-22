import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { useRouter } from 'next/router';

interface Category {
  id: string;
  name: string;
  children_categories?: Category[];
}

const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
  const router = useRouter();

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

  const handleCategoryClick = async (categoryId: string, subcategoryId?: string) => {
    if (subcategoryId) {
      await router.push(`/productsCategori?category=${categoryId}&subcategory=${subcategoryId}`); 
    } else {
      await fetchSubcategories(categoryId);
      setSelectedCategory(categoryId); 
      await router.push(`products?category=${categoryId}`);
    }
  };

  return (
    <Accordion variant="splitted" className='font-bold'>
      {categories.map(category => (
        <AccordionItem 
          key={category.id} 
          title={category.name} 
          onClick={() => handleCategoryClick(category.id)}
          className='!bg-primary text-white'
          classNames={{
            title: `${router.asPath.startsWith(`/categories/${category.id}`)
              ? 'text-white text-[20px] font-bold'
              : 'text-white text-[20px]'}`,
            content: '!font-base !text-[13px]'
          }}
        >
          {category.children_categories && (
            <ul className="text-white list-disc p-5">
              {category.children_categories.map(subcategory => (
                <li key={subcategory.id} className="mb-2 cursor-pointer" onClick={() => handleCategoryClick(category.id, subcategory.id)}>{subcategory.name}</li>
              ))}
            </ul>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Sidebar;
