import { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
  MoreVertical,
  X,
  Eye,
  User,
  Briefcase,
  DollarSign,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import { httpMethods } from '../../services/httpMethods';
import TablePagination from '../../components/shared/TablePagination';

const PAGE_SIZE = 9;

const normalizeRequest = (request) => ({
  id: request.id,
  fullName: request.fullName || '',
  email: request.email || '',
  phone: request.phone || '',
  projectType: request.projectType || '',
  estimatedBudget: request.estimatedBudget || '',
  projectDescription: request.projectDescription || '',
  createdAt: request.createdAt || '',
});


function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500',
];
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatUSD(n) {
  if (typeof n === 'string') return n;
  return Number.isFinite(n)
    ? n.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })
    : '-';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
}


const SectionHeader = memo(({ icon: Icon, title, iconBg, iconColor }) => (
  <div className='flex items-center gap-3 mb-4'>
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
    >
      <Icon size={16} className={iconColor} aria-hidden='true' />
    </div>
    <h4 className='text-sm font-bold text-gray-900'>{title}</h4>
  </div>
));
SectionHeader.displayName = 'SectionHeader';

const InfoGrid = memo(({ children }) => (
  <div className='border border-gray-100 rounded-xl overflow-hidden'>
    <div className='grid grid-cols-2 divide-x divide-y divide-gray-100'>
      {children}
    </div>
  </div>
));
InfoGrid.displayName = 'InfoGrid';

const InfoCell = memo(({ label, value, valueClass = '' }) => (
  <div className='p-3'>
    <p className='text-xs text-gray-400 mb-0.5'>{label}</p>
    <p className={`text-sm font-medium text-gray-800 ${valueClass}`}>{value}</p>
  </div>
));
InfoCell.displayName = 'InfoCell';


const ActionMenu = memo(({ entry, onView, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const MENU_H = 168;

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
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
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
        aria-label={`Actions for ${entry.fullName}`}
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


const FeeBuilder = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewingEntry, setViewingEntry] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startItem = entries.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = entries.length === 0 ? 0 : startItem + entries.length - 1;

  const fetchFeeBuilderRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(API_ENDPOINTS.FEE_BUILDER.LIST, {
      params: { page: currentPage, limit: PAGE_SIZE },
    });

    if (error) {
      toast.error(error.message || 'Failed to load fee builder requests.');
      setEntries([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const payload = data?.data ?? data ?? {};
    const requests = Array.isArray(payload?.requests) ? payload.requests : [];
    setEntries(requests.map(normalizeRequest));
    setTotalItems(payload?.pagination?.total ?? requests.length);
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchFeeBuilderRequests();
  }, [fetchFeeBuilderRequests]);

  const handleView = useCallback((entry) => {
    setViewingEntry(entry);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete fee builder request?',
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
        API_ENDPOINTS.FEE_BUILDER.DELETE(id),
      );

      if (error) {
        toast.error(error.message || 'Failed to delete fee builder request.');
        return;
      }

      toast.success('Fee builder request deleted successfully.');

      if (entries.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        return;
      }

      fetchFeeBuilderRequests();
    },
    [currentPage, entries.length, fetchFeeBuilderRequests],
  );

  const handlePrev = useCallback(
    () => setCurrentPage((p) => Math.max(1, p - 1)),
    [],
  );
  const handleNext = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

  return (
    <div className='space-y-8'>
      {/* Page header */}
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Fee Builder
        </h1>
        <p className='text-gray-500 text-base mt-1'>
          Set and manage your consultation pricing, packages, and service fees.
        </p>
      </div>

      {/* Table card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='px-5 sm:px-6 py-4 border-b border-gray-100'>
          <h2 className='font-serif text-lg sm:text-xl font-bold text-gray-900'>
            Fee Builder List
          </h2>
        </div>
        {/* Desktop table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='min-w-full text-sm table-fixed'>
            <thead>
              <tr className='text-left text-sm font-medium text-gray-500 bg-gray-50/50'>
                <th className='px-6 py-3 w-[22%]'>Name</th>
                <th className='px-6 py-3 w-[22%]'>Email</th>
                <th className='px-6 py-3 w-[18%]'>Phone</th>
                <th className='px-6 py-3 w-[18%]'>Project Type</th>
                <th className='px-6 py-3 w-[12%]'>Budget</th>
                <th className='px-6 py-3 w-[8%]'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-16 text-center text-gray-400 text-sm'
                  >
                    Loading fee builder requests...
                  </td>
                </tr>

              ) : entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
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
                      {entry.fullName}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                      {entry.email}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                      {entry.phone}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                      {entry.projectType}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                      {entry.estimatedBudget}
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
              Loading fee builder requests...
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
                      {entry.fullName}
                    </p>
                    <p className='text-sm text-gray-500 truncate mt-0.5'>
                      {entry.email}
                    </p>
                    <p className='text-sm text-gray-500'>{entry.phone}</p>
                    <p className='text-sm text-gray-500 mt-0.5'>
                      {entry.projectType} · {entry.estimatedBudget}
                    </p>
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

      {/* View details modal */}
      {viewingEntry && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]'
          onClick={() => setViewingEntry(null)}
        >
          <div
            className='bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div className='sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10'>
              <div>
                <h3 className='text-base font-bold text-gray-900'>
                  {viewingEntry.fullName}
                </h3>
                <p className='text-xs text-gray-400'>
                  {viewingEntry.projectType}
                </p>
              </div>
              <button
                type='button'
                onClick={() => setViewingEntry(null)}
                aria-label='Close'
                className='w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors'
              >
                <X size={16} />
              </button>
            </div>

            <div className='p-6 space-y-7'>
              {/* Customer Information */}
              <div>
                <SectionHeader
                  icon={User}
                  title='Customer Information'
                  iconBg='bg-blue-50'
                  iconColor='text-blue-500'
                />
                <InfoGrid>
                  <InfoCell label='Full Name' value={viewingEntry.fullName} />
                  <InfoCell label='Phone Number' value={viewingEntry.phone} />
                  <InfoCell label='Email Address' value={viewingEntry.email} />
                  <InfoCell label='Created At' value={formatDate(viewingEntry.createdAt)} />
                </InfoGrid>
              </div>

              {/* Project Type */}
              <div>
                <SectionHeader
                  icon={Briefcase}
                  title='Project Type'
                  iconBg='bg-orange-50'
                  iconColor='text-orange-500'
                />
                <InfoGrid>
                  <InfoCell label='Type' value={viewingEntry.projectType} />
                </InfoGrid>
              </div>

              {/* Estimate Budget */}
              <div>
                <SectionHeader
                  icon={DollarSign}
                  title='Estimate Budget'
                  iconBg='bg-green-50'
                  iconColor='text-green-600'
                />
                <InfoGrid>
                  <InfoCell
                    label='Estimated Budget'
                    value={formatUSD(viewingEntry.estimatedBudget)}
                    valueClass='text-orange-500'
                  />
                </InfoGrid>
              </div>

              {/* Project Description */}
              {viewingEntry.projectDescription && (
                <div>
                  <SectionHeader
                    icon={MessageCircle}
                    title='Project Description'
                    iconBg='bg-purple-50'
                    iconColor='text-purple-600'
                  />
                  <div className='border border-gray-100 rounded-xl p-4'>
                    <p className='text-sm text-gray-600 leading-relaxed'>
                      {viewingEntry.projectDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeBuilder;
