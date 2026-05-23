import React, { memo } from 'react';
import { CircleDollarSign, TrendingUp, Hammer, Landmark } from 'lucide-react';

const QUICK_HIGHLIGHTS = [
  {
    title: 'Buy With Confidence',
    description:
      'Find the perfect home with expert guidance every step of the way.',
    Icon: CircleDollarSign,
  },
  {
    title: 'Invest For Future',
    description:
      'We help you identify high-potential investment opportunities.',
    Icon: TrendingUp,
  },
  {
    title: 'Build & Renovation',
    description:
      'From design to completion, we build spaces that create value.',
    Icon: Hammer,
  },
  {
    title: 'Mortgage Solution',
    description: 'Competitive rates and loan options to fit your needs.',
    Icon: Landmark,
  },
];

const HighlightsSection = memo(() => (
  <section className='relative z-0 bg-surface-highlight pt-10'>
    <div className='mx-auto max-w-384 px-4 sm:px-8 lg:px-12'>
      <div className='grid grid-cols-1 gap-5  py-7 md:grid-cols-2 xl:grid-cols-4 xl:gap-10'>
        {QUICK_HIGHLIGHTS.map(({ title, description, Icon }, index) => (
          <div
            key={title}
            className={`flex gap-4 ${
              index !== QUICK_HIGHLIGHTS.length - 1
                ? 'xl:border-r xl:border-border-soft xl:pr-8'
                : ''
            }`}
          >
            <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-icon-tint'>
              <Icon className='h-4 w-4 text-navy' aria-hidden='true' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-highlight'>{title}</h3>
              <p className='text-sm leading-5 text-near-black'>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

HighlightsSection.displayName = 'HighlightsSection';

export default HighlightsSection;
