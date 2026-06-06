import React, { memo, useState, useCallback } from 'react';
import {
  CALCULATOR_TYPES,
  saveMortgageApplicationDraft,
  setActiveCalculator,
} from './mortgageApplicationStorage';

// ---------------------------------------------------------------------------
// Math utilities (exported for reuse in RefinanceCalcSection)
// ---------------------------------------------------------------------------
export function calcPMT(principal, annualRatePct, termYears) {
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  if (!principal || principal <= 0 || !n) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function fmtUSD(n) {
  if (!isFinite(n) || isNaN(n) || n < 0) return '$0.00';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// Shared sub-components (exported for reuse in RefinanceCalcSection)
// ---------------------------------------------------------------------------
export const DonutChart = memo(({ items }) => {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total <= 0) return null;
  const cx = 50,
    cy = 50,
    r = 35,
    sw = 13;
  const C = 2 * Math.PI * r;
  let cumulative = 0;
  const arcs = items.map((item) => {
    const len = (item.value / total) * C;
    const offset = C - cumulative;
    cumulative += len;
    return { ...item, len, offset };
  });
  return (
    <svg viewBox='0 0 100 100' className='w-32 h-32 -rotate-90 mx-auto my-2'>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill='none'
        stroke='#e5e7eb'
        strokeWidth={sw}
      />
      {arcs.map((a, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke={a.color}
          strokeWidth={sw}
          strokeDasharray={`${a.len} ${C - a.len}`}
          strokeDashoffset={a.offset}
        />
      ))}
    </svg>
  );
});
DonutChart.displayName = 'DonutChart';

export const InputField = memo(({ label, required, id, children, error }) => (
  <div className='flex flex-col gap-2'>
    <label htmlFor={id} className='text-sm font-medium text-ink-soft'>
      {label}
      {required && <span className='text-orange-500 ml-0.5'>*</span>}
    </label>
    {children}
    {error && <p className='text-xs text-red-500 mt-0.5'>{error}</p>}
  </div>
));
InputField.displayName = 'InputField';

export const calcInputClass =
  'w-full border border-gray-200 rounded-[10px] px-4 py-2.5 text-base text-ink focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all';

export const ResultCard = memo(
  ({ total, principalInterest, propertyTax, homeInsurance, hoa, onApply }) => {
    const items = [
      { value: principalInterest, color: '#1e3a8a' },
      { value: propertyTax, color: '#f97316' },
      { value: homeInsurance, color: '#10b981' },
      ...(hoa != null ? [{ value: hoa, color: '#8b5cf6' }] : []),
    ];
    const rows = [
      {
        label: 'Principal & Interest',
        value: fmtUSD(principalInterest),
        color: '#1e3a8a',
      },
      { label: 'Property Tax', value: fmtUSD(propertyTax), color: '#f97316' },
      {
        label: 'Home Owner Insurance',
        value: fmtUSD(homeInsurance),
        color: '#10b981',
      },
      ...(hoa != null
        ? [{ label: 'HOA', value: fmtUSD(hoa), color: '#8b5cf6' }]
        : []),
    ];
    return (
      <div
        className='flex-1 rounded-2xl p-6 flex flex-col gap-4'
        style={{
          background:
            'linear-gradient(139deg, rgb(239,246,255) 0%, rgb(250,245,255) 100%)',
        }}
      >
        <p className='text-subtle text-sm'>Estimated Monthly Payment</p>
        <p className='font-bold text-ink-soft leading-none'>
          <span className='text-3xl sm:text-4xl lg:text-5xl'>
            {fmtUSD(total).replace(/\.00$/, '')}
          </span>
          <span className='text-xl sm:text-2xl'>/mo</span>
        </p>
        <div className='flex flex-col gap-3 mt-1'>
          {rows.map(({ label, value }) => (
            <div key={label} className='flex items-center justify-between'>
              <span className='text-sm text-dim'>{label}</span>
              <span className='text-sm font-semibold text-ink-soft'>
                {value}
              </span>
            </div>
          ))}
        </div>
        <DonutChart items={items} />
        <a
          href='#apply-form'
          onClick={(e) => {
            e.preventDefault();
            onApply?.();
            document
              .getElementById('apply-form')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          className='block w-full bg-orange-500 hover:bg-orange-600 text-white text-base font-medium text-center py-3 rounded-lg shadow-md transition-colors duration-150 cursor-pointer'
        >
          Apply for This Loan
        </a>
      </div>
    );
  },
);
ResultCard.displayName = 'ResultCard';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const INITIAL_MORTGAGE = {
  purchaseAmount: '',
  downPayment: '',
  interestRate: '',
  loanTerm: '',
};

// ---------------------------------------------------------------------------
// MortgageCalcSection
// ---------------------------------------------------------------------------
const MortgageCalcSection = memo(() => {
  const [form, setForm] = useState(INITIAL_MORTGAGE);
  const set = useCallback(
    (field) => (e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      })),
    [],
  );

  const persistDraft = useCallback(
    (nextForm) => {
      const loanAmount = Math.max(0, nextForm.purchaseAmount - nextForm.downPayment);
      const principalInterest = calcPMT(loanAmount, nextForm.interestRate, nextForm.loanTerm);
      const propertyTax = (nextForm.purchaseAmount * 0.01) / 12;
      const homeInsurance = 150;
      const monthlyPayment = principalInterest + propertyTax + homeInsurance;

      saveMortgageApplicationDraft({
        calculatorType: CALCULATOR_TYPES.MORTGAGE,
        calculatorData: {
          mortgagePurchaseAmount: nextForm.purchaseAmount,
          mortgageDownPayment: nextForm.downPayment,
          mortgageInterestRate: nextForm.interestRate,
          mortgageLoanTerm: nextForm.loanTerm,
          mortgageEstMonthly: Number(monthlyPayment.toFixed(2)),
          mortgagePrincipalInterest: Number(principalInterest.toFixed(2)),
          mortgagePropertyTax: Number(propertyTax.toFixed(2)),
          mortgageHomeInsurance: homeInsurance,
        },
      });
    },
    [],
  );

  const handleFieldChange = useCallback(
    (field) => (e) => {
      const nextValue = e.target.value;
      setForm((prev) => {
        const nextForm = { ...prev, [field]: nextValue };
        persistDraft(nextForm);
        return nextForm;
      });
    },
    [persistDraft],
  );

  const handleApply = useCallback(() => {
    persistDraft(form);
    setActiveCalculator(CALCULATOR_TYPES.MORTGAGE);
  }, [form, persistDraft]);

  const purchaseAmount = Number(form.purchaseAmount) || 0;
  const downPayment = Number(form.downPayment) || 0;
  const interestRate = Number(form.interestRate) || 0;
  const loanTerm = Number(form.loanTerm) || 0;
  const loanAmount = Math.max(0, purchaseAmount - downPayment);
  const pi = calcPMT(loanAmount, interestRate, loanTerm);
  const tax = (purchaseAmount * 0.01) / 12;
  const insurance = 150;
  const total = pi + tax + insurance;

  return (
    <section id='mortgage-calc' className='py-14 lg:py-20  bg-white'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
        <div className='text-center mb-8 lg:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-soft mb-3'>
            Mortgage Calculator
          </h2>
          <p className='text-subtle text-base'>
            Estimate your monthly payment in seconds
          </p>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8'>
          <div className='flex-1 flex flex-col gap-6'>
            <InputField label='Purchase Amount' id='mc-purchase'>
              <input
                id='mc-purchase'
                type='number'
                min='0'
                step='1000'
                value={form.purchaseAmount}
                onChange={handleFieldChange('purchaseAmount')}
                placeholder='$800,000'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='Down Payment' id='mc-down'>
              <input
                id='mc-down'
                type='number'
                min='0'
                step='1000'
                value={form.downPayment}
                onChange={handleFieldChange('downPayment')}
                placeholder='$160,000'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='Interest Rate (%)' id='mc-rate'>
              <input
                id='mc-rate'
                type='number'
                min='0'
                max='30'
                step='0.1'
                value={form.interestRate}
                onChange={handleFieldChange('interestRate')}
                placeholder='6.5'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='Loan Term (Years)' id='mc-term'>
              <input
                id='mc-term'
                type='number'
                min='1'
                max='30'
                step='1'
                value={form.loanTerm}
                onChange={handleFieldChange('loanTerm')}
                placeholder='e.g. 30'
                className={calcInputClass}
              />
            </InputField>
          </div>
          <ResultCard
            total={total}
            principalInterest={pi}
            propertyTax={tax}
            homeInsurance={insurance}
            onApply={handleApply}
          />
        </div>
      </div>
    </section>
  );
});

MortgageCalcSection.displayName = 'MortgageCalcSection';

export default MortgageCalcSection;
