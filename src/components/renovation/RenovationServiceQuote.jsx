import React, { memo, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import AnimatedButton from '../shared/AnimatedButton';
import { httpMethods } from '../../services/httpMethods';
import API_ENDPOINTS from '../../services/httpEndpoint';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  propertyType: '',
  renovationType: '',
  budgetRange: '',
  projectDetails: '',
};

const PROPERTY_TYPE_OPTIONS = [
  'SINGLE_FAMILY_HOME',
  'TOWNHOMES',
  'LAND',
  'COMMERCIAL',
];

const humanize = (s) =>
  String(s)
    .split(/[_\s]+/) // split on underscore or spaces
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');

const RENOVATION_TYPE_OPTIONS = [
  'KITCHEN_RENOVATION',
  'BATHROOM_REMODELING',
  'FULL_HOME_MAKEOVER',
  'OFFICE_RENOVATION',
];

const RenovationServiceQuote = memo(() => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [errors],
  );

  const validate = useCallback(() => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim()) next.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.';
    return next;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setSubmitting(true);
      try {
        const payload = {
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phone,
          propertyLocation: form.location,
          propertyType: form.propertyType,
          renovationType: form.renovationType,
          budgetRange: form.budgetRange,
          projectDetails: form.projectDetails,
        };

        const { data, error } = await httpMethods.post(
          API_ENDPOINTS.RENOVATIONS.CREATE,
          payload,
        );

        if (error) {
          throw error;
        }

        toast.success('Quote request submitted! We will be in touch within 24 hours.');
        setForm(INITIAL_FORM);
        setErrors({});
      } catch (err) {
        const message = err?.response?.data?.message || 'Something went wrong. Please try again.';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [validate, form],
  );

  const inputClass =
    'w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-placeholder-cool focus:outline-none focus:ring-2 focus:ring-orange-400 transition';
  const textareaClass =
    'w-full min-h-[120px] bg-white/10 border border-white/20 rounded-lg px-3 py-3 text-sm text-white placeholder:text-placeholder-cool leading-5 align-top focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none';
  const labelClass = 'block text-white text-sm font-medium mb-2';

  return (
    <section
      id='quote'
      className='bg-navy-card py-14 lg:py-20 '
      aria-labelledby='quote-heading'
    >
      <div className='max-w-2xl mx-auto px-4 sm:px-6'>
        <div className='text-center mb-10'>
          <h2
            id='quote-heading'
            className='font-bold text-white text-3xl sm:text-4xl leading-tight mb-3'
          >
            Get Your Free Quote
          </h2>
          <p className='text-text-cool text-base leading-relaxed'>
            Tell us about your project and we&apos;ll get back to you within 24
            hours
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate
          className='flex flex-col gap-6'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div>
              <label htmlFor='fullName' className={labelClass}>
                Full Name <span className='text-red-400'>*</span>
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                required
                autoComplete='name'
                value={form.fullName}
                onChange={handleChange}
                placeholder='Enter your full legal name'
                className={inputClass}
                aria-describedby={errors.fullName ? 'fullName-err' : undefined}
              />
              {errors.fullName && (
                <p
                  id='fullName-err'
                  className='mt-1 text-xs text-red-400'
                  role='alert'
                >
                  {errors.fullName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor='phone' className={labelClass}>
                Phone Number
              </label>
              <input
                id='phone'
                name='phone'
                type='tel'
                autoComplete='tel'
                value={form.phone}
                onChange={handleChange}
                placeholder='Enter your phone number'
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor='email' className={labelClass}>
              Email Address <span className='text-red-400'>*</span>
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              autoComplete='email'
              value={form.email}
              onChange={handleChange}
              placeholder='Enter your email address'
              className={inputClass}
              aria-describedby={errors.email ? 'email-err' : undefined}
            />
            {errors.email && (
              <p
                id='email-err'
                className='mt-1 text-xs text-red-400'
                role='alert'
              >
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor='location' className={labelClass}>
              Property Location
            </label>
            <input
              id='location'
              name='location'
              type='text'
              autoComplete='street-address'
              value={form.location}
              onChange={handleChange}
              placeholder='Enter the property address or city, state'
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor='propertyType' className={labelClass}>
              Property Type
            </label>
            <select
              id='propertyType'
              name='propertyType'
              value={form.propertyType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value='' className='text-black' style={{ color: '#111827' }}>
                Select property type
              </option>
              {PROPERTY_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className='text-black' style={{ color: '#111827' }}>
                  {humanize(opt)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='renovationType' className={labelClass}>
              Renovation Type
            </label>
            <select
              id='renovationType'
              name='renovationType'
              value={form.renovationType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value='' className='text-black' style={{ color: '#111827' }}>
                Select renovation type
              </option>
              {RENOVATION_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className='text-black' style={{ color: '#111827' }}>
                  {opt.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='budgetRange' className={labelClass}>
              Budget Range
            </label>
            <input
              id='budgetRange'
              name='budgetRange'
              type='text'
              value={form.budgetRange}
              onChange={handleChange}
              placeholder='Enter your estimated budget range'
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor='projectDetails' className={labelClass}>
              Project Details
            </label>
            <textarea
              id='projectDetails'
              name='projectDetails'
              rows={5}
              value={form.projectDetails}
              onChange={handleChange}
              placeholder='Describe your renovation goals, preferred timeline, and key requirements'
              className={textareaClass}
            />
          </div>
          <AnimatedButton
            type='submit'
            disabled={submitting}
            className='inline-flex items-center justify-center w-full bg-secondary hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-lg px-6 py-3.5 rounded-lg transition-colors duration-150'
          >
            {submitting ? 'Submitting...' : 'Submit Quote Request'}
          </AnimatedButton>
          <p className='text-center text-gray-500 text-sm leading-relaxed'>
            By submitting this form, you agree to be contacted by our team
            regarding your renovation project.
          </p>
        </form>
      </div>
    </section>
  );
});

RenovationServiceQuote.displayName = 'RenovationServiceQuote';

export default RenovationServiceQuote;
