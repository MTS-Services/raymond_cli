import React, { memo, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import AnimatedButton from '../shared/AnimatedButton';
import axiosInstance from '../../services/axiosInstance';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  projectType: '',
  budget: '',
  description: '',
};

const RenovationQuoteSection = memo(() => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const payload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          projectType: form.projectType,
          estimatedBudget: form.budget,
          projectDescription: form.description,
        };

        await axiosInstance.post('/api/v1/fee-builder', payload);
        toast.success('Request submitted! We will be in touch within 24 hours.');
        setForm(INITIAL_FORM);
      } catch (err) {
        const msg = err?.message || 'Something went wrong. Please try again.';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form],
  );

  const inputClass =
    'w-full border border-divider rounded px-3.5 py-3 text-sm text-ink-soft placeholder:text-placeholder-neutral focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white transition';
  const labelClass = 'block text-ink-soft font-medium text-sm leading-5 mb-2';

  return (
    <section
      id='quote'
      className='bg-white border border-border-pale py-14 lg:py-20 '
      aria-labelledby='quote-heading'
    >
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
        <div className='flex flex-col lg:flex-row gap-16 lg:gap-24'>
          {/* Left column */}
          <div className='lg:w-96 shrink-0 flex flex-col gap-6'>
            <p className='text-cta-orange font-semibold text-xs tracking-[1.2px] uppercase leading-none'>
              Request a Quote
            </p>
            <h2
              id='quote-heading'
              className='font-playfair font-semibold text-ink-soft text-3xl sm:text-4xl lg:text-[42px] leading-tight'
            >
              Tell us about your project.
            </h2>
            <p className='text-text-mid text-base leading-6'>
              We respond to every inquiry within 24 hours.
            </p>
            <div className='flex flex-col gap-4 mt-2'>
              {[
                { label: 'Phone', value: '+1 206-948-6426' },
                { label: 'Email', value: 'Support@skyridgegroup.com' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className='text-ink-soft font-semibold text-base leading-6'>
                    {label}
                  </p>
                  <p className='text-text-mid text-base leading-6'>{value}</p>
                </div>
              ))}
              <div>
                <p className='text-ink-soft font-semibold text-base leading-6'>
                  Address
                </p>
                <p className='text-text-mid text-base leading-6'>
                  411 125th PL SE Everett WA 98208
                </p>
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <div className='flex-1'>
            <div className='bg-white border border-divider rounded-md p-5 sm:p-8 lg:p-12'>
              <form
                onSubmit={handleSubmit}
                noValidate
                className='flex flex-col gap-6'
              >
                <div>
                  <label htmlFor='fullName' className={labelClass}>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    required
                    autoComplete='name'
                    value={form.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder='Your full name'
                  />
                </div>
                <div>
                  <label htmlFor='email' className={labelClass}>
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    autoComplete='email'
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder='your@email.com'
                  />
                </div>
                <div>
                  <label htmlFor='phone' className={labelClass}>
                    Phone
                  </label>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    autoComplete='tel'
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder='Your phone number'
                  />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div>
                    <label htmlFor='projectType' className={labelClass}>
                      Project Type
                    </label>
                    <select
                      id='projectType'
                      name='projectType'
                      value={form.projectType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value=''>Select project type (optional)</option>
                      <option value='ARCHITECTURAL_PLANNING'>Architectural Planning</option>
                      <option value='CUSTOM_HOME_BUILD'>Custom Home Build</option>
                      <option value='DESIGN_BUILD_MANAGEMENT'>Design-Build Management</option>
                      <option value='TURNKEY_FINISH'>Turnkey Finish</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor='budget' className={labelClass}>
                      Estimated Budget
                    </label>
                    <input
                      id='budget'
                      name='budget'
                      type='text'
                      value={form.budget}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder='e.g. $500K – $1M'
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor='description' className={labelClass}>
                    Project Description
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    rows={5}
                    value={form.description}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder='Briefly describe your project, timeline, and any specific requirements'
                  />
                </div>
                <AnimatedButton
                  type='submit'
                  disabled={submitting}
                  className='w-full flex items-center justify-center bg-cta-orange hover:bg-orange-600 disabled:opacity-60 text-white font-medium text-base py-3.5 rounded transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-300'
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </AnimatedButton>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

RenovationQuoteSection.displayName = 'RenovationQuoteSection';

export default RenovationQuoteSection;
