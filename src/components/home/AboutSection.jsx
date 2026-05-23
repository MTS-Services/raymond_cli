import React, { memo } from 'react';
import { CircleCheck } from 'lucide-react';
import { ROUTES } from '../../config';
import AnimatedButton from '../shared/AnimatedButton';

const ABOUT_IMAGE = '/homeAboutUs.jpg';

const ABOUT_CHECK_ITEMS = [
  'Trusted and verified property listings',
  'Expert guidance at every step',
  'Transparent deals with no hidden charges',
  'Fast and hassle-free process',
  'Customer-first approach',
];

const AboutSection = memo(() => (
  <section className='bg-white py-14 lg:py-20'>
    <div className='mx-auto grid max-w-384 grid-cols-1 gap-12 px-4 sm:px-8 md:grid-cols-[1.1fr_1fr] md:items-center lg:px-12'>
      <div className='space-y-8'>
        <div className='space-y-4'>
          <span className='inline-flex rounded-full border border-black px-4 py-2 text-sm font-semibold text-black'>
            About Us
          </span>
          <h2 className='font-playfair text-3xl text-black lg:text-[40px]'>
            Your Trusted Real Estate Partner
          </h2>
          <div className='space-y-4 text-base leading-6 text-black'>
            <p>
              Welcome to Skyridge group, where we turn your property dreams into
              reality.
            </p>
            <p>
              With years of experience in the real estate industry, we
              specialize in buying, selling, and renting residential and
              commercial properties. Our mission is to provide a smooth,
              transparent, and trustworthy property experience for every client.
            </p>
            <p>
              We believe that finding the right property is more than just a
              transaction it is about building a future. That is why our
              dedicated team works closely with clients to understand their
              needs and offer the best possible solutions in the market.
            </p>
            <p>
              From modern apartments and luxury villas to commercial spaces and
              investment opportunities, we ensure quality listings that match
              your lifestyle and budget.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {ABOUT_CHECK_ITEMS.map((item) => (
            <div key={item} className='flex items-center gap-2'>
              <CircleCheck
                className='h-5 w-5 shrink-0 text-violet-icon'
                aria-hidden='true'
              />
              <span className='text-sm text-black sm:text-base'>{item}</span>
            </div>
          ))}
        </div>

        <AnimatedButton
          to={ROUTES.ABOUT}
          className='inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:text-base'
        >
          Learn More
        </AnimatedButton>
      </div>

      <div className='overflow-hidden rounded-xl'>
        <img
          src={ABOUT_IMAGE}
          alt='Modern white house exterior'
          className='h-95 w-full object-cover lg:h-156.25'
          loading='lazy'
        />
      </div>
    </div>
  </section>
));

AboutSection.displayName = 'AboutSection';

export default AboutSection;
