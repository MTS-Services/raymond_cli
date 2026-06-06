import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import Pagination from '../../components/shared/Pagination';
import { ROUTES } from '../../config';

const PAGE_SIZE = 6;

const normalizePortfolio = (portfolio) => ({
  id: portfolio.id,
  title: portfolio.title,
  shortDescription: portfolio.description,
  location: portfolio.location,
  type: portfolio.propertyType,
  area: portfolio.area,
  duration: portfolio.duration,
  budget: portfolio.budget,
  image: portfolio.gallery?.[0]?.url || '',
  gallery: portfolio.gallery ?? [],
});

const PortfolioCard = ({ item, onEdit, onDelete }) => (
  <article className='bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow'>
    <div className='h-44 overflow-hidden'>
      <img
        src={item.image}
        alt={item.title}
        className='w-full h-full object-cover'
        loading='lazy'
      />
    </div>
    <div className='p-4 flex flex-col gap-3 flex-1'>
      <div>
        <h3 className='font-serif text-lg font-bold text-gray-900 leading-snug'>
          {item.title}
        </h3>
        <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
          {item.shortDescription}
        </p>
      </div>
      <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
        <div>
          <span className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            Location
          </span>
          <p className='text-gray-700 font-medium mt-0.5'>{item.location}</p>
        </div>
        <div>
          <span className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            Type
          </span>
          <p className='text-gray-700 font-medium mt-0.5'>{item.type}</p>
        </div>
        <div>
          <span className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            Area
          </span>
          <p className='text-gray-700 font-medium mt-0.5'>{item.area}</p>
        </div>
        <div>
          <span className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            Budget
          </span>
          <p className='text-gray-700 font-medium mt-0.5'>{item.budget}</p>
        </div>
        <div className='col-span-2'>
          <span className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            Duration
          </span>
          <p className='text-gray-700 font-medium mt-0.5'>{item.duration}</p>
        </div>
      </div>
      <div className='flex gap-2 mt-auto pt-1'>
        <button
          type='button'
          onClick={() => onEdit(item.id)}
          className='flex-1 bg-navy text-white text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 hover:bg-navy-hover transition-colors cursor-pointer'
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type='button'
          onClick={() => onDelete(item.id)}
          className='flex-1 bg-red-50 text-red-600 text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 hover:bg-red-100 transition-colors cursor-pointer'
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </article>
);

const AdminPortfolio = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(API_ENDPOINTS.PORTFOLIOS.LIST, {
      params: { page, limit: PAGE_SIZE },
    });

    if (error) {
      toast.error(error.message || 'Failed to load portfolios.');
      setItems([]);
      setTotalPages(1);
    } else {
      const payload = data?.data ?? data ?? {};
      const portfolios = Array.isArray(payload?.portfolios)
        ? payload.portfolios
        : [];
      setItems(portfolios.map(normalizePortfolio));
      setTotalPages(payload?.pagination?.totalPages ?? 1);
    }

    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleEdit = (id) =>
    navigate(ROUTES.ADMIN_EDIT_PORTFOLIO.replace(':id', id));

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete portfolio?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      const { error } = await httpMethods.delete(
        API_ENDPOINTS.PORTFOLIOS.DELETE(id),
      );

      if (error) {
        toast.error(error.message || 'Failed to delete portfolio.');
        return;
      }

      toast.success('Portfolio deleted successfully.');
      fetchPortfolios();
    },
    [fetchPortfolios],
  );

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Portfolio
          </h1>
          <p className='text-gray-500 text-base mt-1'>
            Manage and showcase your completed property transformations.
          </p>
        </div>
        <button
          type='button'
          onClick={() => navigate(ROUTES.ADMIN_ADD_PORTFOLIO)}
          className='bg-orange-500 text-white text-sm sm:text-base font-semibold px-5 py-2.5 rounded-md hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto'
        >
          <Plus size={16} /> Add New Portfolio
        </button>
      </div>
      {loading ? (
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500'>
          Loading portfolios...
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <div className='pt-2'>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AdminPortfolio;
