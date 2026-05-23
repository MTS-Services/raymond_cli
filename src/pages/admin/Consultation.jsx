import { useState, useMemo, useRef, useEffect, memo, useCallback } from 'react';
import { MoreVertical, X, Eye, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import { httpMethods } from '../../services/httpMethods';
import TablePagination from '../../components/shared/TablePagination';


const MOCK_CONSULTATIONS = [
  {
    id: 1,
    name: 'Eleanor Pena',
    email: 'aliza@gmail.com',
    phone: '+880 1712-345678',
    date: 'May 9, 2026',
    time: '10:00 AM - 11:00 AM',
    description:
      "I'm interested in learning more about your real estate investment opportunities. Please review my information and contact me to discuss available projects, expected returns, and the best investment options based on my goals and budget.",
  },
  {
    id: 2,
    name: 'Esther Howard',
    email: 'esther@gmail.com',
    phone: '+880 1934-567890',
    date: 'May 10, 2026',
    time: '2:00 PM - 3:00 PM',
    description:
      'Looking to get a consultation on residential property development in high-growth suburban markets. Interested in understanding timelines, minimum investment thresholds, and projected ARV.',
  },
  {
    id: 3,
    name: 'Annette Black',
    email: 'annette@gmail.com',
    phone: '+880 1812-345678',
    date: 'May 11, 2026',
    time: '11:30 AM - 12:30 PM',
    description:
      'Need guidance on fix-and-flip strategies for commercial properties. Would like to review current market opportunities and discuss financing options available for first-time commercial investors.',
  },
  {
    id: 4,
    name: 'Jenny Wilson',
    email: 'jenny@gmail.com',
    phone: '+880 1956-789012',
    date: 'May 12, 2026',
    time: '9:00 AM - 10:00 AM',
    description:
      'Seeking advice on multi-family rental portfolio management. Interested in learning about property management tools, tenant screening, and cash flow optimization strategies.',
  },
  {
    id: 5,
    name: 'Darlene Robertson',
    email: 'darlene@gmail.com',
    phone: '+880 1723-456789',
    date: 'May 13, 2026',
    time: '3:00 PM - 4:00 PM',
    description:
      'Want to explore wholesale real estate opportunities. Looking for off-market properties and guidance on building a buyer network to maximize deal flow and profit margins.',
  },
  {
    id: 6,
    name: 'Guy Hawkins',
    email: 'guy@gmail.com',
    phone: '+880 1845-678901',
    date: 'May 14, 2026',
    time: '1:00 PM - 2:00 PM',
    description:
      'Interested in learning about vacation rental investment strategies in high-demand tourist destinations. Would like to discuss short-term rental regulations, management platforms, and ROI benchmarks.',
  },
  {
    id: 7,
    name: 'Jerome Bell',
    email: 'jerome@gmail.com',
    phone: '+880 1967-890123',
    date: 'May 15, 2026',
    time: '10:30 AM - 11:30 AM',
    description:
      'Exploring new construction investment opportunities. Would like to understand the entitlement process, construction timelines, and financing structures available for ground-up residential development.',
  },
  {
    id: 8,
    name: 'Kristin Watson',
    email: 'kristin.w@gmail.com',
    phone: '+880 1634-567890',
    date: 'May 16, 2026',
    time: '4:00 PM - 5:00 PM',
    description:
      'Looking for advice on renovation projects for investment properties. Interested in budget planning, contractor selection, material sourcing, and understanding which upgrades yield the highest ROI.',
  },
  {
    id: 9,
    name: 'Cameron Williamson',
    email: 'cameron@gmail.com',
    phone: '+880 1789-012345',
    date: 'May 17, 2026',
    time: '11:00 AM - 12:00 PM',
    description:
      'Interested in senior housing development as part of a socially responsible investment strategy. Seeking information on government-backed financing, regulatory compliance, and market demand analysis.',
  },
  {
    id: 10,
    name: 'Ronald Richards',
    email: 'ronald@gmail.com',
    phone: '+880 1523-456789',
    date: 'May 18, 2026',
    time: '2:30 PM - 3:30 PM',
    description:
      'Need consultation on industrial warehouse acquisitions. Looking for long-term triple-net lease opportunities with minimal management overhead in logistics-heavy markets.',
  },
  {
    id: 11,
    name: 'Kathryn Murphy',
    email: 'kathryn@gmail.com',
    phone: '+880 1678-901234',
    date: 'May 19, 2026',
    time: '9:30 AM - 10:30 AM',
    description:
      'Would like to discuss student housing fund investments near major university campuses. Interested in properties with consistent occupancy and low vacancy risk throughout the academic year.',
  },
  {
    id: 12,
    name: 'Devon Lane',
    email: 'devon@gmail.com',
    phone: '+880 1456-789012',
    date: 'May 20, 2026',
    time: '12:00 PM - 1:00 PM',
    description:
      'Seeking guidance on mixed-use development projects that combine retail and residential units. Want to understand zoning requirements, tenant mix strategies, and financing options available.',
  },
];

const PAGE_SIZE = 10;


const DetailRow = memo(({ label, value }) => (
  <div className='py-4 border-b border-gray-100 last:border-b-0'>
    <p className='text-sm font-semibold text-gray-900 mb-1'>{label}</p>
    <p className='text-sm text-gray-500'>{value}</p>
  </div>
));
DetailRow.displayName = 'DetailRow';


const ActionMenu = memo(({ entry, onView, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const MENU_H = 96;

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


const ConsultationDetailModal = memo(({ entry, onClose }) => {
  if (!entry) return null;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
          <h3 className='text-lg font-bold text-gray-900'>Consultation Details</h3>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close modal'
            className='w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors'
          >
            <X size={16} aria-hidden='true' />
          </button>
        </div>

        <div className='px-6 pb-6'>
          <div className='py-4 border-b border-gray-100'>
            <div className='flex items-center gap-2 mb-3'>
              <User size={14} className='text-gray-400' aria-hidden='true' />
              <p className='text-sm text-gray-400'>Customer Information</p>
            </div>
            <p className='text-base font-bold text-gray-900 mb-0.5'>{entry.name}</p>
            <p className='text-sm text-gray-500 mb-0.5'>{entry.phone}</p>
            <p className='text-sm text-gray-500'>{entry.email}</p>
          </div>

          <DetailRow label='Date' value={entry.date} />
          <DetailRow label='Time' value={entry.time} />
          <DetailRow label='Description' value={entry.description} />
        </div>
      </div>
    </div>
  );
});
ConsultationDetailModal.displayName = 'ConsultationDetailModal';

const AdminConsultation = memo(() => {
  const [consultations, setConsultations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewingEntry, setViewingEntry] = useState(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startItem = consultations.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = consultations.length === 0 ? 0 : startItem + consultations.length - 1;

  const formatDate = (val) => {
    if (!val) return '-';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(API_ENDPOINTS.CONSULTATIONS.LIST, {
      params: { page: currentPage, limit: PAGE_SIZE },
    });

    if (error) {
      toast.error(error.message || 'Failed to load consultations.');
      setConsultations([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const payload = data?.data ?? data ?? {};
    const list = Array.isArray(payload?.consultations) ? payload.consultations : [];
    const normalized = list.map((c) => ({
      id: c.id,
      name: c.fullName || '',
      email: c.email || '',
      phone: c.phoneNumber || '',
      date: formatDate(c.preferredConsultationDate),
      time: c.preferredTime || '',
      description: c.additionalInformation || '',
      createdAt: c.createdAt || '',
      raw: c,
    }));

    setConsultations(normalized);
    setTotalItems(payload?.pagination?.total ?? normalized.length);
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleView = useCallback((entry) => setViewingEntry(entry), []);

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete consultation?',
        icon: 'warning',
        text: 'This action cannot be undone.',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      const { error } = await httpMethods.delete(API_ENDPOINTS.CONSULTATIONS.DELETE(id));

      if (error) {
        toast.error(error.message || 'Failed to delete consultation.');
        return;
      }

      toast.success('Consultation deleted.');

      if (consultations.length === 1 && currentPage > 1) {
        setCurrentPage((p) => Math.max(1, p - 1));
        return;
      }

      fetchConsultations();
    },
    [consultations.length, currentPage, fetchConsultations],
  );

  const handlePrev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Consultation
        </h1>
        <p className='text-gray-500 text-base mt-1'>Talks with your client</p>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        {/* Desktop table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='min-w-full text-sm table-fixed'>
            <thead>
              <tr className='text-left text-sm font-medium text-gray-500 bg-gray-50/50 border-b border-gray-100'>
                <th className='px-6 py-3.5 w-[24%]'>Name</th>
                <th className='px-6 py-3.5 w-[30%]'>Email</th>
                <th className='px-6 py-3.5 w-[30%]'>Phone Number</th>
                <th className='px-6 py-3.5 w-[16%]'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-16 text-center text-gray-400 text-sm'
                  >
                    Loading consultations...
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-16 text-center text-gray-400 text-sm'
                  >
                    No consultations found.
                  </td>
                </tr>
              ) : (
                consultations.map((entry) => (
                  <tr
                    key={entry.id}
                    className='hover:bg-gray-50/40 transition-colors'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-gray-800 truncate'>
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
              Loading consultations...
            </p>
          ) : consultations.length === 0 ? (
            <p className='px-4 py-12 text-center text-gray-400 text-sm'>
              No consultations found.
            </p>
          ) : (
            consultations.map((entry) => (
              <div key={entry.id} className='px-4 sm:px-6 py-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold text-gray-900 truncate'>
                      {entry.name}
                    </p>
                    <p className='text-sm text-gray-500 truncate mt-0.5'>
                      {entry.email}
                    </p>
                    <p className='text-sm text-gray-500 mt-0.5'>
                      {entry.phone}
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

      {viewingEntry && (
        <ConsultationDetailModal
          entry={viewingEntry}
          onClose={() => setViewingEntry(null)}
        />
      )}
    </div>
  );
});
AdminConsultation.displayName = 'AdminConsultation';

export default AdminConsultation;
