import React, { memo } from 'react';

const HeroSection = memo(() => (
  <section
    className='bg-blue-900 py-16 lg:py-24'
    aria-labelledby='contact-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='flex flex-col gap-3 max-w-xl'>
        <span className='text-orange-500 font-semibold text-sm uppercase tracking-wider'>
          Get In Touch
        </span>
        <h1
          id='contact-heading'
          className='font-playfair text-white text-[30px] sm:text-[42px] lg:text-[56px] font-bold leading-tight'
        >
          Contact Us
        </h1>
        <p className='text-gray-200 text-lg leading-relaxed'>
          Have a question about a property or our services? We are here to help.
        </p>
      </div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

export default HeroSection;
