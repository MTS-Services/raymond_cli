import { useState, useRef, useEffect, memo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { MoreVertical, X, Eye, User, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";
import TablePagination from "../../components/shared/TablePagination";
import Pagination from "../../components/shared/Pagination";

const normalizeInvestment = (item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  targetROI: item.targetRoi,
  timeline: item.timeline,
  minInvestment: item.minimumInvestment,
});

const normalizeEnquiry = (item) => ({
  id: item.id,
  name: item.fullName,
  email: item.email,
  phone: item.phoneNumber,
  investmentInterest: item.investmentInterest,
  description: item.message,
});

const PAGE_SIZE = 9;

const fmtROI = (val) => {
  if (val === null || val === undefined || val === "") return val;
  const s = String(val);
  return s.includes("%") ? s : `${s}%`;
};
const fmtTimeline = (val) => {
  if (val === null || val === undefined || val === "") return val;
  const s = String(val);
  return /month/i.test(s) ? s : `${s} months`;
};
const fmtInvestment = (val) => {
  if (val === null || val === undefined || val === "") return val;
  const s = String(val);
  return s.startsWith("$") ? s : `$${s}K`;
};

const DetailRow = memo(({ label, value }) => (
  <div className="py-4 border-b border-gray-100 last:border-b-0">
    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
    <p className="text-sm text-gray-500 wrap-break-word">{value}</p>
  </div>
));
DetailRow.displayName = "DetailRow";

const ActionMenu = memo(({ entry, onView, onDelete, ariaLabel }) => {
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
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const MENU_H = 96;

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
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        aria-label={ariaLabel || "More actions"}
        aria-expanded={open}
        aria-haspopup="true"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            width: 160,
          }}
          className="bg-white border border-gray-200 rounded-xl shadow-xl py-2 animate-[fadeIn_0.15s_ease-out]"
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              onView(entry);
              setOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Eye size={15} className="text-gray-400" aria-hidden="true" />
            See Details
          </button>
          <div className="h-px bg-gray-100 my-1 mx-3" />
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              onDelete(entry.id);
              setOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <X size={15} aria-hidden="true" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
});
ActionMenu.displayName = "ActionMenu";

