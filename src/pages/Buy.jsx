import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import ListingsSection from '../components/buy/ListingsSection';

const Buy = memo(() => {
  useSEO({
    title: 'Buy Properties',
    description:
      'Browse verified properties for sale -- filter by location, price range, and property type to find your perfect home.',
    keywords: [
      'buy property',
      'properties for sale',
      'real estate listings',
      'homes for sale',
      'buy house',
    ],
  });

  return (
    <div className='min-h-screen bg-white pt-10 pb-14 lg:pt-12 lg:pb-20'>
      <ListingsSection />
    </div>
  );
});

Buy.displayName = 'Buy';

export default Buy;
