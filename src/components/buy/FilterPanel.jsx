import React, { memo } from 'react';
import { Search } from 'lucide-react';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
export const PRICE_RANGES = [
  'All Price',
  'Under $200K',
  '$250K to $500K',
  '$501K to $750K',
  '$751K to $1M',
  '$1M+',
];

export const PROPERTY_TYPES = [
  'All Types',
  'Single Family Home',
  'Townhomes',
  'Land',
  'Commercial'
];

// ---------------------------------------------------------------------------
// RadioButton atom
// ---------------------------------------------------------------------------
const RadioButton = memo(({ label, checked, onChange }) => (
  <div
    role='radio'
    aria-checked={checked}
    tabIndex={0}
    className='flex gap-2 items-center cursor-pointer'
    onClick={() => onChange(label)}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(label)}
  >
    {checked ? (
      <div className='bg-orange-500 rounded-full shrink-0 size-4.5 flex items-center justify-center'>
        <div className='rounded-full size-1.75 bg-white' />
      </div>
    ) : (
      <div className='bg-white border-[0.9px] border-gray-300 rounded-full shrink-0 size-4.5' />
    )}
    <span className='flex-1 font-normal leading-5 text-slate-600 text-sm font-inter'>
      {label}
    </span>
  </div>
));
RadioButton.displayName = 'RadioButton';

// ---------------------------------------------------------------------------
// FilterPanel -- location search + price range + property type
// Shared between desktop sidebar and mobile drawer
// ---------------------------------------------------------------------------
const FilterPanel = memo(
  ({
    locationSearch,
    onLocationChange,
    selectedPriceRange,
    onPriceRangeChange,
    selectedPropertyType,
    onPropertyTypeChange,
  }) => (
    <div className='flex flex-col gap-6'>
      <div>
        <p className='font-semibold text-gray-950 text-base leading-6 font-["Plus_Jakarta_Sans",sans-serif]'>
          Filters
        </p>
      </div>

      <hr className='border-slate-200' />

      {/* Location */}
      <div className='flex flex-col gap-4'>
        <p className='font-semibold text-gray-950 text-base leading-6 font-["Plus_Jakarta_Sans",sans-serif]'>
          Location
        </p>
        <div className='relative'>
          <Search
            className='absolute left-2 top-3 size-4 pointer-events-none text-gray-400'
            aria-hidden='true'
          />
          <input
            type='text'
            value={locationSearch}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder='Search by location'
            aria-label='Search by location'
            className='w-full border border-gray-300 rounded-[3px] h-10 pl-8 pr-3 text-black text-sm font-normal font-["Public_Sans",sans-serif] focus:outline-none focus:border-primary transition-colors'
          />
        </div>
      </div>

      {/* Price Range */}
      <div className='flex flex-col gap-4'>
        <p className='font-semibold text-slate-900 text-base leading-6 font-["Plus_Jakarta_Sans",sans-serif]'>
          Price Range
        </p>
        <div
          role='radiogroup'
          aria-label='Select price range'
          className='flex flex-col gap-3'
        >
          {PRICE_RANGES.map((range) => (
            <RadioButton
              key={range}
              label={range}
              checked={selectedPriceRange === range}
              onChange={onPriceRangeChange}
            />
          ))}
        </div>
      </div>

      <hr className='border-slate-200' />

      {/* Property Type */}
      <div className='flex flex-col gap-3'>
        <p className='font-semibold text-slate-900 text-sm leading-5 font-inter'>
          Property Type
        </p>
        <div
          role='radiogroup'
          aria-label='Select property type'
          className='flex flex-col gap-3'
        >
          {PROPERTY_TYPES.map((type) => (
            <RadioButton
              key={type}
              label={type}
              checked={selectedPropertyType === type}
              onChange={onPropertyTypeChange}
            />
          ))}
        </div>
      </div>
    </div>
  ),
);

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
