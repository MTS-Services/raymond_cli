import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Eye, X, Mail, Phone, MoreVertical, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import TablePagination from '../../components/shared/TablePagination';

const PAGE_SIZE = 8;

const FILTER_OPTIONS = ['ALL', 'NEW', 'CONTRACTED', 'CLOSED'];
const STATUS_OPTIONS = ['NEW', 'CONTRACTED', 'CLOSED'];

const STATUS_LABELS = {
  ALL: 'All',
  NEW: 'New',
  CONTRACTED: 'Contracted',
  CLOSED: 'Closed',
};

const STATUS_BADGE_LABELS = {
  NEW: 'New',
  CONTRACTED: 'Contracted',
  CLOSED: 'Closed',
};

const normalizeStatus = (status) => {
  if (!status) return 'NEW';
  return String(status).toUpperCase();
};

const StatusBadge = ({ status }) => {
  const normalized = normalizeStatus(status);
  const colors = {
    NEW: 'bg-blue-50 text-blue-600',
    CONTRACTED: 'bg-purple-50 text-purple-600',
    CLOSED: 'bg-orange-50 text-orange-600',
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        colors[normalized] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {STATUS_BADGE_LABELS[normalized] ?? normalized}
    </span>
  );
};

const LeadDetailModal = ({ lead, onClose }) => {
  const [details, setDetails] = useState(lead);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadInquiry = async () => {
      if (!lead?.id) return;

      setDetails(lead);
      setLoading(true);

      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.INQUIRIES.BY_ID(lead.id),
      );

      if (cancelled) return;

      if (error) {
        toast.error(error.message || 'Failed to load inquiry details.');
        setDetails(lead);
      } else {
        setDetails(data?.data ?? data ?? lead);
      }

      setLoading(false);
    };

    loadInquiry();

    return () => {
      cancelled = true;
    };
  }, [lead]);

  if (!lead) return null;

  const inquiry = details ?? lead;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl w-full max-w-xl max-h-[96vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          aria-label='Close'
          className='absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer'
        >
          <X size={16} />
        </button>

        <div className='p-6'>
          {loading && (
            <div className='mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600'>
              Loading inquiry details...
            </div>
          )}
          <div className='flex items-start gap-3'>
            <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-base font-bold text-orange-700 shrink-0'>
              {(inquiry.fullName ?? 'I')[0]}
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-900'>
                    {inquiry.fullName}
                </h3>
                <StatusBadge status={inquiry.status} />
              </div>
              <p className='text-sm text-gray-500 flex items-center gap-1 mt-1 break-all'>
                <Mail size={14} /> {inquiry.email}
              </p>
              <p className='text-sm text-gray-500 flex items-center gap-1'>
                  <Phone size={14} /> {inquiry.phoneNumber}
              </p>
            </div>
          </div>

          <div className='mt-5 border border-gray-200 rounded-lg p-4 bg-orange-50/30'>
            <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
              <p className='text-base font-semibold text-gray-800'>
                Inquiry Details
              </p>
                <p className='text-xs text-gray-500'>
                  Submitted on {new Date(inquiry.createdAt).toLocaleString()}
                </p>
            </div>
            <div className='mb-3'>
              <p className='text-xs text-orange-600 font-semibold mb-1'>
                  Property
              </p>
                <p className='text-sm text-gray-800'>{inquiry.property?.title}</p>
            </div>
            <div className='bg-white border border-gray-200 rounded-md p-3 mb-3'>
              <p className='text-xs text-gray-500 font-semibold mb-2'>
                  PROPERTY DETAILS
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm'>
                <div>
                    <p className='text-gray-400 text-xs'>TYPE</p>
                  <p className='text-gray-800 font-medium'>
                      {inquiry.property?.propertyType ?? 'N/A'}
                  </p>
                </div>
                <div>
                    <p className='text-gray-400 text-xs'>LISTING</p>
                    <p className='text-gray-800 font-medium'>
                      {inquiry.property?.listingType ?? 'N/A'}
                    </p>
                </div>
                <div>
                    <p className='text-gray-400 text-xs'>LOCATION</p>
                    <p className='text-gray-800 font-medium'>
                      {[inquiry.property?.city, inquiry.property?.state]
                        .filter(Boolean)
                        .join(', ') || 'N/A'}
                    </p>
                </div>
              </div>
            </div>
            <div>
              <p className='text-xs text-gray-500 font-semibold mb-1'>
                Additional Comments
              </p>
              <p className='text-sm text-gray-700 border-l-2 border-orange-400 pl-3 italic'>
                  &ldquo;{inquiry.message}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MENU_HEIGHT = 196; // estimated menu height in px

const ActionDropdown = ({ lead, onView, onStatusChange, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, openUp: false });
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
    const openUp = spaceBelow < MENU_HEIGHT + 8;
    const top = openUp ? rect.top - MENU_HEIGHT - 6 : rect.bottom + 6;
    const left = Math.max(8, rect.right - 192);
    setPos({ top, left, openUp });
    setOpen((o) => !o);
  };

  return (
    <div className='relative'>
      <button
        ref={btnRef}
        type='button'
        onClick={handleOpen}
        className='w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-navy hover:text-navy hover:bg-navy/5 transition-colors cursor-pointer'
        aria-label='Actions'
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            width: 192,
          }}
          className='bg-white border border-gray-200 rounded-xl shadow-xl py-2'
        >
          <button
            type='button'
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer'
          >
            <Eye size={15} className='text-gray-400' />
            View Details
          </button>
          <div className='h-px bg-gray-100 my-1.5 mx-3' />
          <p className='px-4 pt-1 pb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            Change Status
          </p>
          {STATUS_OPTIONS.map((o) => (
            <label
              key={o}
              className='flex items-center gap-2.5 px-4 py-2 cursor-pointer hover:bg-gray-50'
            >
              <input
                type='radio'
                name={`status-${lead.id}`}
                value={o}
                checked={normalizeStatus(lead.status) === o}
                onChange={() => {
                  onStatusChange(lead.id, o);
                  setOpen(false);
                }}
                className='accent-orange-500 cursor-pointer'
              />
              <span className='text-sm text-gray-700'>{o}</span>
            </label>
          ))}
          <div className='h-px bg-gray-100 my-1.5 mx-3' />
          <button
            type='button'
            onClick={() => {
              onDelete(lead);
              setOpen(false);
            }}
            className='flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer'
          >
            <Trash2 size={15} className='text-red-500' />
            Delete Inquiry
          </button>
        </div>
      )}
    </div>
  );
};

