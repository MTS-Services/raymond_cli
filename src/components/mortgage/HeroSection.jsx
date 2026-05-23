import React, { memo } from 'react';
import AnimatedButton from '../shared/AnimatedButton';

const HERO_BG = '/MortgageHeroBg.webp';

const HeroSection = memo(() => (
  <section
    className='relative overflow-hidden w-full'
    style={{ height: 'clamp(480px, 55vw, 580px)' }}
  >
    <div className='absolute inset-0'>
      <img
        src={HERO_BG}
        alt='Modern building exterior'
        className='absolute inset-0 size-full object-cover'
      />
      <div className='absolute inset-0 bg-[rgba(16,24,40,0.55)]' />
    </div>

    <div className='relative z-10 h-full flex items-center py-14 sm:py-0'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 w-full'>
        <div className='max-w-3xl flex flex-col gap-4 sm:gap-5'>
          <p className='text-orange-400 text-xs font-semibold tracking-widest uppercase'>
            Mortgage Solutions
          </p>
          <h1 className='text-white font-bold text-[30px] sm:text-[42px] lg:text-[56px] leading-tight'>
            Your Dream Home Starts With the Right Loan
          </h1>
          <p className='text-white/85 font-medium italic text-lg leading-relaxed max-w-xl'>
            &ldquo;Owning a home is the keystone of wealth both financial
            affluence and emotional security.&rdquo; Suze Orman
          </p>
          <div className='pt-1'>
            <AnimatedButton
              href='#mortgage-calc'
              className='inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-medium px-6 py-3 rounded-lg transition-colors duration-150 cursor-pointer'
            >
              Calculate Now
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

export default HeroSection;
