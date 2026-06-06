import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/terms/HeroSection';
import PolicyContentSection from '../components/terms/PolicyContentSection';

const TermsCondition = memo(() => {
  useSEO({
    title: 'Terms & Condition',
    description:
      'Review Skyridge Group terms and conditions for using this website and real estate-related services.',
    keywords: [
      'terms and condition',
      'website terms',
      'real estate terms',
      'skyridge group terms',
      'legal notice',
    ],
  });

  return (
    <div className='min-h-dvh flex flex-col bg-white'>
      <HeroSection />
      <PolicyContentSection />
    </div>
  );
});

TermsCondition.displayName = 'TermsCondition';

export default TermsCondition;
