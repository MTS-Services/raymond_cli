import React from 'react';
import { DollarSign, Plus, Search } from 'lucide-react';

const Pricing = () => (
  <div className='space-y-6'>
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Pricing</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Manage your pricing plans and tiers.
        </p>
      </div>
      <button
        type='button'
        className='flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20 cursor-pointer'
      >
        <Plus size={16} aria-hidden='true' />
        Add Plan
      </button>
    </div>

    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
      <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100'>
        <Search
          size={16}
          className='text-gray-400 shrink-0'
          aria-hidden='true'
        />
        <input
          type='search'
          placeholder='Search plans...'
          className='flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
        />
      </div>
      <div className='flex flex-col items-center justify-center py-20 gap-3 text-gray-400'>
        <DollarSign size={36} className='text-gray-200' aria-hidden='true' />
        <p className='text-sm'>
          No pricing plans yet. Connect your backend to load data.
        </p>
      </div>
    </div>
  </div>
);

export default Pricing;
