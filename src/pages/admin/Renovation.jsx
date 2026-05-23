import { useState, useMemo, useRef, useEffect, memo, useCallback } from 'react';
import { MoreVertical, X, Eye, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import { httpMethods } from '../../services/httpMethods';
import TablePagination from '../../components/shared/TablePagination';


const MOCK_ENTRIES = [
  {
    id: 1,
    name: 'Eleanor Pena',
    email: 'aliza@gmail.com',
    phone: '+880 1712-345678',
    renovationType: 'Full Renovation',
    propertyType: 'Residential Property',
    budget: '$4,500.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 2,
    name: 'Esther Howard',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Partial Renovation',
    propertyType: 'Commercial Property',
    budget: '$2,800.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 3,
    name: 'Annette Black',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Interior Design',
    propertyType: 'Residential Property',
    budget: '$1,200.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 4,
    name: 'Jenny Wilson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Exterior Renovation',
    propertyType: 'Residential Property',
    budget: '$3,100.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 5,
    name: 'Darlene Robertson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Full Renovation',
    propertyType: 'Residential Property',
    budget: '$6,750.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 6,
    name: 'Guy Hawkins',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Bathroom Renovation',
    propertyType: 'Residential Property',
    budget: '$980.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 7,
    name: 'Jerome Bell',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Kitchen Remodel',
    propertyType: 'Residential Property',
    budget: '$2,200.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 8,
    name: 'Kristin Watson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Partial Renovation',
    propertyType: 'Commercial Property',
    budget: '$5,400.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
  {
    id: 9,
    name: 'Kristin Watson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
    renovationType: 'Flooring & Painting',
    propertyType: 'Investment Property',
    budget: '$1,600.00',
    description:
      'Existing spaces are upgraded and redesigned to improve functionality, aesthetics, and overall value through professional renovation solutions.',
  },
];

const PAGE_SIZE = 10;



const DetailRow = memo(({ label, value, isText }) => (
  <div className='py-4 border-b border-gray-100 last:border-b-0'>
    <p className='text-sm font-semibold text-gray-900 mb-1'>{label}</p>
    {isText ? (
      <p className='text-sm text-gray-500 leading-relaxed'>{value}</p>
    ) : (
      <p className='text-sm text-gray-500'>{value}</p>
    )}
  </div>
));
DetailRow.displayName = 'DetailRow';


const ActionMenu = memo(({ entry, onView, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClose = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const handleScroll = () => setOpen(false);
    document.addEventListener('mousedown', handleClose);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClose);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  const MENU_H = 120;

  const handleOpen = () => {
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < MENU_H + 8;
    const top = openUp ? rect.top - MENU_H - 6 : rect.bottom + 6;
    const left = Math.max(8, rect.right - 160);
    setPos({ top, left });
    setOpen((v) => !v);
  };

  return (
    <div className='relative'>
      <button
        ref={btnRef}
        type='button'
        onClick={handleOpen}
        aria-label={`Actions for ${entry.name}`}
        aria-expanded={open}
        aria-haspopup='true'
        className='w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-navy hover:text-navy hover:bg-navy/5 transition-colors cursor-pointer'
      >
        <MoreVertical size={16} aria-hidden='true' />
      </button>

      {open && (
        <div
          ref={menuRef}
          role='menu'
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            width: 160,
          }}
          className='bg-white border border-gray-200 rounded-xl shadow-xl py-2 animate-[fadeIn_0.15s_ease-out]'
        >
          <button
            role='menuitem'
            type='button'
            onClick={() => {
              onView(entry);
              setOpen(false);
            }}
            className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
          >
            <Eye size={15} className='text-gray-400' aria-hidden='true' />
            See Details
          </button>
          <div className='h-px bg-gray-100 my-1 mx-3' />
          <button
            role='menuitem'
            type='button'
            onClick={() => {
              onDelete(entry.id);
              setOpen(false);
            }}
            className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer'
          >
            <X size={15} aria-hidden='true' />
            Delete
          </button>
        </div>
      )}
    </div>
  );
});
ActionMenu.displayName = 'ActionMenu';


