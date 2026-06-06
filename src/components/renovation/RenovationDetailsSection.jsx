import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  BedDouble,
  Bath,
  Maximize2,
  CalendarDays,
  Calculator,
  UserRound,
  FileText,
} from 'lucide-react';
import AnimatedButton from '../shared/AnimatedButton';
import PropertiesCTA from '../shared/PropertiesCTA';

const PROPERTY = {
  title: "Charming 80's Ranch Renovation",
  badge: 'Fully Renovated',
  address: '456 Oak Avenue, Portland, OR 97201',
  price: 425000,
  priceDisplay: '$425,000',
  beds: 3,
  Bathrooms: 2,
  sqft: '1,850',
  yearBuilt: '1982',
  description:
    "Completely renovated 80's ranch featuring modern open-concept living while maintaining the warmth and character of its era. This stunning home offers the perfect blend of classic architecture and contemporary amenities. The renovation preserved original hardwood floors, added vaulted ceilings, and created a seamless indoor-outdoor flow.",
  propertyType: 'Single Family',
  lotSize: '0.25 acres (10,890 sqft)',
  heating: 'Forced Air, Natural Gas',
  cooling: 'Central Air',
  parking: '2-car attached garage',
  daysOnMarket: '21 days',
};

const AGENT = {
  name: 'Sarah Mitchell',
  label: 'Licensed Agent',
  email: 'Support@skyridgegroup.com',
};

const LISTING = {
  listedDate: '4/1/2026',
  daysOnMarket: '21 days',
  pricePerSqft: '$230',
};

function calcMortgage(price, downPct, annualRate, termYears) {
  const downAmt = Math.round(price * (downPct / 100));
  const principal = price - downAmt;
  const monthlyRate = annualRate / 100 / 12;
  const n = termYears * 12;
  let pi;
  if (monthlyRate === 0) {
    pi = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    pi = principal * ((monthlyRate * factor) / (factor - 1));
  }
  const tax = (price * 0.013) / 12;
  const insurance = (price * 0.0035) / 12;
  return {
    principalAndInterest: Math.round(pi),
    propertyTax: Math.round(tax),
    homeInsurance: Math.round(insurance),
    total: Math.round(pi + tax + insurance),
    downPayment: downAmt,
  };
}

const DEFAULTS = { downPct: 20, interestRate: 6.5, loanTerm: 3 };

