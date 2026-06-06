import React, { memo } from 'react';
import {
  TrendingUp,
  Percent,
  Home as HomeIcon,
  ChevronRight,
} from 'lucide-react';

const LOAN_TYPES = [
  {
    Icon: TrendingUp,
    title: 'Fixed Rate Mortgage',
    description:
      'Predictable monthly payments with the same interest rate for the entire loan term perfect for long term stability.',
  },
  {
    Icon: Percent,
    title: 'Adjustable Rate Mortgage',
    description:
      'Lower initial rates that adjust over time ideal if you plan to move or refinance within a few years.',
  },
  {
    Icon: HomeIcon,
    title: 'First-Time Buyer',
    description:
      'Special programs with low down payments and flexible credit requirements designed for new homeowners.',
  },
];

const LoanTypesSection = memo(() => (
  <section className='py-14 lg:py-20 bg-white'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='text-center mb-8 lg:mb-14'>
        <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-soft mb-3'>
          Choose Your Loan Type
        </h2>
        <p className='text-subtle text-base'>
          Find the mortgage that fits your life
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {LOAN_TYPES.map(({ Icon, title, description }) => (
          <div
            key={title}
            className='bg-white border border-gray-100 rounded-2xl shadow-md p-5 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 hover:shadow-lg transition-shadow duration-200'
          >
            <div className='w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0'>
              <Icon className='w-8 h-8 text-orange-500' aria-hidden='true' />
            </div>
            <div className='flex flex-col gap-3'>
              <h3 className='text-xl font-semibold text-ink-soft'>{title}</h3>
              <p className='text-subtle text-base leading-relaxed'>
                {description}
              </p>
            </div>
            <a
              href='#apply-form'
              className='inline-flex items-center gap-1 text-orange-500 text-base hover:gap-2 transition-all duration-150 cursor-pointer'
            >
              Learn More
              <ChevronRight className='w-4 h-4' aria-hidden='true' />
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
));

LoanTypesSection.displayName = 'LoanTypesSection';

export default LoanTypesSection;
