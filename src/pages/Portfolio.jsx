import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PropertiesCTA from '../components/shared/PropertiesCTA';
import HeroBanner from '../components/portfolio/HeroBanner';
import CaseStudiesSection from '../components/portfolio/CaseStudiesSection';

const Portfolio = memo(() => {
  useSEO({
    title: 'Portfolio -- Our Success Stories -- Skyridge Group',
    description:
      'Explore our portfolio of high-impact real estate transformations and successful investments. View before and after case studies from Skyridge Group.',
    keywords: [
      'portfolio',
      'case studies',
      'real estate transformations',
      'before and after',
      'skyline penthouse',
      'ocean view residence',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-primary-50'>
     <div className='py-14 lg:py-20'>
       <HeroBanner />
      <CaseStudiesSection />
     <div className='mt-14 lg:mt-20'>
       <PropertiesCTA />
     </div>
     </div>
    </div>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;
