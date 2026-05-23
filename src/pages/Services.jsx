import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import ServicesSection from '../components/services/ServicesSection';

const Services = memo(() => {
  useSEO({
    title: 'Our Services',
    description: 'Explore our professional services',
    keywords: ['services', 'web development', 'mobile', 'design', 'consulting'],
  });

  return (
    <div className='min-h-dvh flex flex-col bg-white'>
      <ServicesSection />
    </div>
  );
});

Services.displayName = 'Services';

export default Services;
