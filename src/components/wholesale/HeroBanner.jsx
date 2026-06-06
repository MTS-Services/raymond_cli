import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const ASSETS = {
  heroBg: '/Wholesale/heroBg.webp',
};
 
const HeroBanner = memo(() => (
  <section
    className='relative w-full overflow-hidden'
    style={{ minHeight: '380px', height: '35vw', maxHeight: '520px' }}
    aria-label='Off-Market Deep Discounts hero'
  >
    <img
      src={ASSETS.heroBg}
      alt=''
      aria-hidden='true'
      className='absolute inset-0 size-full object-cover pointer-events-none'
    />
    <div className='absolute inset-0 bg-black/40' aria-hidden='true' />

    <div className='relative z-10 h-full flex items-center'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6 py-12 items-start text-left w-full'>
        <div className='flex flex-col gap-4 items-start'>
          <h1 className='font-playfair text-white text-[30px] sm:text-[42px] lg:text-[56px] font-bold leading-tight tracking-tight max-w-3xl'>
            Off-Market Deep Discounts
          </h1>
          <p className='font-inter font-medium text-white text-lg leading-relaxed max-w-2xl'>
            Access exclusive investment opportunities before they hit the retail
            market. High equity, high ROI.
          </p>
        </div>

        <div>
          <Link
            to={ROUTES.BUY}
            className='inline-flex items-center bg-orange-500 text-white font-medium text-base font-inter px-6 py-3 rounded-full hover:bg-orange-600 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-orange-500'
            style={{
              animation: 'btnPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            Browse Properties
          </Link>
        </div>

        <style>{`
          @keyframes btnPop {
            0% { opacity: 0; transform: scale(0.8) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  </section>
));

HeroBanner.displayName = 'HeroBanner';

export default HeroBanner;
