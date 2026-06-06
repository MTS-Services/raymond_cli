import React, { memo } from 'react';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const TERMS_POINTS = [
  'By accessing and using this website, you agree to use it only for lawful purposes related to real estate inquiries and services. All content provided on this website is for general informational purposes only and may change without notice.',
  'While we strive to ensure accuracy, we do not guarantee that property information, pricing, availability, or other details are always current or error-free. All real estate transactions are subject to verification, contract, and applicable laws.',
  'Unauthorized copying, distribution, or use of website content, including property descriptions, images, or branding, is strictly prohibited without written consent.',
  'We reserve the right to update or modify these terms at any time without prior notice.',
];

const PolicyContentSection = memo(() => (
  <section className='py-12 sm:py-16 lg:py-20'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <article className='bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-8 lg:p-10'>
        <div className='space-y-6'>
          {TERMS_POINTS.map((point) => (
            <p key={point} className='text-gray-800 text-base leading-7'>
              {point}
            </p>
          ))}
        </div>
      </article>
    </div>
  </section>
));

PolicyContentSection.displayName = 'PolicyContentSection';

export default PolicyContentSection;
