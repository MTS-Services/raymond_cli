import React, { memo } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  UserCheck,
  Lock,
} from 'lucide-react';

const ASSETS = {
  whyChooseUsPhoto: '/AboutUs/whyChooseUsPhoto.webp',
};

const FeatureCard = memo(({ icon: Icon, iconBg, title, description }) => (
  <div className='bg-white border border-gray-100 rounded-2xl flex flex-col gap-4 px-6 py-8'>
    <div
      className={`${iconBg} w-14 h-13 flex items-center justify-center rounded-lg shrink-0`}
    >
      <Icon className='w-6 h-6 text-slate-700' aria-hidden='true' />
    </div>
    <div className='flex flex-col gap-3'>
      <h3 className='text-slate-700 text-xl font-semibold font-inter leading-snug'>
        {title}
      </h3>
      <p className='text-gray-500 text-sm leading-relaxed'>{description}</p>
    </div>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const FEATURE_CARDS = [
  {
    id: 'trusted',
    icon: ShieldCheck,
    iconBg: 'bg-blue-tint',
    title: 'Trusted Listings',
    description:
      'Only verified and legally approved properties for your peace of mind.',
  },
  {
    id: 'range',
    icon: Building2,
    iconBg: 'bg-violet-50',
    title: 'Wide Property Range',
    description:
      'Apartments, villas, commercial spaces & land tailored to your needs.',
  },
  {
    id: 'agents',
    icon: UserCheck,
    iconBg: 'bg-blue-tint',
    title: 'Expert Agents',
    description:
      'Professional guidance at every step of your property journey.',
  },
  {
    id: 'secure',
    icon: Lock,
    iconBg: 'bg-orange-50',
    title: 'Secure Deals',
    description: 'Safe and transparent transactions backed by legal expertise.',
  },
];

const WhyChooseUsSection = memo(() => (
  <section
    className='bg-white py-14 lg:py-20'
    aria-labelledby='why-choose-us-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-start gap-8 lg:gap-10'>
      {/* Left -- large photo with "Our Promise" overlay */}
      <div className='relative w-full lg:w-1/2 shrink-0 rounded-2xl overflow-hidden aspect-4/3 sm:aspect-video lg:aspect-auto lg:self-stretch'>
        <img
          src={ASSETS.whyChooseUsPhoto}
          alt='Modern residential property exterior'
          className='absolute inset-0 w-full h-full object-cover'
          loading='lazy'
        />
        {/* Our Promise card -- bottom of photo */}
        <div className='absolute bottom-5 left-5 sm:bottom-7 sm:left-7'>
          <div
            className='rounded-[14px] border border-white/20 px-3.5 py-3 sm:px-5 sm:py-4 shadow-[0_10px_24px_rgba(0,0,0,0.16)] backdrop-blur-md'
            style={{ backgroundColor: 'rgba(122, 122, 122, 0.34)' }}
          >
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='bg-slate-900 size-11 sm:size-15 rounded-full flex items-center justify-center shrink-0'>
                <ArrowRight
                  className='size-5 sm:size-6 text-white'
                  aria-hidden='true'
                />
              </div>
              <div className='min-w-0 flex flex-col gap-1'>
                <p className='text-white text-[15px] sm:text-[17px] font-medium font-inter leading-none'>
                  Our Promise
                </p>
                <p className='text-white/95 text-[13px] sm:text-[15px] font-medium font-inter leading-[1.4]'>
                  "Your satisfaction is our priority"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right -- heading + subtitle + feature cards grid */}
      <div className='flex flex-col gap-8 flex-1 min-w-0'>
        <div className='flex flex-col gap-4'>
          <p className='text-orange-600 text-base font-medium tracking-[0.2em] uppercase font-inter'>
            Why Choose Us
          </p>
          <h2
            id='why-choose-us-heading'
            className='font-playfair text-black text-3xl lg:text-4xl font-semibold leading-tight'
          >
            We provide the best{' '}
            <span className='text-orange-600'>Real Estate</span> services
          </h2>
          <p className='text-slate-700 text-base leading-7'>
            EstateElite is more than just a property portal. We are your
            dedicated partners in finding the perfect space to call home.
          </p>
        </div>

        {/* 2×2 feature cards grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  </section>
));

WhyChooseUsSection.displayName = 'WhyChooseUsSection';

export default WhyChooseUsSection;
