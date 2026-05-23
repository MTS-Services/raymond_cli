import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/privacy/HeroSection';
import PolicyContentSection from '../components/privacy/PolicyContentSection';

const PrivacyPolicy = memo(() => {
  useSEO({
    title: 'Privacy Policy',
    description:
      'Read Skyridge Group privacy policy to understand how personal information is collected, used, and protected for real estate services.',
    keywords: [
      'privacy policy',
      'personal information',
      'data protection',
      'real estate privacy',
      'skyridge group privacy',
    ],
  });

  return (
    <div className='min-h-dvh flex flex-col bg-white'>
      <HeroSection />
      <PolicyContentSection />
    </div>
  );
});

PrivacyPolicy.displayName = 'PrivacyPolicy';

export default PrivacyPolicy;
