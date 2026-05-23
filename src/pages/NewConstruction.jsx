import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PropertiesCTA from '../components/shared/PropertiesCTA';
import HeroSection from '../components/new-construction/HeroSection';
import ProjectsSection from '../components/new-construction/ProjectsSection';
import WhyInvestSection from '../components/new-construction/WhyInvestSection';

const NewConstruction = memo(() => {
  useSEO({
    title: 'New Construction | Skyridge Group',
    description:
      'Explore upcoming and under-construction residential projects by Skyridge Group. Find your future home today.',
    keywords: [
      'new construction',
      'residential build',
      'under construction',
      'upcoming projects',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-white'>
      <HeroSection />
      <ProjectsSection />
      <WhyInvestSection />
      <div className='py-20'>
        <PropertiesCTA />
      </div>
    </div>
  );
});

NewConstruction.displayName = 'NewConstruction';

export default NewConstruction;
