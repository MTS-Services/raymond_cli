import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  const visiblePages = [1, 2, 3].filter((p) => p <= totalPages);

  return (
    <nav
      aria-label='Pagination'
      className='flex gap-2 items-center justify-center flex-wrap'
    >
      <button
        type='button'
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        aria-label='Previous page'
        disabled={currentPage === 1}
        className='bg-white border border-slate-200 rounded-lg flex items-center justify-center size-10 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
      >
        <ChevronLeft size={14} className='text-slate-600' aria-hidden='true' />
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          type='button'
          onClick={() => onPageChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
          className={
            p === currentPage
              ? 'bg-orange-500 rounded-lg flex items-center justify-center size-10 text-white font-bold text-base font-inter cursor-pointer'
              : 'bg-white border border-slate-200 rounded-lg flex items-center justify-center size-10 text-slate-900 text-base font-inter hover:bg-gray-50 transition-colors cursor-pointer'
          }
        >
          {p}
        </button>
      ))}

      {totalPages > 4 && (
        <span
          className='px-2 text-slate-900 text-base font-inter'
          aria-hidden='true'
        >
          ...
        </span>
      )}

      {totalPages > 3 && (
        <button
          type='button'
          onClick={() => onPageChange(totalPages)}
          aria-label={`Page ${totalPages}`}
          aria-current={currentPage === totalPages ? 'page' : undefined}
          className={
            currentPage === totalPages
              ? 'bg-orange-500 rounded-lg flex items-center justify-center size-10 text-white font-bold text-base font-inter cursor-pointer'
              : 'bg-white border border-slate-200 rounded-lg flex items-center justify-center size-10 text-slate-900 text-base font-inter hover:bg-gray-50 transition-colors cursor-pointer'
          }
        >
          {totalPages}
        </button>
      )}

      <button
        type='button'
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        aria-label='Next page'
        disabled={currentPage === totalPages}
        className='bg-white border border-slate-200 rounded-lg flex items-center justify-center size-10 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
      >
        <ChevronRight size={14} className='text-slate-600' aria-hidden='true' />
      </button>
    </nav>
  );
});
Pagination.displayName = 'Pagination';

export default Pagination;
