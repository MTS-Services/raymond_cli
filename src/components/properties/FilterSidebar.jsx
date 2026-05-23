import React, { memo } from 'react';
import { Search } from 'lucide-react';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const ASSETS = {
  mapImage:
    'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=800&q=80',
};

const PRICE_RANGES = [
  'All Price',
  'Under $20',
  '$25 to $100',
  '$100 to $300',
  '$300 to $500',
  '$500 to $1,000',
  '$1,000 to $10,000',
];

const PROPERTY_TYPES = [
  'Detached',
  'Semi-Detached',
  'Terrace',
  'Flat',
  'Bungalow',
  'Office Space',
  'Land',
  'Warehouse',
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
// FilterSidebar -- location search + map + price range + property type
// ---------------------------------------------------------------------------
const FilterSidebar = memo(
  ({
    locationSearch,
    onLocationChange,
    selectedPriceRange,
    onPriceRangeChange,
    selectedPropertyType,
    onPropertyTypeChange,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
  }) => (
    <aside className='w-full lg:w-109.75 shrink-0 flex flex-col gap-6'>
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
            className='w-full border border-gray-500 rounded-[3px] h-10 pl-8 pr-3 text-gray-500 text-sm font-normal font-["Public_Sans",sans-serif] focus:outline-none focus:border-primary transition-colors'
          />
        </div>
        {/* Map preview */}
        <div className='relative border border-gray-500 rounded-[3px] h-71.25 overflow-hidden'>
          <img
            src={ASSETS.mapImage}
            alt='Map preview of property locations'
            className='absolute inset-0 size-full object-cover pointer-events-none rounded-[3px]'
          />
          <div className='absolute bottom-px right-px w-6 flex flex-col bg-white border border-gray-300 rounded-br-sm overflow-hidden select-none'>
            <div className='flex items-center justify-center h-6 border-b border-gray-300 text-gray-500 text-sm'>
              +
            </div>
            <div className='flex items-center justify-center h-6 border-b border-gray-300 text-gray-500 text-sm'>
              -
            </div>
            <div className='flex items-center justify-center h-6 text-gray-500 text-xs'>
              ⊡
            </div>
          </div>
        </div>
      </div>

      <hr className='border-slate-200' />

      {/* Price Range */}
      <div className='flex flex-col gap-4'>
        <p className='font-semibold text-slate-900 text-base leading-6 font-["Plus_Jakarta_Sans",sans-serif]'>
          Price Range
        </p>
        <input
          type='range'
          min='0'
          max='10000'
          defaultValue='5000'
          aria-label='Price range'
          className='w-full h-3 accent-orange-500 cursor-pointer'
        />
        <div className='flex gap-5'>
          <input
            type='text'
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder='Min price'
            aria-label='Minimum price'
            className='flex-1 border border-slate-200 rounded-[3px] h-10 px-3 text-gray-400 text-sm font-normal font-["Public_Sans",sans-serif] focus:outline-none focus:border-primary transition-colors'
          />
          <input
            type='text'
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder='Max price'
            aria-label='Maximum price'
            className='flex-1 border border-slate-200 rounded-[3px] h-10 px-3 text-gray-400 text-sm font-normal font-["Public_Sans",sans-serif] focus:outline-none focus:border-primary transition-colors'
          />
        </div>
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
    </aside>
  ),
);

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
