import React, { memo } from 'react';
import { ScrollRestoration } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import HeroSection from './HeroSection';
import HighlightsSection from './HighlightsSection';
import AboutSection from './AboutSection';
import FeaturedSection from './FeaturedSection';
import SmartBuySection from './SmartBuySection';
import CTASection from './CTASection';

const HomeContent = memo(() => (
  <div className='min-h-screen bg-surface-page'>
    <ScrollRestoration />
    <Navbar />
    <main>
      {/* Keeps hero screenful intent, but allows growth when highlights wrap on smaller widths. */}
      <div className='sm:flex sm:min-h-[calc(100vh-5rem)] sm:flex-col'>
        <HeroSection />
        <HighlightsSection />
      </div>
      <AboutSection />
      <FeaturedSection />
      <SmartBuySection />
      <CTASection />
    </main>
    <Footer />
  </div>
));

HomeContent.displayName = 'HomeContent';

export default HomeContent;
