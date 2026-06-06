import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/home/HeroSection';
import HighlightsSection from '../components/home/HighlightsSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedSection from '../components/home/FeaturedSection';
import SmartBuySection from '../components/home/SmartBuySection';
import CTASection from '../components/home/CTASection';

const Home = memo(() => {
  useSEO({
    title: '',
    description:
      'Discover premium residential and commercial properties. Buy, sell, or rent with Skyridge Group -- your trusted real estate partner.',
    keywords: [
      'real estate',
      'properties',
      'buy home',
      'sell property',
      'rent apartment',
      'skyridge group',
    ],
  });

  return (
    <div className='min-h-screen bg-surface-page'>
      <div className='pt-20'>
        <div className='flex min-h-[calc(100vh-5rem)] flex-col'>
          <HeroSection />
          <HighlightsSection />
        </div>
        <AboutSection />
        <FeaturedSection />
        <SmartBuySection />
        <CTASection />
      </div>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
