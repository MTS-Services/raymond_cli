import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PropertiesCTA from '../components/shared/PropertiesCTA';
import RenovationServiceHero from '../components/renovation/RenovationServiceHero';
import RenovationServiceList from '../components/renovation/RenovationServiceList';
import BeforeAfterSection from '../components/renovation/BeforeAfterSection';
import RenovationServiceProcess from '../components/renovation/RenovationServiceProcess';
import RenovationServiceQuote from '../components/renovation/RenovationServiceQuote';

const RenovationService = memo(() => {
  useSEO({
    title: 'Renovation Services | Skyridge Group',
    description:
      'Transform your space with expert renovation services. Kitchen remodels, bathroom upgrades, full home makeovers, and office renovations by Skyridge Group.',
    keywords: [
      'renovation',
      'kitchen renovation',
      'bathroom remodeling',
      'home makeover',
      'office renovation',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-white'>
      <RenovationServiceHero />
      <RenovationServiceList />
      <BeforeAfterSection />
      <RenovationServiceProcess />
      <RenovationServiceQuote />
      <div className='py-14 lg:py-20'>
        <PropertiesCTA />
      </div>
    </div>
  );
});

RenovationService.displayName = 'RenovationService';

export default RenovationService;
