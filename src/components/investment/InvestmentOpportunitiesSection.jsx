import React, { memo, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";
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
const OpportunityCard = memo(
  ({ title, description, roi, timeline, minInvestment, onClick }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-ink-soft font-bold text-lg leading-snug">
          {title}
        </h3>
        <p className="text-base text-gray-500 leading-relaxed line-clamp-3 wrap-break-word">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Target ROI</span>
          <span className="text-sm font-bold text-orange-500">
            {fmtROI(roi)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Timeline</span>
          <span className="text-sm font-bold text-ink-soft">
            {fmtTimeline(timeline)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Min. Investment</span>
          <span className="text-sm font-bold text-ink-soft">
            {fmtInvestment(minInvestment)}
          </span>
        </div>
      </div>
    </div>
  ),
);
OpportunityCard.displayName = "OpportunityCard";

const DetailRow = memo(({ label, value }) => (
  <div className="py-4 border-b border-gray-100 last:border-b-0">
    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
    <p className="text-sm text-gray-500 wrap-break-word">{value}</p>
  </div>
));
DetailRow.displayName = "DetailRow";

const InvestmentDetailModal = memo(({ item, onClose, onInvestNow }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Investment Details
          </h3>
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
          <DetailRow label="Target ROI" value={fmtROI(item.roi)} />
          <DetailRow label="Timeline" value={fmtTimeline(item.timeline)} />
          <DetailRow
            label="Minimum Investment"
            value={fmtInvestment(item.minInvestment)}
          />
          <div className="pt-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onInvestNow(item.title);
              }}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl py-3 transition-colors"
            >
              Ready to Invest With Us?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
InvestmentDetailModal.displayName = "InvestmentDetailModal";

const InvestmentOpportunitiesSection = ({ onInvestNow }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleCardClick = useCallback((opp) => {
    setSelectedOpportunity(opp);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedOpportunity(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    httpMethods
      .get(API_ENDPOINTS.INVESTMENTS.LIST, { params: { limit: 12 } })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (!error) {
          const items = data?.data?.investments ?? [];
          setOpportunities(
            items.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              roi: item.targetRoi,
              timeline: item.timeline,
              minInvestment: item.minimumInvestment,
            })),
          );
        }
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section
        className="py-14 lg:py-20 bg-surface-cool"
        aria-labelledby="opportunities-heading"
      >
        <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4">
              <span className="text-orange-500 text-xs font-semibold tracking-wide uppercase">
                Investment Options
              </span>
            </div>
            <h2
              id="opportunities-heading"
              className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-ink-soft font-bold mb-4"
            >
              Investment Opportunities
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Diversified portfolio of real estate investments tailored to
              different risk profiles and return objectives.
            </p>
          </div>
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-12">
              Loading opportunities...
            </p>
          ) : opportunities.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">
              No investment opportunities available at this time.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  {...opp}
                  onClick={() => handleCardClick(opp)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedOpportunity && (
        <InvestmentDetailModal
          item={selectedOpportunity}
          onClose={handleCloseModal}
          onInvestNow={onInvestNow}
        />
      )}
    </>
  );
};

export default InvestmentOpportunitiesSection;
