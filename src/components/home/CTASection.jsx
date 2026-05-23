// import React, { memo } from 'react';
// import { ArrowRight } from 'lucide-react';
// import { ROUTES } from '../../config';
// import AnimatedButton from '../shared/AnimatedButton';

// const CTASection = memo(() => (
//   <section className='bg-surface-page py-14 lg:py-20'>
//     <div className='mx-auto max-w-384 px-4 sm:px-8 lg:px-12'>
//       <div className='relative overflow-hidden rounded-2xl bg-navy p-8 lg:p-12'>
//         <div
//           className='absolute -right-24 -top-20 h-105 w-130 rotate-16 rounded-[48px] bg-[radial-gradient(circle_at_24px_24px,#7C3AED_20px,transparent_21px)] bg-size-[48px_48px] opacity-95'
//           aria-hidden='true'
//         />

//         <div className='relative z-10 max-w-160 space-y-6'>
//           <h2 className='font-playfair text-4xl leading-tight text-white lg:text-[56px]'>
//             Ready to find your dream home?
//           </h2>
//           <p className='text-base leading-6 text-text-light'>
//             Join thousands of happy homeowners who found their perfect match
//             through EstateFlow.
//           </p>

//           <AnimatedButton
//             to={ROUTES.BUY}
//             className='inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-black transition-colors hover:bg-slate-100'
//           >
//             <span className='text-sm font-medium sm:text-base'>
//               Browse Properties
//             </span>
//             <span className='flex h-8 w-8 items-center justify-center rounded-full bg-purple'>
//               <ArrowRight className='h-5 w-5 text-white' aria-hidden='true' />
//             </span>
//           </AnimatedButton>
//         </div>
//       </div>
//     </div>
//   </section>
// ));

// CTASection.displayName = 'CTASection';

// export default CTASection;







import React, { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../config';
import AnimatedButton from '../shared/AnimatedButton';

const CTASection = memo(() => (
  <section className='bg-surface-page py-14 lg:py-20'>
    <div className='mx-auto max-w-384 px-4 sm:px-8 lg:px-12'>
      <div className='relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-2xl bg-navy p-8 sm:p-10 lg:p-16'>
        
        {/* Decorative Right Image Container (Hidden on mobile, block on lg devices) */}
        <div className='absolute bottom-0 right-0 top-0 hidden w-[45%] lg:block'>
          <img
            src='/cta.webp' /* Replace with your actual image path */
            alt='Decorative pattern'
            className='h-full w-full object-cover object-left'
            aria-hidden='true'
            loading='lazy'
          />
        </div>

        {/* Content Container */}
        <div className='relative z-10 max-w-full space-y-5 sm:max-w-md lg:max-w-[550px] lg:space-y-6'>
          <h2 className='font-playfair text-4xl leading-tight text-white lg:text-[56px]'>
            Ready to find your dream home?
          </h2>
          <p className='text-base leading-6 text-text-light'>
            Join thousands of happy homeowners who found their perfect match
            through EstateFlow.
          </p>

          <div className='pt-2'>
            <AnimatedButton
              to={ROUTES.BUY}
              className='inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-black transition-colors hover:bg-slate-100'
            >
              <span className='text-sm font-semibold sm:text-base'>
                Browse Properties
              </span>
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-purple'>
                <ArrowRight className='h-5 w-5 text-white' aria-hidden='true' />
              </span>
            </AnimatedButton>
          </div>
        </div>
        
      </div>
    </div>
  </section>
));

CTASection.displayName = 'CTASection';

export default CTASection;
