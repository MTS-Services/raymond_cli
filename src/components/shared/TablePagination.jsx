import { memo } from 'react';
import AnimatedButton from './AnimatedButton';

const TablePagination = memo(
  ({ currentPage, totalPages, startItem, endItem, total, onPrev, onNext }) => (
    <div className='px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-3'>
      <p className='text-sm text-orange-500 text-center sm:text-left'>
        Showing <span className='font-semibold'>{startItem}</span> to{' '}
        <span className='font-semibold'>{endItem}</span> of{' '}
        <span className='font-semibold'>{total}</span> results
      </p>
      <div className='flex items-center gap-2'>
        <AnimatedButton
          onClick={onPrev}
          disabled={currentPage === 1}
          className='px-3 sm:px-4 py-2 text-sm font-medium border border-orange-300 rounded-lg text-orange-500 bg-white hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer'
        >
          Previous
        </AnimatedButton>
        <span className='text-sm text-gray-500 font-medium px-1 min-w-12 text-center'>
          {currentPage} / {totalPages}
        </span>
        <AnimatedButton
          onClick={onNext}
          disabled={currentPage === totalPages}
          className='px-3 sm:px-4 py-2 text-sm font-medium border border-orange-300 rounded-lg text-orange-500 bg-white hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer'
        >
          Next
        </AnimatedButton>
      </div>
    </div>
  ),
);

TablePagination.displayName = 'TablePagination';
export default TablePagination;
