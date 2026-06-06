import React, { memo } from 'react';

const ASSETS = {
  whoWeAreMain: '/AboutUs/whoWeAre1.webp',
  whoWeAreSmallLeft: '/AboutUs/whoWeAreSmallLeft.webp',
  whoWeAreSmallRight: '/AboutUs/whoWeAreSmallRight.webp',
};

const WhoWeAreSection = memo(() => (
  <section
    className='bg-white py-14 lg:py-20'
    aria-labelledby='who-we-are-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24'>
      <div className='flex-1 min-w-0 flex flex-col gap-6'>
        <h2
          id='who-we-are-heading'
          className='font-playfair text-slate-900 text-3xl lg:text-4xl font-semibold leading-tight'
        >
          Who We Are
        </h2>
        <div className='text-slate-700 text-base leading-7 flex flex-col gap-4'>
          <p>
            We are a professional real estate agency dedicated to helping people
            find their perfect home, commercial space, or investment property.
            With years of experience in the real estate market, we ensure smooth
            and secure transactions for every client.
          </p>
          <p>
            We believe in honesty, transparency, and long-term relationships
            with our customers.
          </p>
        </div>
      </div>

      {/* Full cluster (xl+): orange border box + large main image + 2 small overlays */}
      <div
        className='relative hidden xl:block shrink-0'
        style={{ width: '563px', height: '540px' }}
        aria-hidden='true'
      >
        {/* Orange border decoration box */}
        <div
          className='absolute border-2 border-orange-600 rounded-lg'
          style={{ left: '136px', top: 0, width: '393px', height: '397px' }}
        />
        {/* Main large image */}
        <div
          className='absolute rounded-lg overflow-hidden border-[3px] border-white shadow-xl'
          style={{ left: '44px', top: '32px', width: '463px', height: '454px' }}
        >
          <img
            src={ASSETS.whoWeAreMain}
            alt='Skyridge Group team collaborating in the office'
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
        {/* Small top-left image */}
        <div
          className='absolute rounded-lg overflow-hidden border-[3px] border-white shadow-md z-10'
          style={{ left: 0, top: '19px', width: '155px', height: '182px' }}
        >
          <img
            src={ASSETS.whoWeAreSmallLeft}
            alt='Real estate team meeting'
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
        {/* Small bottom-right image */}
        <div
          className='absolute rounded-lg overflow-hidden border-[3px] border-white shadow-md z-10'
          style={{
            left: '401px',
            top: '324px',
            width: '162px',
            height: '211px',
          }}
        >
          <img
            src={ASSETS.whoWeAreSmallRight}
            alt='Client property discussion'
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
      </div>

      {/* Simplified cluster (lg only, not xl) */}
      <div
        className='relative hidden lg:block xl:hidden shrink-0'
        style={{ width: '420px', height: '400px' }}
        aria-hidden='true'
      >
        {/* Orange border decoration */}
        <div
          className='absolute border-2 border-orange-600 rounded-lg'
          style={{ left: '90px', top: 0, width: '295px', height: '295px' }}
        />
        {/* Main image */}
        <div
          className='absolute rounded-lg overflow-hidden border-[3px] border-white shadow-xl'
          style={{ left: '30px', top: '24px', width: '347px', height: '340px' }}
        >
          <img
            src={ASSETS.whoWeAreMain}
            alt='Skyridge Group team collaborating'
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
        {/* Small overlay */}
        <div
          className='absolute rounded-lg overflow-hidden border-[3px] border-white shadow-md z-10'
          style={{ left: 0, top: '14px', width: '116px', height: '136px' }}
        >
          <img
            src={ASSETS.whoWeAreSmallLeft}
            alt='Real estate team'
            className='absolute inset-0 w-full h-full object-cover rounded-lg'
            loading='lazy'
          />
        </div>
      </div>

      {/* Mobile -- single image */}
      <div className='lg:hidden w-full max-w-md rounded-xl overflow-hidden shadow-lg'>
        <img
          src={ASSETS.whoWeAreMain}
          alt='Skyridge Group team collaborating'
          className='w-full h-64 object-cover'
          loading='lazy'
        />
      </div>
    </div>
  </section>
));

WhoWeAreSection.displayName = 'WhoWeAreSection';

export default WhoWeAreSection;
