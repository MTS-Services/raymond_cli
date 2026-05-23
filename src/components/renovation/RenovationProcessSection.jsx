import React, { memo } from 'react';

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Discovery Call',
    desc: 'We learn about your vision, site, and budget.',
  },
  {
    num: '02',
    title: 'Concept & Design',
    desc: 'Architectural drawings and 3D previews.',
  },
  {
    num: '03',
    title: 'Approvals & Permits',
    desc: 'We handle paperwork end-to-end.',
  },
  {
    num: '04',
    title: 'Construction',
    desc: 'Weekly progress updates and site visits.',
  },
  { num: '05', title: 'Handover', desc: 'Final walkthrough and keys.' },
];

const RenovationProcessSection = memo(() => (
  <section
    id='process'
    className='bg-surface-cream py-14 lg:py-20 '
    aria-labelledby='process-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <h2
        id='process-heading'
        className='font-playfair font-semibold text-ink-soft text-2xl sm:text-3xl lg:text-[42px] text-center leading-tight mb-12 sm:mb-16 lg:mb-20'
      >
        How a Skyridge build comes together.
      </h2>

      {/* Desktop stepper */}
      <div className='hidden sm:flex relative'>
        <div
          className='absolute top-6 left-[10%] right-[10%] h-px bg-divider'
          aria-hidden='true'
        />
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.num}
            className='relative flex-1 flex flex-col items-center'
          >
            <div className='relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-indigo-dark bg-surface-cream shrink-0'>
              <span className='font-semibold text-indigo-dark text-sm leading-none'>
                {step.num}
              </span>
            </div>
            <div className='flex flex-col gap-1.5 mt-5 text-center px-2'>
              <h3 className='font-playfair font-semibold text-ink-soft text-base leading-snug'>
                {step.title}
              </h3>
              <p className='text-text-mid text-base leading-relaxed'>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile stepper */}
      <div className='flex sm:hidden flex-col'>
        {PROCESS_STEPS.map((step, idx) => (
          <div key={step.num} className='flex gap-4 items-start'>
            <div className='flex flex-col items-center shrink-0'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-dark bg-surface-cream'>
                <span className='font-semibold text-indigo-dark text-sm leading-none'>
                  {step.num}
                </span>
              </div>
              {idx < PROCESS_STEPS.length - 1 && (
                <div
                  className='w-px bg-divider my-1'
                  style={{ minHeight: '40px' }}
                  aria-hidden='true'
                />
              )}
            </div>
            <div className='flex flex-col gap-1 pt-1.5 pb-6'>
              <h3 className='font-playfair font-semibold text-ink-soft text-base leading-snug'>
                {step.title}
              </h3>
              <p className='text-text-mid text-base leading-relaxed'>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

RenovationProcessSection.displayName = 'RenovationProcessSection';

export default RenovationProcessSection;
