import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import AnimatedButton from '../shared/AnimatedButton';

const HERO_BG = '/BuildAndRenovate/heroBg.webp';

const RenovationHeroSection = memo(() => (
  <section
    className='relative w-full overflow-hidden'
    aria-label='Build and Renovate hero'
    style={{ height: 'clamp(480px, 55vw, 560px)' }}
  >
    <img
      src={HERO_BG}
      alt=''
      aria-hidden='true'
      className='absolute inset-0 size-full object-cover pointer-events-none'
    />
    <div
      className='absolute inset-0 pointer-events-none'
      aria-hidden='true'
      style={{
        background:
          'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%)',
      }}
    />
    <div className='relative z-10 h-full flex items-center py-14 sm:py-0'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 w-full'>
        <div className='flex flex-col gap-4 sm:gap-6 max-w-2xl'>
          <p className='text-orange-vivid font-semibold text-xs tracking-[1.2px] uppercase leading-none'>
            Custom Build
          </p>
          <h1 className='font-playfair font-bold text-white text-[30px] sm:text-[42px] lg:text-[56px] leading-tight'>
            Homes built around your life, not the other way around.
          </h1>
          <p className='text-white/90 font-medium text-lg leading-relaxed max-w-xl'>
            From the first sketch to the final handover architectural planning,
            custom builds, and turnkey delivery for clients who expect more.
          </p>
          <div className='flex flex-wrap items-center gap-3 sm:gap-4 mt-1 sm:mt-2'>
            <AnimatedButton
              href='#quote'
              className='inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-orange-300'
            >
              Request a Quote
            </AnimatedButton>
            <AnimatedButton
              href='#process'
              className='inline-flex items-center gap-2 text-white font-medium text-sm sm:text-base px-2 py-3 sm:py-3.5 hover:text-orange-300 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-white'
            >
              View Our Process
              <ChevronRight size={18} aria-hidden='true' />
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  </section>
));

RenovationHeroSection.displayName = 'RenovationHeroSection';

export default RenovationHeroSection;
