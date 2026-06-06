import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PropertiesCTA from '../components/shared/PropertiesCTA';
import RenovationHeroSection from '../components/renovation/RenovationHeroSection';
import RenovationServicesSection from '../components/renovation/RenovationServicesSection';
import RenovationProcessSection from '../components/renovation/RenovationProcessSection';
import RenovationGallerySection from '../components/renovation/RenovationGallerySection';
import RenovationQuoteSection from '../components/renovation/RenovationQuoteSection';

const Renovation = memo(() => {
  useSEO({
    title: "Renovation Properties -- 80's Era Homes | Skyridge Group",
    description:
      "Discover beautifully renovated homes from the 80's era. Browse fully renovated properties, partial renovations, or original gems waiting for your personal touch.",
    keywords: [
      'renovation properties',
      "80's homes",
      'fully renovated',
      'partial renovation',
      'fixer upper',
      'real estate',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-[#FBFDFF] py-14 lg:py-20'>
    
        <RenovationHeroSection />
        <RenovationServicesSection />
        <RenovationProcessSection />
        <RenovationGallerySection />
        <RenovationQuoteSection />
        <div className='mt-14 lg:mt-20'>
          <PropertiesCTA />
        </div>
    </div>
  );
});

Renovation.displayName = 'Renovation';

export default Renovation;
