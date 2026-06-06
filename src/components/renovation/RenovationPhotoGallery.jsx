import React, { memo } from 'react';

const ASSETS = {
  mainImage:
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
  interior1:
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80',
  interior2:
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=600&q=80',
  interior3:
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
};

const RenovationPhotoGallery = memo(() => (
  <section className='py-8 lg:py-10 bg-white'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='flex flex-col lg:flex-row gap-3 lg:h-80 xl:h-96 2xl:h-143.75'>
        <div className='relative bg-slate-200 rounded-xl overflow-hidden aspect-video lg:aspect-auto lg:w-1/2 shrink-0'>
          <img
            src={ASSETS.mainImage}
            alt="Property exterior -- Charming 80's Ranch"
            className='absolute inset-0 size-full object-cover'
            loading='eager'
          />
        </div>
        <div className='grid grid-cols-2 grid-rows-2 gap-3 flex-1'>
          <div className='relative bg-slate-200 rounded-xl overflow-hidden aspect-video lg:aspect-auto'>
            <img
              src={ASSETS.interior1}
              alt='Interior view'
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
          <div className='relative bg-slate-200 rounded-xl overflow-hidden aspect-video lg:aspect-auto'>
            <img
              src={ASSETS.interior2}
              alt='Interior view'
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
          <div className='relative bg-slate-200 rounded-xl overflow-hidden aspect-video lg:aspect-auto'>
            <img
              src={ASSETS.interior3}
              alt='Interior view'
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
          <div className='relative bg-slate-200 rounded-xl overflow-hidden aspect-video lg:aspect-auto'>
            <img
              src={ASSETS.interior3}
              alt='Interior view'
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
        </div>
      </div>
    </div>
  </section>
));

RenovationPhotoGallery.displayName = 'RenovationPhotoGallery';

export default RenovationPhotoGallery;