const LeadsInquiries = () => {
  const [tab, setTab] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInquiries = async () => {
      setLoading(true);
      const params = {};
      if (tab !== 'ALL') params.status = tab;

      const { data, error } = await httpMethods.get(API_ENDPOINTS.INQUIRIES.LIST, {
        params,
      });

      if (cancelled) return;

      if (error) {
        toast.error(error.message || 'Failed to load inquiries.');
        setLeads([]);
      } else {
        setLeads(data?.data ?? data ?? []);
      }

      setLoading(false);
    };

    fetchInquiries();

    return () => {
      cancelled = true;
    };
  }, [tab]);

  const filtered = useMemo(() => leads, [leads]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );
  const startItem =
    filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const handleStatusChange = async (id, status) => {
    const nextStatus = normalizeStatus(status);
    const previous = leads.find((lead) => lead.id === id)?.status;

    setUpdatingStatusId(id);
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead)),
    );

    const { error } = await httpMethods.patch(
      API_ENDPOINTS.INQUIRIES.STATUS(id),
      { status: nextStatus },
    );

    setUpdatingStatusId(null);

    if (error) {
      toast.error(error.message || 'Failed to update inquiry status.');
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, status: previous ?? nextStatus } : lead,
        ),
      );
      return;
    }

    toast.success('Inquiry status updated.');
  };

  const handleDelete = async (lead) => {
    if (!lead?.id) return;

    const result = await Swal.fire({
      title: 'Delete inquiry?',
      text: `Delete inquiry from ${lead.fullName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeletingId(lead.id);
    const { error } = await httpMethods.delete(
      API_ENDPOINTS.INQUIRIES.DELETE(lead.id),
    );
    setDeletingId(null);

    if (error) {
      toast.error(error.message || 'Failed to delete inquiry.');
      return;
    }

    setLeads((prev) => prev.filter((item) => item.id !== lead.id));
    setSelected((current) => (current?.id === lead.id ? null : current));
    toast.success('Inquiry deleted.');
  };

  return (
    <div className='space-y-5'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Leads & Inquiries
          </h1>
          <p className='text-gray-500 text-base mt-1'>
            Manage and track your potential buyers and inquiries.
          </p>
        </div>
        <div className='flex flex-col gap-3 lg:items-end'>
          <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
            <div className='flex gap-1 bg-white border border-gray-200 rounded-md p-1 w-full lg:w-auto'>
              {FILTER_OPTIONS.map((t) => (
                <button
                  key={t}
                  type='button'
                  onClick={() => {
                    setTab(t);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
                    tab === t
                      ? 'bg-navy text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {STATUS_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
        <div className='px-5 sm:px-6 py-4 border-b border-gray-100'>
          <h2 className='font-serif text-lg sm:text-xl font-bold text-gray-900'>
            Lead List
          </h2>
        </div>
        {/* Mobile card list -- visible below md */}
        {loading ? (
          <div className='p-10 text-center text-gray-500'>Loading inquiries...</div>
        ) : (
          <>
        <div className='md:hidden divide-y divide-gray-100'>
          {paged.map((lead) => (
            <div key={lead.id} className='px-4 sm:px-6 py-4'>
              <div className='flex items-start justify-between gap-3 mb-3'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold text-gray-900 truncate'>
                    {lead.fullName}
                  </p>
                  <p className='text-sm text-gray-500'>{lead.phoneNumber}</p>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <StatusBadge status={lead.status} />
                  <ActionDropdown
                    lead={lead}
                    onView={() => setSelected(lead)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
              <div className='grid grid-cols-[5rem_1fr] gap-x-3 gap-y-1.5'>
                <span className='text-xs text-gray-400 self-start pt-px'>
                  Property
                </span>
                <span className='text-sm text-gray-800 truncate'>
                  {lead.property?.title ?? 'N/A'}
                </span>
                <span className='text-xs text-gray-400 self-start pt-px'>
                  Email
                </span>
                <span className='text-sm text-gray-600 break-all'>
                  {lead.email}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet table -- visible from md up */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='min-w-full text-sm table-fixed'>
            <thead>
              <tr className='text-left text-sm font-medium text-gray-500 bg-gray-50/50'>
                <th className='px-6 py-3 w-[22%]'>Listing Name</th>
                <th className='px-6 py-3 w-[22%]'>Customer Info</th>
                <th className='px-6 py-3 w-[28%]'>Email</th>
                <th className='px-6 py-3 w-[18%]'>Status</th>
                <th className='px-6 py-3 w-[10%]'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {paged.map((lead) => (
                <tr key={lead.id} className='hover:bg-gray-50/40'>
                  <td className='px-6 py-4 text-gray-800 text-sm truncate'>
                    {lead.property?.title ?? 'N/A'}
                  </td>
                  <td className='px-6 py-4'>
                    <div>
                      <p className='text-gray-800 text-sm font-medium truncate'>
                        {lead.fullName}
                      </p>
                      <p className='text-gray-500 text-sm'>{lead.phoneNumber}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-gray-600 text-sm break-all'>
                    {lead.email}
                  </td>
                  <td className='px-6 py-4'>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className='px-6 py-4'>
                    <ActionDropdown
                      lead={lead}
                      onView={() => setSelected(lead)}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          total={filtered.length}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />
          </>
        )}
      </div>

      <LeadDetailModal lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default LeadsInquiries;
