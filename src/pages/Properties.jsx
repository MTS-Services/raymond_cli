import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import ListingsSection from '../components/properties/ListingsSection';

const Properties = memo(() => {
  useSEO({
    title: 'Properties',
    description:
      'Explore properties that match your lifestyle. Filter by location, price range, and property type to find your perfect home.',
    keywords: [
      'properties listing',
      'buy home',
      'property filter',
      'real estate search',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-white'>
      <div className='py-20'>
        <ListingsSection />
      </div>
    </div>
  );
});

Properties.displayName = 'Properties';

export default Properties;
