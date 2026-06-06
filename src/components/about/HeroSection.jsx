import React, { memo } from 'react';
import { ROUTES } from '../../config';
import AnimatedButton from '../shared/AnimatedButton';

const HERO_BG = '/AboutUs/aboutHero.webp';

const HeroSection = memo(() => (
  <section
    className='relative w-full overflow-hidden'
    style={{ minHeight: '380px', height: '35vw', maxHeight: '520px' }}
    aria-label='About Us hero'
  >
    <img
      src={HERO_BG}
      alt=''
      aria-hidden='true'
      className='absolute inset-0 w-full h-full object-cover pointer-events-none'
    />
    <div
      className='absolute inset-0 bg-black/40 pointer-events-none'
      aria-hidden='true'
    />

    <div className='relative z-10 h-full flex items-center'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 w-full py-10'>
        <div className='flex flex-col gap-6 max-w-3xl'>
          <div className='flex flex-col gap-4 text-white'>
            <h1 className='font-playfair text-[30px] sm:text-[42px] lg:text-[56px] font-bold leading-tight'>
              Find Your Dream Property with Confidence
            </h1>
            <p className='text-lg font-medium max-w-xl leading-relaxed'>
              We help you buy, sell, and rent properties with trust,
              transparency, and ease. Your dream home is just a click away.
            </p>
          </div>
          <AnimatedButton
            to={ROUTES.BUY}
            className='self-start bg-orange-500 text-white text-base font-medium px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-150'
          >
            Browse Properties
          </AnimatedButton>
        </div>
      </div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

export default HeroSection;
