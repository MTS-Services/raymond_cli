import React, { memo } from 'react';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const POLICY_POINTS = [
  'We respect your privacy and are committed to protecting your personal information. When you submit information through this website, including your name, phone number, email address, or any other details, it is used solely for the purpose of responding to your inquiries, providing real estate services, and communicating with you regarding available properties or transactions.',
  'We do not sell, rent, or trade your personal information to third parties. Your information may only be shared with trusted service providers when necessary to complete a real estate transaction or as required by law.',
  'By using this website, you consent to the collection and use of your information in accordance with this policy.',
];

const PolicyContentSection = memo(() => (
  <section className='py-12 sm:py-16 lg:py-20'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <article className='bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-8 lg:p-10'>
        <div className='space-y-6'>
          {POLICY_POINTS.map((point) => (
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
