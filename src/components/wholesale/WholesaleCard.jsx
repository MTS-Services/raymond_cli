import React, { memo } from 'react';

const WholesaleCard = memo(
  ({
    image,
    name,
    address,
    beds,
    Bathrooms,
    area,
    purchasePrice = '$850k',
    renovationCost = '$50k',
    arv = '$1.1m',
    savePct = 15,
    showBadge = true,
  }) => (
    <article className='bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow'>
      {/* Image */}
      <div className='relative h-44 overflow-hidden'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover'
          loading='lazy'
        />
        {showBadge && (
          <span
            className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-12 h-12 flex flex-col items-center justify-center leading-tight select-none pointer-events-none'
            aria-label={`Save ${savePct}%`}
          >
            <span>Save</span>
            <span>{savePct}%</span>
          </span>
        )}
      </div>

      {/* Card body */}
      <div className='p-4 flex flex-col gap-2 flex-1'>
        <h3 className='font-serif text-lg sm:text-xl font-bold text-gray-900 leading-snug'>
          {name}
        </h3>
        <p className='text-sm text-gray-400 truncate'>{address}</p>

        {/* Facility chips */}
        <div className='flex items-center gap-2 flex-wrap mt-0.5'>
          <span className='inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md'>
            {beds} Beds
          </span>
          <span className='inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-xs font-medium px-2 py-1 rounded-md'>
            {Bathrooms} Bathrooms
          </span>
          <span className='inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md'>
            {area}
          </span>
        </div>

        {/* Investment details table */}
        <div className='mt-1 rounded-lg bg-gray-50 border border-gray-100 divide-y divide-gray-100'>
          <div className='flex items-center justify-between px-3 py-1.5'>
            <span className='text-sm text-gray-900'>Purchase price</span>
            <span className='text-sm font-semibold text-gray-900'>
              {purchasePrice}
            </span>
          </div>
          <div className='flex items-center justify-between px-3 py-1.5'>
            <span className='text-sm text-gray-900'>Est. renovation</span>
            <span className='text-sm font-semibold text-gray-900'>
              {renovationCost}
            </span>
          </div>
          <div className='flex items-center justify-between px-3 py-1.5'>
            <span className='text-sm text-gray-900'>ARV</span>
            <span className='text-sm font-semibold text-orange-600'>{arv}</span>
          </div>
        </div>
      </div>
    </article>
  ),
);
WholesaleCard.displayName = 'WholesaleCard';

export default WholesaleCard;
