import React, { memo, useState, useCallback } from 'react';
import { Phone, Mail, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { httpMethods } from '../../services/httpMethods';
import API_ENDPOINTS from '../../services/httpEndpoint';
import AnimatedButton from '../shared/AnimatedButton';
import { InputField } from './MortgageCalcSection';
import {
  getMortgageApplicationDraft,
  getAllMortgageApplicationDrafts,
  clearMortgageApplicationDraft,
  CALCULATOR_TYPES,
} from './mortgageApplicationStorage';

const formInputClass =
  'w-full border border-gray-200 rounded-[10px] px-4 py-3 text-base text-ink placeholder:text-[rgba(10,10,10,0.45)] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  annualIncome: '',
  employmentStatus: '',
  desiredLoanAmount: '',
  propertyType: '',
  notes: '',
  agreeToTerms: false,
};

const PROPERTY_TYPE_OPTIONS = [
  'DETACHED',
  'SEMI_DETACHED',
  'TERRACE',
  'FLAT',
  'BUNGALOW',
  'OFFICE_SPACE',
  'LAND',
  'WAREHOUSE',
];

const ApplicationFormSection = memo(() => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const getCalculatorPayload = useCallback(() => {
    const drafts = getAllMortgageApplicationDrafts();
    const activeDraft = getMortgageApplicationDraft();
    if (!activeDraft?.calculatorType || !activeDraft?.calculatorData) return null;

    return {
      activeDraft,
      allDrafts: drafts,
    };
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    if (!form.agreeToTerms)
      errs.agreeToTerms = 'You must agree to the terms and privacy policy.';
    return errs;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }

      const draft = getCalculatorPayload();
      if (!draft) {
        toast.error('Please use either the Mortgage Calculator or Refinance Calculator before submitting your application.');
        return;
      }

      setSubmitting(true);
      try {
        const calculatorDesiredLoanAmount = (() => {
          if (draft.activeDraft.calculatorType === CALCULATOR_TYPES.MORTGAGE) {
            const purchaseAmount = draft.activeDraft.calculatorData?.mortgagePurchaseAmount;
            const downPayment = draft.activeDraft.calculatorData?.mortgageDownPayment;
            if (purchaseAmount != null && downPayment != null) {
              return Number(purchaseAmount) - Number(downPayment);
            }
            return null;
          }

          if (draft.activeDraft.calculatorType === CALCULATOR_TYPES.REFINANCE) {
            const refinanceLoanAmount = draft.activeDraft.calculatorData?.refinanceLoanAmount;
            return refinanceLoanAmount != null ? Number(refinanceLoanAmount) : null;
          }

          return null;
        })();

          const payload = {
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phone,
          employmentStatus: form.employmentStatus,
          annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
          desiredLoanAmount: form.desiredLoanAmount
            ? Number(form.desiredLoanAmount)
            : calculatorDesiredLoanAmount,
          propertyType: form.propertyType,
          message: form.notes,
            ...draft.activeDraft.calculatorData,
            selectedCalculatorType: draft.activeDraft.calculatorType,
            mortgageCalculatorData: draft.allDrafts.mortgage?.calculatorData || null,
            refinanceCalculatorData: draft.allDrafts.refinance?.calculatorData || null,
        };

        const { error } = await httpMethods.post(
          API_ENDPOINTS.MORTGAGE_APPLICATIONS.CREATE,
          payload,
        );

        if (error) throw error;

        toast.success(
          'Application submitted! Our team will contact you shortly.',
        );
        setForm(INITIAL_FORM);
        setErrors({});
        clearMortgageApplicationDraft();
      } catch {
        toast.error('Failed to submit. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [validate, form, getCalculatorPayload],
  );

  return (
    <section
      id='apply-form'
      className='py-14 lg:py-20 bg-surface-warm mb-14 lg:mb-20'
    >
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
        <div className='text-center mb-8 lg:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-soft mb-3'>
            Apply for a Mortgage
          </h2>
          <p className='text-subtle text-base'>
            Fill out the form below and our team will respond within 24 hours
          </p>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 flex flex-col lg:flex-row gap-8 lg:gap-10'>
          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex-1 flex flex-col gap-6'
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <InputField
                label='Full Name'
                required
                id='af-name'
                error={errors.fullName}
              >
                <input
                  id='af-name'
                  name='fullName'
                  type='text'
                  autoComplete='name'
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder='Enter your full name'
                  className={formInputClass}
                />
              </InputField>
              <InputField
                label='Email Address'
                required
                id='af-email'
                error={errors.email}
              >
                <input
                  id='af-email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter your email address'
                  className={formInputClass}
                />
              </InputField>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <InputField
                label='Phone Number'
                required
                id='af-phone'
                error={errors.phone}
              >
                <input
                  id='af-phone'
                  name='phone'
                  type='tel'
                  autoComplete='tel'
                  value={form.phone}
                  onChange={handleChange}
                  placeholder='Enter your phone number'
                  className={formInputClass}
                />
              </InputField>
              <InputField label='Annual Income' id='af-income'>
                <input
                  id='af-income'
                  name='annualIncome'
                  type='text'
                  value={form.annualIncome}
                  onChange={handleChange}
                  placeholder='Enter your annual income'
                  className={formInputClass}
                />
              </InputField>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <InputField label='Employment Status' id='af-employment'>
                <input
                  id='af-employment'
                  name='employmentStatus'
                  type='text'
                  value={form.employmentStatus}
                  onChange={handleChange}
                  placeholder='Enter your employment status'
                  className={formInputClass}
                />
              </InputField>
              <InputField label='Desired Loan Amount' id='af-loan-amt'>
                <input
                  id='af-loan-amt'
                  name='desiredLoanAmount'
                  type='text'
                  value={form.desiredLoanAmount}
                  onChange={handleChange}
                  placeholder='Enter your desired loan amount'
                  className={formInputClass}
                />
              </InputField>
            </div>

            <InputField label='Property Type' id='af-property'>
              <select
                id='af-property'
                name='propertyType'
                value={form.propertyType}
                onChange={handleChange}
                className={formInputClass}
              >
                <option value='' className='text-black' style={{ color: '#111827' }}>
                  Select property type
                </option>
                {PROPERTY_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className='text-black' style={{ color: '#111827' }}>
                    {opt.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label='Message / Additional Notes' id='af-notes'>
              <textarea
                id='af-notes'
                name='notes'
                rows={4}
                value={form.notes}
                onChange={handleChange}
                placeholder='Enter any additional details'
                className={`${formInputClass} resize-none`}
              />
            </InputField>

            <div className='flex flex-col gap-1'>
              <label className='flex items-start gap-3 cursor-pointer select-none'>
                <input
                  type='checkbox'
                  name='agreeToTerms'
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-orange-500 bg-white transition-colors checked:bg-orange-500 checked:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 relative after:absolute after:left-1.25 after:top-px after:hidden after:h-2 after:w-1 after:rotate-45 after:border-b-2 after:border-r-2 after:border-white checked:after:block'
                />
                <span className='text-sm font-medium text-subtle'>
                  I agree to the terms and privacy policy
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className='text-xs text-red-500 ml-7'>
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <AnimatedButton
              type='submit'
              disabled={submitting}
              className='w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-base font-medium py-4 rounded-lg transition-colors duration-150 cursor-pointer'
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </AnimatedButton>
          </form>

          <aside className='lg:w-72 xl:w-80 bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col gap-5 sm:gap-7 self-start lg:sticky lg:top-24'>
            <h3 className='text-xl font-semibold text-ink-soft'>
              Why Choose Skyridge?
            </h3>
            <ul className='grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4'>
              {[
                'Competitive interest rates',
                'Fast 24-hour pre-approval',
                'Dedicated loan specialist',
                'No hidden fees',
              ].map((item) => (
                <li key={item} className='flex items-center gap-3'>
                  <span className='w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0'>
                    <Check className='w-3 h-3 text-white' aria-hidden='true' />
                  </span>
                  <span className='text-sm text-ink-soft'>{item}</span>
                </li>
              ))}
            </ul>
            <div className='border-t border-gray-200 pt-5 sm:pt-6 flex flex-col gap-3'>
              <a
                href='tel:+12069486426'
                className='flex items-center gap-3 text-sm text-ink-soft hover:text-orange-500 transition-colors'
              >
                <Phone className='w-5 h-5 shrink-0' aria-hidden='true' />
                +1 206-948-6426
              </a>
              <a
                href='mailto:Support@skyridgegroup.com'
                className='flex items-center gap-3 text-sm text-ink-soft hover:text-orange-500 transition-colors'
              >
                <Mail className='w-5 h-5 shrink-0' aria-hidden='true' />
                Support@skyridgegroup.com
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
});

ApplicationFormSection.displayName = 'ApplicationFormSection';

export default ApplicationFormSection;
