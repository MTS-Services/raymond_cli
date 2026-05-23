import React, { memo } from 'react';

const HeroSection = memo(() => (
  <section
    className='bg-blue-900 py-14 sm:py-16 lg:py-20'
    aria-labelledby='privacy-policy-title'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='max-w-3xl space-y-4'>
        <p className='text-orange-500 text-sm sm:text-base font-semibold tracking-wide mt-5 uppercase'>
          Legal
        </p>
        <h1
          id='privacy-policy-title'
          className='font-playfair text-white text-[30px] sm:text-[42px] lg:text-[56px] font-bold leading-tight'
        >
          Privacy Policy
        </h1>
        <p className='text-gray-200 text-lg leading-relaxed'>
          Skyridge Group is committed to protecting your personal information and
          being transparent about how we collect, use, and share data when you
          use our services.
        </p>
        <p className='text-gray-300 text-sm'>
          Last updated: May 23, 2026
        </p>
      </div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

export default HeroSection;