const Renovation = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewingEntry, setViewingEntry] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startItem = entries.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = entries.length === 0 ? 0 : startItem + entries.length - 1;

  const handleView = useCallback((entry) => {
    setViewingEntry(entry);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete renovation request?',
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
        API_ENDPOINTS.RENOVATIONS.DELETE(id),
      );

      if (error) {
        toast.error(error.message || 'Failed to delete renovation request.');
        return;
      }

      toast.success('Renovation request deleted successfully.');

      if (entries.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        return;
      }

      fetchRenovations();
    },
    [currentPage, entries.length, fetchRenovations],
  );

  const fetchRenovations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(API_ENDPOINTS.RENOVATIONS.LIST, {
      params: { page: currentPage, limit: PAGE_SIZE },
    });

    if (error) {
      toast.error(error.message || 'Failed to load renovation requests.');
      setEntries([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const payload = data?.data ?? data ?? {};
    const requests = Array.isArray(payload?.requests) ? payload.requests : [];
    const normalized = requests.map((r) => ({
      id: r.id,
      name: r.fullName || '',
      email: r.email || '',
      phone: r.phoneNumber || '',
      renovationType: r.renovationType || '',
      propertyType: r.propertyType || '',
      budget: r.budgetRange || '',
      description: r.projectDetails || '',
      createdAt: r.createdAt || '',
      raw: r,
    }));

    setEntries(normalized);
    setTotalItems(payload?.pagination?.total ?? requests.length);
    setLoading(false);
  }, [currentPage]);

  const handlePrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

  useEffect(() => {
    fetchRenovations();
  }, [fetchRenovations]);

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Renovation</h1>
        <p className='text-gray-500 text-base mt-1'>
          Plan, manage, and upgrade your existing spaces with efficient
          renovation solutions.
        </p>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='px-5 sm:px-6 py-4 border-b border-gray-100'>
          <h2 className='font-serif text-lg sm:text-xl font-bold text-gray-900'>
            Renovation List
          </h2>
        </div>

        {/* Desktop table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='min-w-full text-sm table-fixed'>
            <thead>
              <tr className='text-left text-sm font-medium text-gray-500 bg-gray-50/50'>
                <th className='px-6 py-3 w-[26%]'>Name</th>
                <th className='px-6 py-3 w-[30%]'>Email</th>
                <th className='px-6 py-3 w-[28%]'>Phone Number</th>
                <th className='px-6 py-3 w-[16%]'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-6 py-16 text-center text-gray-400 text-sm'
                    >
                      Loading renovation requests...
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-6 py-16 text-center text-gray-400 text-sm'
                    >
                      No entries found.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className='hover:bg-gray-50/40 transition-colors'
                    >
                      <td className='px-6 py-4 text-sm text-gray-800 truncate'>
                        {entry.name}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                        {entry.email}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                        {entry.phone}
                      </td>
                      <td className='px-6 py-4'>
                        <ActionMenu
                          entry={entry}
                          onView={handleView}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className='md:hidden divide-y divide-gray-100'>
          {loading ? (
            <p className='px-4 py-12 text-center text-gray-400 text-sm'>
              Loading renovation requests...
            </p>
          ) : entries.length === 0 ? (
            <p className='px-4 py-12 text-center text-gray-400 text-sm'>
              No entries found.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className='px-4 sm:px-6 py-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 truncate'>
                      {entry.name}
                    </p>
                    <p className='text-sm text-gray-500 truncate mt-0.5'>
                      {entry.email}
                    </p>
                    <p className='text-sm text-gray-500'>{entry.phone}</p>
                  </div>
                  <ActionMenu
                    entry={entry}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination footer */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          total={totalItems}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {viewingEntry && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]'
          onClick={() => setViewingEntry(null)}
        >
          <div
            className='bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
              <h3 className='text-lg font-bold text-gray-900'>
                Renovation Details
              </h3>
              <button
                type='button'
                onClick={() => setViewingEntry(null)}
                aria-label='Close modal'
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors'
              >
                <X size={16} aria-hidden='true' />
              </button>
            </div>

            <div className='px-6 pb-6'>
              {/* Customer Information */}
              <div className='py-4 border-b border-gray-100'>
                <div className='flex items-center gap-2 mb-3'>
                  <User
                    size={14}
                    className='text-gray-400'
                    aria-hidden='true'
                  />
                  <p className='text-sm text-gray-400'>Customer Information</p>
                </div>
                <p className='text-base font-bold text-gray-900 mb-0.5'>
                  {viewingEntry.name}
                </p>
                <p className='text-sm text-gray-500 mb-0.5'>
                  {viewingEntry.phone}
                </p>
                <p className='text-sm text-gray-500'>{viewingEntry.email}</p>
              </div>

              {/* Renovation fields */}
              <DetailRow
                label='Renovation Type'
                value={viewingEntry.renovationType}
              />
              <DetailRow
                label='Property Type'
                value={viewingEntry.propertyType}
              />
              <DetailRow label='Budget' value={viewingEntry.budget} />
              <DetailRow
                label='Description'
                value={viewingEntry.description}
                isText
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Renovation;
