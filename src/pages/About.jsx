import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PropertiesCTA from '../components/shared/PropertiesCTA';
import HeroSection from '../components/about/HeroSection';
import WhoWeAreSection from '../components/about/WhoWeAreSection';
import MissionVisionSection from '../components/about/MissionVisionSection';
import WhyChooseUsSection from '../components/about/WhyChooseUsSection';

const About = memo(() => {
  useSEO({
    title: 'About Us',
    description:
      'Learn about Skyridge Group -- a professional real estate agency dedicated to helping you find your perfect home, commercial space, or investment property.',
    keywords: [
      'about us',
      'real estate agency',
      'our mission',
      'our vision',
      'skyridge group',
      'trusted listings',
    ],
  });

  return (
    <div className='min-h-screen bg-white py-14 lg:py-20'>
      <HeroSection />
      <WhoWeAreSection />
      <MissionVisionSection />
      <WhyChooseUsSection />
      <PropertiesCTA />
    </div>
  );
});

About.displayName = 'About';

export default About;
