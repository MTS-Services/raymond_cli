import React, { memo } from 'react';
import { TrendingUp, MapPin, Home } from 'lucide-react';

const WHY_INVEST = [
  {
    id: 'roi',
    Icon: TrendingUp,
    title: 'High ROI Potential',
    desc: 'Pre-construction purchases typically offer 15-25% returns upon project completion.',
  },
  {
    id: 'location',
    Icon: MapPin,
    title: 'Prime Locations',
    desc: 'Projects strategically placed in rapidly developing areas with strong growth potential.',
  },
  {
    id: 'amenities',
    Icon: Home,
    title: 'Modern Amenities',
    desc: 'Latest designs, smart home features, and premium finishes throughout every unit.',
  },
];

const WhyInvestSection = memo(() => (
  <section
    className='bg-site-bg py-16 lg:py-20'
    aria-labelledby='why-invest-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12'>
      <h2
        id='why-invest-heading'
        className='text-center font-bold text-ink text-3xl leading-tight'
      >
        Why Invest in New Construction?
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {WHY_INVEST.map(({ id, Icon, title, desc }) => (
          <div
            key={id}
            className='bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-4 text-center'
          >
            <div
              className='w-12 h-12 rounded-full bg-indigo-tint flex items-center justify-center shrink-0'
              aria-hidden='true'
            >
              <Icon size={24} className='text-indigo-dark' />
            </div>
            <h3 className='font-semibold text-ink text-lg leading-snug'>
              {title}
            </h3>
            <p className='text-muted-slate text-base leading-relaxed'>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
));

WhyInvestSection.displayName = 'WhyInvestSection';

export default WhyInvestSection;
