import React, { memo } from 'react';

const HERO_BG = '/Portfolio/heroBg.webp';

const HeroBanner = memo(() => (
  <section
    className='relative w-full overflow-hidden'
    style={{ minHeight: '380px', height: '35vw', maxHeight: '520px' }}
    aria-label='Our Success Stories hero'
  >
    <img
      src={HERO_BG}
      alt=''
      aria-hidden='true'
      className='absolute inset-0 size-full object-cover pointer-events-none'
    />
    <div className='absolute inset-0 bg-black/50' aria-hidden='true' />
    <div className='relative z-10 h-full flex items-center justify-center text-center px-4'>
      <div className='flex flex-col gap-4 max-w-3xl'>
        <h1 className='font-playfair text-white text-[30px] sm:text-[42px] lg:text-[56px] font-bold leading-tight'>
          Our Success Stories
        </h1>
        <p className='font-inter font-medium text-white text-lg leading-relaxed max-w-2xl mx-auto'>
          Explore our portfolio of high-impact real estate transformations and
          successful investments.
        </p>
      </div>
    </div>
  </section>
));

HeroBanner.displayName = 'HeroBanner';

export default HeroBanner;
