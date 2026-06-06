import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroBanner from '../components/wholesale/HeroBanner';
import ListingsSection from '../components/wholesale/ListingsSection';
import PropertiesCTA from '../components/shared/PropertiesCTA';

const Wholesale = memo(() => {
  useSEO({
    title: 'Wholesale Properties -- Off-Market Deep Discounts',
    description:
      'Access exclusive off-market investment properties before they hit the retail market. High equity, high ROI wholesale deals.',
    keywords: [
      'wholesale properties',
      'off-market deals',
      'investment properties',
      'deep discounts',
      'real estate investment',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-white py-14 lg:py-20'>
 
        <HeroBanner />
        <ListingsSection />
        <PropertiesCTA />
      
    </div>
  );
});

Wholesale.displayName = 'Wholesale';

export default Wholesale;