const FeatureCard = memo(({ icon, value, label }) => (
  <div className='flex-1 min-w-0 bg-white border border-black/10 rounded-2xl flex flex-col items-center justify-center gap-1 py-4 px-3'>
    <span className='text-slate-500' aria-hidden='true'>
      {icon}
    </span>
    <span className='font-inter font-bold text-ink text-2xl leading-8 whitespace-nowrap'>
      {value}
    </span>
    <span className='font-inter font-normal text-subtle text-sm leading-5 whitespace-nowrap'>
      {label}
    </span>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const DetailRow = memo(({ label, value }) => (
  <div className='flex flex-col gap-0.5'>
    <span className='font-inter font-normal text-subtle text-sm leading-5'>
      {label}
    </span>
    <span className='font-inter font-medium text-ink text-base leading-6'>
      {value}
    </span>
  </div>
));
DetailRow.displayName = 'DetailRow';

const MortgageCalculator = memo(() => {
  const [downPct, setDownPct] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');

  const downNum = parseFloat(downPct) || DEFAULTS.downPct;
  const rateNum = parseFloat(interestRate) || DEFAULTS.interestRate;
  const termNum = parseInt(loanTerm, 10) || DEFAULTS.loanTerm;

  const result = useMemo(
    () => calcMortgage(PROPERTY.price, downNum, rateNum, termNum),
    [downNum, rateNum, termNum],
  );

  const handleDownPct = useCallback((e) => setDownPct(e.target.value), []);
  const handleRate = useCallback((e) => setInterestRate(e.target.value), []);
  const handleTerm = useCallback((e) => setLoanTerm(e.target.value), []);

  const downVal = parseFloat(downPct);
  const rateVal = parseFloat(interestRate);
  const termVal = parseInt(loanTerm, 10);

  const downWarn =
    !isNaN(downVal) && downVal < 20 ? 'Minimum down payment is 20%' : null;
  const rateWarn =
    !isNaN(rateVal) && rateVal < 6.5 ? 'Minimum interest rate is 6.5%' : null;
  const termWarn =
    !isNaN(termVal) && termVal < 3 ? 'Minimum loan term is 3 years' : null;

  const inputCls = (warn) =>
    `bg-surface-input rounded-lg h-9 px-3 text-ink font-inter text-sm focus:outline-none transition-colors placeholder-gray-400 border ${warn ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-orange-500'}`;

  return (
    <div className='bg-white border border-black/10 rounded-2xl overflow-hidden'>
      <div className='flex items-center gap-2 px-6 pt-6 pb-4 border-b border-black/10'>
        <Calculator
          size={20}
          className='text-slate-600 shrink-0'
          aria-hidden='true'
        />
        <span className='font-inter font-medium text-ink text-base leading-4'>
          Mortgage Calculator
        </span>
      </div>
      <div className='flex flex-col gap-5 px-6 py-5'>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='mc-down-pct'
            className='font-inter font-medium text-ink text-sm'
          >
            Down Payment: 20%
          </label>
          <input
            id='mc-down-pct'
            type='text'
            inputMode='decimal'
            value={downPct}
            onChange={handleDownPct}
            placeholder='20'
            className={inputCls(downWarn)}
          />
          {downWarn ? (
            <p className='flex items-center gap-1 text-xs font-inter text-red-500 font-medium'>
              <span aria-hidden='true'>?</span> {downWarn}
            </p>
          ) : (
            <span className='font-inter font-normal text-subtle text-sm'>
              ${result.downPayment.toLocaleString()}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='mc-rate'
            className='font-inter font-medium text-ink text-sm'
          >
            Interest Rate: 6.5%
          </label>
          <input
            id='mc-rate'
            type='text'
            inputMode='decimal'
            value={interestRate}
            onChange={handleRate}
            placeholder='6.5'
            className={inputCls(rateWarn)}
          />
          {rateWarn && (
            <p className='flex items-center gap-1 text-xs font-inter text-red-500 font-medium'>
              <span aria-hidden='true'>?</span> {rateWarn}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='mc-term'
            className='font-inter font-medium text-ink text-sm'
          >
            Loan Term: 3 years
          </label>
          <input
            id='mc-term'
            type='text'
            inputMode='numeric'
            value={loanTerm}
            onChange={handleTerm}
            placeholder='3'
            className={inputCls(termWarn)}
          />
          {termWarn && (
            <p className='flex items-center gap-1 text-xs font-inter text-red-500 font-medium'>
              <span aria-hidden='true'>?</span> {termWarn}
            </p>
          )}
        </div>
        <div className='border-t border-black/10' />
        <div className='flex flex-col gap-2'>
          {[
            {
              label: 'Principal & Interest',
              value: result.principalAndInterest,
            },
            { label: 'Property Tax', value: result.propertyTax },
            { label: 'Home Insurance', value: result.homeInsurance },
          ].map(({ label, value }) => (
            <div key={label} className='flex items-center justify-between'>
              <span className='font-inter font-normal text-subtle text-sm'>
                {label}
              </span>
              <span className='font-inter font-medium text-ink text-sm'>
                ${value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className='border-t border-black/10' />
          <div className='flex items-center justify-between pt-2'>
            <span className='font-inter font-semibold text-ink text-lg leading-7'>
              Total Monthly
            </span>
            <span className='font-inter font-bold text-ink text-lg leading-7'>
              ${result.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
MortgageCalculator.displayName = 'MortgageCalculator';

const INITIAL_CONTACT_FORM = { name: '', email: '', phone: '', message: '' };

const ContactAgentForm = memo(() => {
  const [form, setForm] = useState(INITIAL_CONTACT_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const validate = useCallback(() => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.phone.trim()) next.phone = 'Phone is required.';
    if (!form.message.trim()) next.message = 'Message is required.';
    return next;
  }, [form]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const next = validate();
      if (Object.keys(next).length > 0) {
        setErrors(next);
        return;
      }
      setSubmitted(true);
      setForm(INITIAL_CONTACT_FORM);
      setErrors({});
    },
    [validate],
  );

  const baseInputCls =
    'bg-surface-input border border-transparent rounded-lg h-9 px-3 text-sm text-ink font-inter placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors';

  return (
    <div className='bg-white border border-black/10 rounded-2xl overflow-hidden'>
      <div className='px-6 pt-6 pb-4'>
        <span className='font-inter font-medium text-ink text-base leading-4'>
          Contact Agent
        </span>
      </div>
      <div className='flex flex-col gap-4 px-6 pb-6'>
        <div className='flex items-center gap-3 pb-4 border-b border-black/10'>
          <div className='bg-blue-100 rounded-full size-12 flex items-center justify-center shrink-0'>
            <UserRound size={24} className='text-blue-700' aria-hidden='true' />
          </div>
          <div className='flex flex-col'>
            <span className='font-inter font-semibold text-ink text-base leading-6'>
              {AGENT.name}
            </span>
            <span className='font-inter font-normal text-subtle text-sm leading-5'>
              {AGENT.label}
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-2 pb-4 border-b border-black/10'>
          <a
            href={`tel:${AGENT.phone}`}
            className='flex items-center gap-1.5 text-link-blue text-base font-inter hover:underline focus-visible:underline'
          >
            <Phone size={16} className='shrink-0' aria-hidden='true' />{' '}
            {AGENT.phone}
          </a>
          <a
            href={`mailto:${AGENT.email}`}
            className='flex items-center gap-1.5 text-link-blue text-base font-inter hover:underline focus-visible:underline'
          >
            <Mail size={16} className='shrink-0' aria-hidden='true' />{' '}
            {AGENT.email}
          </a>
        </div>
        {submitted ? (
          <p
            role='status'
            className='text-green-600 text-sm font-inter text-center py-4'
          >
            Thank you! Your message has been sent.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex flex-col gap-3'
          >
            {[
              {
                id: 'ca-name',
                name: 'name',
                label: 'Name',
                type: 'text',
                placeholder: 'Enter your full name',
                autoComplete: 'name',
              },
              {
                id: 'ca-email',
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Enter your email address',
                autoComplete: 'email',
              },
              {
                id: 'ca-phone',
                name: 'phone',
                label: 'Phone',
                type: 'tel',
                placeholder: 'Enter your phone number',
                autoComplete: 'tel',
              },
            ].map(({ id, name, label, type, placeholder, autoComplete }) => (
              <div key={id} className='flex flex-col gap-1.5'>
                <label
                  htmlFor={id}
                  className='font-inter font-medium text-ink text-sm'
                >
                  {label}
                </label>
                <input
                  id={id}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  aria-invalid={!!errors[name]}
                  aria-describedby={errors[name] ? `${id}-err` : undefined}
                  className={baseInputCls}
                />
                {errors[name] && (
                  <span
                    id={`${id}-err`}
                    role='alert'
                    className='text-xs text-red-600 font-inter'
                  >
                    {errors[name]}
                  </span>
                )}
              </div>
            ))}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='ca-message'
                className='font-inter font-medium text-ink text-sm'
              >
                Message
              </label>
              <textarea
                id='ca-message'
                name='message'
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder='Write your message here'
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'ca-message-err' : undefined}
                className='bg-surface-input border border-transparent rounded-lg px-3 py-2 text-sm text-ink font-inter placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none'
              />
              {errors.message && (
                <span
                  id='ca-message-err'
                  role='alert'
                  className='text-xs text-red-600 font-inter'
                >
                  {errors.message}
                </span>
              )}
            </div>
            <AnimatedButton
              type='submit'
              className='w-full bg-secondary hover:bg-orange-600 text-white font-inter font-medium text-sm leading-5 h-9 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500'
            >
              Send Message
            </AnimatedButton>
          </form>
        )}
      </div>
    </div>
  );
});
ContactAgentForm.displayName = 'ContactAgentForm';

const ListingDetailsCard = memo(() => (
  <div className='bg-white border border-black/10 rounded-2xl overflow-hidden'>
    <div className='flex items-center gap-2 px-6 pt-6 pb-4 border-b border-black/10'>
      <FileText
        size={20}
        className='text-slate-600 shrink-0'
        aria-hidden='true'
      />
      <span className='font-inter font-medium text-ink text-base leading-4'>
        Listing Details
      </span>
    </div>
    <div className='flex flex-col gap-2 px-6 py-5'>
      {[
        { label: 'Listed Date', value: LISTING.listedDate },
        { label: 'Days on Market', value: LISTING.daysOnMarket },
        { label: 'Price per sqft', value: LISTING.pricePerSqft },
      ].map(({ label, value }) => (
        <div key={label} className='flex items-center justify-between'>
          <span className='font-inter font-normal text-subtle text-sm'>
            {label}
          </span>
          <span className='font-inter font-medium text-ink text-sm'>
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
));
ListingDetailsCard.displayName = 'ListingDetailsCard';

const RenovationDetailsSection = memo(() => (
  <>
    <section className='pt-2 pb-6 lg:pb-8 bg-white'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
        <div className='flex flex-col lg:flex-row gap-8 xl:gap-10 items-start'>
          {/* Left column */}
          <div className='flex-1 min-w-0 flex flex-col gap-6 lg:sticky lg:top-24 self-start'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-start justify-between gap-4 flex-wrap'>
                <h1 className='font-inter font-bold text-ink text-[30px] leading-9'>
                  {PROPERTY.title}
                </h1>
                <span
                  className='inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium font-inter shrink-0 mt-1'
                  style={{ backgroundColor: '#dcfce7', color: '#016630' }}
                >
                  {PROPERTY.badge}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin
                  size={16}
                  className='text-slate-500 shrink-0'
                  aria-hidden='true'
                />
                <span className='font-inter font-normal text-subtle text-base leading-6'>
                  {PROPERTY.address}
                </span>
              </div>
              <p className='font-inter font-bold text-ink-darkest text-4xl leading-10'>
                {PROPERTY.priceDisplay}
              </p>
            </div>
            <div className='flex gap-3 flex-wrap sm:flex-nowrap'>
              <FeatureCard
                icon={<BedDouble size={24} />}
                value={String(PROPERTY.beds)}
                label='Bedrooms'
              />
              <FeatureCard
                icon={<Bath size={24} />}
                value={String(PROPERTY.Bathrooms)}
                label='Bathrooms'
              />
              <FeatureCard
                icon={<Maximize2 size={24} />}
                value={PROPERTY.sqft}
                label='sqft'
              />
              <FeatureCard
                icon={<CalendarDays size={24} />}
                value={PROPERTY.yearBuilt}
                label='Year Built'
              />
            </div>
            <div className='bg-white border border-black/10 rounded-2xl p-6 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <h3 className='font-inter font-semibold text-ink text-lg leading-7'>
                  Description
                </h3>
                <p className='font-inter font-normal text-dim text-base leading-6'>
                  {PROPERTY.description}
                </p>
              </div>
              <div className='border-t border-black/10' />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                <DetailRow
                  label='Property Type'
                  value={PROPERTY.propertyType}
                />
                <DetailRow label='Lot Size' value={PROPERTY.lotSize} />
                <DetailRow label='Heating' value={PROPERTY.heating} />
                <DetailRow label='Cooling' value={PROPERTY.cooling} />
                <DetailRow label='Parking' value={PROPERTY.parking} />
                <DetailRow
                  label='Days on Market'
                  value={PROPERTY.daysOnMarket}
                />
              </div>
            </div>
          </div>
          {/* Right sidebar */}
          <aside className='w-full lg:w-90 xl:w-100 shrink-0 flex flex-col gap-6'>
            <MortgageCalculator />
            <ContactAgentForm />
            <ListingDetailsCard />
          </aside>
        </div>
      </div>
    </section>
    <PropertiesCTA />
  </>
));

RenovationDetailsSection.displayName = 'RenovationDetailsSection';

export default RenovationDetailsSection;
