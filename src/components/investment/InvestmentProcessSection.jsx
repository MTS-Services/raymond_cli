import React, { memo } from 'react';
import {
  Search,
  MessageCircle,
  Wrench,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const PROCESS_STEPS = [
  {
    icon: Search,
    title: 'Discover Opportunities',
    description:
      'Browse our curated selection of vetted investment opportunities across residential, commercial, and construction projects.',
  },
  {
    icon: MessageCircle,
    title: 'Investment Consultation',
    description:
      'Meet with our investment team to discuss your goals, risk tolerance, and portfolio allocation strategy.',
  },
  {
    icon: Wrench,
    title: 'Project Execution',
    description:
      'We handle all aspects of development, construction, and property management while keeping you informed every step.',
  },
  {
    icon: TrendingUp,
    title: 'Profit Generation',
    description:
      'Receive quarterly distributions and detailed reporting on project performance and financial metrics.',
  },
  {
    icon: ArrowRight,
    title: 'Exit Strategy',
    description:
      'Choose from multiple exit options including sale, refinance, or continued ownership for long-term appreciation.',
  },
];

const ProcessStep = memo(({ icon: Icon, title, description }) => (
  <div className='flex flex-col items-center text-center gap-4'>
    <div className='w-16 h-16 bg-orange-500 flex items-center justify-center rounded-full shrink-0'>
      <Icon className='w-7 h-7 text-white' aria-hidden='true' />
    </div>
    <div className='flex flex-col gap-2'>
      <h3 className='text-white font-semibold text-base leading-snug'>
        {title}
      </h3>
      <p className='text-base text-gray-400 leading-relaxed'>{description}</p>
    </div>
  </div>
));
ProcessStep.displayName = 'ProcessStep';

const InvestmentProcessSection = memo(() => (
  <section
    className='py-14 lg:py-20 bg-surface-dark'
    aria-labelledby='process-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='text-center mb-10 sm:mb-16'>
        <div className='inline-flex items-center bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4'>
          <span className='text-orange-400 text-xs font-semibold tracking-wide uppercase'>
            How It Works
          </span>
        </div>
        <h2
          id='process-heading'
          className='font-playfair text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-4'
        >
          Our Investment Process
        </h2>
        <p className='text-base text-gray-400 max-w-2xl mx-auto leading-relaxed'>
          A streamlined, transparent process designed to maximize returns while
          minimizing complexity.
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6'>
        {PROCESS_STEPS.map((step) => (
          <ProcessStep key={step.title} {...step} />
        ))}
      </div>
    </div>
  </section>
));

InvestmentProcessSection.displayName = 'InvestmentProcessSection';

export default InvestmentProcessSection;
