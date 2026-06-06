import React from 'react';
import { Store, Search } from 'lucide-react';

const COLUMNS = [
  'Order ID',
  'Marketplace',
  'Customer',
  'Date',
  'Total',
  'Status',
];

const MarketplaceOrders = () => (
  <div className='space-y-6'>
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Marketplace Orders</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Orders received from marketplace channels.
        </p>
      </div>
    </div>

    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      <div className='flex items-center gap-3 px-5 py-4 border-b border-gray-100'>
        <Search
          size={16}
          className='text-gray-400 shrink-0'
          aria-hidden='true'
        />
        <input
          type='search'
          placeholder='Search marketplace orders...'
          className='flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length} className='px-5 py-20 text-center'>
                <div className='flex flex-col items-center gap-3 text-gray-400'>
                  <Store
                    size={36}
                    className='text-gray-200'
                    aria-hidden='true'
                  />
                  <p>
                    No marketplace orders yet. Connect your backend to load
                    data.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default MarketplaceOrders;
