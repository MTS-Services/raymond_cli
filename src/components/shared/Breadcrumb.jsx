import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable admin breadcrumb.
 *
 * Props:
 *   items  {Array<{ label: string, to?: string }>} -- ordered trail.
 *                                                    Last item is current page (no link).
 *   onBack {function?} -- optional custom back handler. Defaults to history back.
 */
const Breadcrumb = memo(({ items = [], onBack }) => {
  const navigate = useNavigate();

  if (!items.length) return null;

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  return (
    <nav
      aria-label='Breadcrumb'
      className='flex items-center gap-2 text-sm text-gray-500 mb-3'
    >
      <button
        type='button'
        onClick={handleBack}
        aria-label='Go back'
        className='flex items-center justify-center text-orange-500 hover:text-orange-600 transition-colors cursor-pointer'
      >
        <ArrowLeft size={16} aria-hidden='true' />
      </button>
      <ol className='flex items-center gap-2 flex-wrap' role='list'>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={`${item.label}-${idx}`}
              className='flex items-center gap-2'
            >
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className='text-gray-500 hover:text-orange-600 transition-colors'
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  size={14}
                  className='text-gray-400'
                  aria-hidden='true'
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
