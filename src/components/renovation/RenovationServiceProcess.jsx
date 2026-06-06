import React, { memo } from 'react';
import { ArrowRight } from 'lucide-react';

const PROCESS_STEPS = [
  {
    num: 1,
    title: 'Consultation',
    desc: 'Meet with our design experts to discuss your vision, needs, and budget.',
  },
  {
    num: 2,
    title: 'Design',
    desc: 'Receive detailed 3D renderings and material selections for your approval.',
  },
  {
    num: 3,
    title: 'Execution',
    desc: 'Our skilled craftsmen bring your design to life with quality workmanship.',
  },
  {
    num: 4,
    title: 'Delivery',
    desc: 'Final walkthrough and handover of your beautifully renovated space.',
  },
];

const RenovationServiceProcess = memo(() => (
  <section
    className='bg-white py-14 lg:py-20 '
    aria-labelledby='process-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <h2
        id='process-heading'
        className='text-center font-bold text-ink-soft text-3xl sm:text-4xl leading-tight mb-16'
      >
        Our Process
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-0'>
        {PROCESS_STEPS.map((step, idx) => (
          <div key={step.num} className='relative flex flex-col items-center'>
            {idx > 0 && (
              <div
                className='absolute hidden sm:flex left-0 top-8 -translate-x-1/2 -translate-y-1/2'
                aria-hidden='true'
              >
                <ArrowRight size={18} className='text-gray-400' />
              </div>
            )}
            <div className='flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 shrink-0 mb-5'>
              <span className='font-bold text-white text-xl leading-none'>
                {step.num}
              </span>
            </div>
            <div className='flex flex-col gap-2 text-center px-4'>
              <h3 className='font-semibold text-ink-soft text-base leading-snug'>
                {step.title}
              </h3>
              <p className='text-text-mid text-sm leading-relaxed'>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

RenovationServiceProcess.displayName = 'RenovationServiceProcess';

export default RenovationServiceProcess;
