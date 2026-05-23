import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../config';

const ASSETS = {
  build1: '/BuildAndRenovate/build1.webp',
  build2: '/BuildAndRenovate/build2.webp',
  build3: '/BuildAndRenovate/build3.webp',
  build4: '/BuildAndRenovate/build4.webp',
  build5: '/BuildAndRenovate/build5.webp',
  build6: '/BuildAndRenovate/build6.webp',
};

const RenovationGallerySection = memo(() => (
  <section
    className='py-14 lg:py-20'
    aria-labelledby='gallery-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10'>
      <h2
        id='gallery-heading'
        className='font-playfair font-semibold text-ink-soft text-3xl sm:text-4xl lg:text-[42px] text-center leading-tight '
      >
        Recent custom builds.
      </h2>

      {/* Row 1 -- large left + 2 stacked right */}
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='relative overflow-hidden rounded-md lg:flex-[1.2_0_0] h-72 lg:h-125'>
          <img
            src={ASSETS.build1}
            alt='Custom build exterior at sunset'
            className='absolute inset-0 size-full object-cover'
            loading='lazy'
          />
        </div>
        <div className='flex flex-col gap-4 lg:flex-1'>
          <div className='relative overflow-hidden rounded-md h-56 lg:h-60.5'>
            <img
              src={ASSETS.build2}
              alt='Modern home facade'
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
          <div className='relative overflow-hidden rounded-md h-56 lg:h-60.5'>
            <img
              src={ASSETS.build3}
              alt='Contemporary residential build'
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
        </div>
      </div>

      {/* Row 2 -- 3 equal */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[
          { src: ASSETS.build4, alt: 'Luxury villa build' },
          { src: ASSETS.build5, alt: 'Custom home with pool' },
          { src: ASSETS.build6, alt: 'Modern residential exterior' },
        ].map(({ src, alt }) => (
          <div
            key={alt}
            className='relative overflow-hidden rounded-md h-56 sm:h-72 lg:h-87.5'
          >
            <img
              src={src}
              alt={alt}
              className='absolute inset-0 size-full object-cover'
              loading='lazy'
            />
          </div>
        ))}
      </div>

      <div className='flex justify-center'>
        <Link
          to={ROUTES.PORTFOLIO}
          className='inline-flex items-center gap-1.5 text-indigo-dark font-medium text-base hover:text-indigo-800 transition-colors duration-150'
        >
          View all projects
          <ArrowRight size={18} aria-hidden='true' />
        </Link>
      </div>
    </div>
  </section>
));

RenovationGallerySection.displayName = 'RenovationGallerySection';

export default RenovationGallerySection;
