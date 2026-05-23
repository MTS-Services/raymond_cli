import React, { memo, useState, useCallback } from 'react';
import {
  calcPMT,
  fmtUSD,
  InputField,
  ResultCard,
  calcInputClass,
} from './MortgageCalcSection';
import {
  CALCULATOR_TYPES,
  saveMortgageApplicationDraft,
  setActiveCalculator,
} from './mortgageApplicationStorage';

const INITIAL_REFINANCE = {
  loanAmount: 800000,
  homeValue: 1000000,
  fico: 740,
  interestRate: 6.5,
  loanTerm: 30,
};

const RefinanceCalcSection = memo(() => {
  const [form, setForm] = useState(INITIAL_REFINANCE);

  const persistDraft = useCallback(
    (nextForm) => {
      const principalInterest = calcPMT(nextForm.loanAmount, nextForm.interestRate, nextForm.loanTerm);
      const propertyTax = (nextForm.homeValue * 0.01) / 12;
      const homeInsurance = 150;
      const hoa = 0;
      const monthlyPayment = principalInterest + propertyTax + homeInsurance + hoa;

      saveMortgageApplicationDraft({
        calculatorType: CALCULATOR_TYPES.REFINANCE,
        calculatorData: {
          refinanceLoanAmount: nextForm.loanAmount,
          refinanceHomeValue: nextForm.homeValue,
          refinanceInterestRate: nextForm.interestRate,
          refinanceFico: nextForm.fico,
          refinanceLoanTerm: nextForm.loanTerm,
          refinanceEstMonthly: Number(monthlyPayment.toFixed(2)),
          refinancePrincipalInterest: Number(principalInterest.toFixed(2)),
          refinancePropertyTax: Number(propertyTax.toFixed(2)),
          refinanceHomeInsurance: homeInsurance,
          refinanceHoa: hoa,
        },
      });
    },
    [],
  );

  const handleFieldChange = useCallback(
    (field) => (e) => {
      const nextValue = parseFloat(e.target.value) || 0;
      setForm((prev) => {
        const nextForm = { ...prev, [field]: nextValue };
        persistDraft(nextForm);
        return nextForm;
      });
    },
    [persistDraft],
  );

  React.useEffect(() => {
    persistDraft(INITIAL_REFINANCE);
  }, [persistDraft]);

  const handleApply = useCallback(() => {
    persistDraft(form);
    setActiveCalculator(CALCULATOR_TYPES.REFINANCE);
  }, [form, persistDraft]);

  const pi = calcPMT(form.loanAmount, form.interestRate, form.loanTerm);
  const tax = (form.homeValue * 0.01) / 12;
  const insurance = 150;
  const hoa = 0;
  const total = pi + tax + insurance + hoa;

  return (
    <section className='py-14 lg:py-20 bg-surface-warm'>
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
        <div className='text-center mb-8 lg:mb-12'>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-soft mb-3'>
            Refinance Calculator
          </h2>
          <p className='text-subtle text-base'>
            Estimate your monthly payment in seconds
          </p>
        </div>

        <div className='bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8'>
          <div className='flex-1 flex flex-col gap-6'>
            <InputField label='Loan Amount' id='rc-loan'>
              <input
                id='rc-loan'
                type='number'
                min='0'
                step='1000'
                value={form.loanAmount || ''}
                onChange={handleFieldChange('loanAmount')}
                placeholder='$800,000'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='Estimated Home Value' id='rc-home'>
              <input
                id='rc-home'
                type='number'
                min='0'
                step='1000'
                value={form.homeValue || ''}
                onChange={handleFieldChange('homeValue')}
                placeholder='$1,000,000'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='FICO (Credit Score)' id='rc-fico'>
              <input
                id='rc-fico'
                type='number'
                min='300'
                max='850'
                step='1'
                value={form.fico || ''}
                onChange={handleFieldChange('fico')}
                placeholder='740'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='Interest Rate (%)' id='rc-rate'>
              <input
                id='rc-rate'
                type='number'
                min='0'
                max='30'
                step='0.1'
                value={form.interestRate || ''}
                onChange={handleFieldChange('interestRate')}
                placeholder='6.5'
                className={calcInputClass}
              />
            </InputField>
            <InputField label='Loan Term (Years)' id='rc-term'>
              <input
                id='rc-term'
                type='number'
                min='1'
                max='30'
                step='1'
                value={form.loanTerm || ''}
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
            hoa={hoa}
            onApply={handleApply}
          />
        </div>
      </div>
    </section>
  );
});

RefinanceCalcSection.displayName = 'RefinanceCalcSection';

export default RefinanceCalcSection;