const InvestmentCard = memo(({ item, onView, onDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
    {/* Card header */}
    <div className="flex items-start justify-end gap-3">
      <ActionMenu
        entry={item}
        onView={onView}
        onDelete={onDelete}
        ariaLabel={`Actions for ${item.title}`}
      />
    </div>

    {/* Title + Description */}
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 wrap-break-word">
        {item.description}
      </p>
    </div>

    {/* Stats */}
    <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Target ROI</span>
        <span className="text-sm font-semibold text-orange-500">
          {fmtROI(item.targetROI)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Timeline</span>
        <span className="text-sm font-bold text-gray-900">
          {fmtTimeline(item.timeline)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Min. Investment</span>
        <span className="text-sm font-bold text-gray-900">
          {fmtInvestment(item.minInvestment)}
        </span>
      </div>
    </div>
  </div>
));
InvestmentCard.displayName = "InvestmentCard";

const EMPTY_FORM = {
  title: "",
  description: "",
  targetROI: "",
  timeline: "",
  minInvestment: "",
};

const AddInvestmentModal = memo(({ onClose, onAdd }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.targetROI.trim() ||
      !form.timeline.trim() ||
      !form.minInvestment.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    await onAdd(form);
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Investment</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="inv-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Residential Property"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="inv-description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Ground-up construction of single-family and multi-family properties in high-growth markets."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Target ROI */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-targetROI"
              className="text-sm font-medium text-gray-700"
            >
              Target ROI
            </label>
            <input
              id="inv-targetROI"
              name="targetROI"
              type="text"
              value={form.targetROI}
              onChange={handleChange}
              placeholder="20%-25%"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-timeline"
              className="text-sm font-medium text-gray-700"
            >
              Timeline
            </label>
            <input
              id="inv-timeline"
              name="timeline"
              type="text"
              value={form.timeline}
              onChange={handleChange}
              placeholder="12-18 months"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Minimum Investment */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="inv-minInvestment"
              className="text-sm font-medium text-gray-700"
            >
              Minimum Investment
            </label>
            <input
              id="inv-minInvestment"
              name="minInvestment"
              type="text"
              value={form.minInvestment}
              onChange={handleChange}
              placeholder="$100K"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-panel-dark text-white text-sm font-semibold py-3 rounded-lg hover:bg-surface-dark transition-colors cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
});
AddInvestmentModal.displayName = "AddInvestmentModal";

const InvestmentDetailModal = memo(({ item, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Investment Details</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="px-6 pb-6">
        <DetailRow label="Title" value={item.title} />
        <DetailRow label="Description" value={item.description} />
        <DetailRow label="Target ROI" value={fmtROI(item.targetROI)} />
        <DetailRow label="Timeline" value={fmtTimeline(item.timeline)} />
        <DetailRow
          label="Minimum Investment"
          value={fmtInvestment(item.minInvestment)}
        />
      </div>
    </div>
  </div>
));
InvestmentDetailModal.displayName = "InvestmentDetailModal";

const EnquiryDetailModal = memo(({ entry, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Investment Details</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="px-6 pb-6">
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <User size={14} className="text-gray-400" aria-hidden="true" />
            <p className="text-sm text-gray-400">Customer Information</p>
          </div>
          <p className="text-base font-bold text-gray-900 mb-0.5">
            {entry.name}
          </p>
          <p className="text-sm text-gray-500 mb-0.5">{entry.phone}</p>
          <p className="text-sm text-gray-500">{entry.email}</p>
        </div>
        <DetailRow
          label="Investment Interest"
          value={entry.investmentInterest}
        />
        <DetailRow label="Description" value={entry.description} />
      </div>
    </div>
  </div>
));
EnquiryDetailModal.displayName = "EnquiryDetailModal";

const AdminInvestment = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    searchParams.get("tab") === "enquiry" ? "enquiry" : "listing";
  const [investments, setInvestments] = useState([]);
  const [investmentsTotalPages, setInvestmentsTotalPages] = useState(1);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesTotalPages, setEnquiriesTotalPages] = useState(1);
  const [enquiriesTotal, setEnquiriesTotal] = useState(0);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingInvestment, setViewingInvestment] = useState(null);
  const [viewingEnquiry, setViewingEnquiry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [listingPage, setListingPage] = useState(1);

  useEffect(() => {
    if (activeTab !== "listing") return;
    let mounted = true;
    setInvestmentsLoading(true);
    httpMethods
      .get(API_ENDPOINTS.INVESTMENTS.LIST, {
        params: { page: listingPage, limit: PAGE_SIZE },
      })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          toast.error(
            error.data?.message ||
              error.message ||
              "Failed to load investments.",
          );
          setInvestments([]);
        } else {
          const payload = data?.data ?? {};
          setInvestments((payload.investments ?? []).map(normalizeInvestment));
          setInvestmentsTotalPages(payload.pagination?.totalPages ?? 1);
        }
        setInvestmentsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeTab, listingPage]);

  useEffect(() => {
    if (activeTab !== "enquiry") return;
    let mounted = true;
    setEnquiriesLoading(true);
    httpMethods
      .get(API_ENDPOINTS.INVESTMENTS.APPLICATIONS.LIST, {
        params: { page: currentPage, limit: PAGE_SIZE },
      })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          toast.error(
            error.data?.message || error.message || "Failed to load enquiries.",
          );
          setEnquiries([]);
        } else {
          const payload = data?.data ?? {};
          setEnquiries((payload.applications ?? []).map(normalizeEnquiry));
          setEnquiriesTotalPages(payload.pagination?.totalPages ?? 1);
          setEnquiriesTotal(payload.pagination?.total ?? 0);
        }
        setEnquiriesLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeTab, currentPage]);

  const startItem =
    enquiriesTotal === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, enquiriesTotal);

  const handleTabChange = useCallback(
    (tab) => {
      setSearchParams(tab === "enquiry" ? { tab: "enquiry" } : {});
      setCurrentPage(1);
      setListingPage(1);
    },
    [setSearchParams],
  );

  const handleAddInvestment = useCallback(async (formData) => {
    const { data, error } = await httpMethods.post(
      API_ENDPOINTS.INVESTMENTS.CREATE,
      {
        title: formData.title,
        description: formData.description,
        targetRoi: formData.targetROI,
        timeline: formData.timeline,
        minimumInvestment: formData.minInvestment,
      },
    );
    if (error || !data?.data) {
      toast.error(
        error?.data?.message || error?.message || "Failed to add investment.",
      );
      return;
    }
    toast.success("Investment added successfully.");
    setShowAddModal(false);
    setListingPage(1);
  }, []);

  const handleViewInvestment = useCallback((item) => {
    setViewingInvestment(item);
  }, []);

  const handleDeleteInvestment = useCallback(async (id) => {
    const { error } = await httpMethods.delete(
      API_ENDPOINTS.INVESTMENTS.DELETE(id),
    );
    if (error) {
      toast.error(
        error.data?.message || error.message || "Failed to delete investment.",
      );
      return;
    }
    toast.success("Investment deleted.");
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleViewEnquiry = useCallback((entry) => {
    setViewingEnquiry(entry);
  }, []);

  const handleDeleteEnquiry = useCallback(async (id) => {
    const { error } = await httpMethods.delete(
      API_ENDPOINTS.INVESTMENTS.APPLICATIONS.DELETE(id),
    );
    if (error) {
      toast.error(
        error.data?.message || error.message || "Failed to delete enquiry.",
      );
      return;
    }
    toast.success("Enquiry deleted.");
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setEnquiriesTotal((prev) => Math.max(0, prev - 1));
  }, []);

  const handlePrev = useCallback(
    () => setCurrentPage((p) => Math.max(1, p - 1)),
    [],
  );
  const handleNext = useCallback(
    () => setCurrentPage((p) => Math.min(enquiriesTotalPages, p + 1)),
    [enquiriesTotalPages],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Investment
          </h1>
          <p className="text-gray-500 text-base mt-1">
            Plan, manage, and upgrade your existing spaces with efficient
            investment solutions.
          </p>
        </div>

        {/* ADD INVESTMENT button -- only on Listing tab */}
        {activeTab === "listing" && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Plus size={16} aria-hidden="true" />
            Add Investment
          </button>
        )}
      </div>

      <div className="flex gap-2 border border-gray-200 rounded-md w-full sm:w-fit p-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange("listing")}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
            activeTab === "listing"
              ? "bg-navy text-white"
              : "bg-transparent text-gray-700 hover:bg-gray-100"
          }`}
        >
          Listing
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("enquiry")}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
            activeTab === "enquiry"
              ? "bg-navy text-white"
              : "bg-transparent text-gray-700 hover:bg-gray-100"
          }`}
        >
          Enquiry
        </button>
      </div>

      {activeTab === "listing" && (
        <div>
          {investmentsLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center text-gray-400 text-sm">
              Loading investments...
            </div>
          ) : investments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center text-gray-400 text-sm">
              No investments yet. Click &ldquo;Add Investment&rdquo; to get
              started.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map((item) => (
                <InvestmentCard
                  key={item.id}
                  item={item}
                  onView={handleViewInvestment}
                  onDelete={handleDeleteInvestment}
                />
              ))}
            </div>
          )}
          {investmentsTotalPages > 1 && (
            <div className="pt-2">
              <Pagination
                currentPage={listingPage}
                totalPages={investmentsTotalPages}
                onPageChange={setListingPage}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "enquiry" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm table-fixed">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 bg-gray-50/50">
                  <th className="px-6 py-3 w-[26%]">Name</th>
                  <th className="px-6 py-3 w-[30%]">Email</th>
                  <th className="px-6 py-3 w-[28%]">Phone Number</th>
                  <th className="px-6 py-3 w-[16%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiriesLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center text-gray-400 text-sm"
                    >
                      Loading enquiries...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center text-gray-400 text-sm"
                    >
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 truncate">
                        {entry.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate">
                        {entry.phone}
                      </td>
                      <td className="px-6 py-4">
                        <ActionMenu
                          entry={entry}
                          onView={handleViewEnquiry}
                          onDelete={handleDeleteEnquiry}
                          ariaLabel={`Actions for ${entry.name}`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {enquiriesLoading ? (
              <p className="px-4 py-12 text-center text-gray-400 text-sm">
                Loading enquiries...
              </p>
            ) : enquiries.length === 0 ? (
              <p className="px-4 py-12 text-center text-gray-400 text-sm">
                No enquiries found.
              </p>
            ) : (
              enquiries.map((entry) => (
                <div key={entry.id} className="px-4 sm:px-6 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {entry.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {entry.email}
                      </p>
                      <p className="text-sm text-gray-500">{entry.phone}</p>
                    </div>
                    <ActionMenu
                      entry={entry}
                      onView={handleViewEnquiry}
                      onDelete={handleDeleteEnquiry}
                      ariaLabel={`Actions for ${entry.name}`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination footer */}
          <TablePagination
            currentPage={currentPage}
            totalPages={enquiriesTotalPages}
            startItem={startItem}
            endItem={endItem}
            total={enquiriesTotal}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      )}

      {showAddModal && (
        <AddInvestmentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddInvestment}
        />
      )}

      {viewingInvestment && (
        <InvestmentDetailModal
          item={viewingInvestment}
          onClose={() => setViewingInvestment(null)}
        />
      )}

      {viewingEnquiry && (
        <EnquiryDetailModal
          entry={viewingEnquiry}
          onClose={() => setViewingEnquiry(null)}
        />
      )}
    </div>
  );
});
AdminInvestment.displayName = "AdminInvestment";

export default AdminInvestment;
