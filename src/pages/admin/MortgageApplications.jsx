import { useState, useMemo, useRef, useEffect, memo, useCallback } from 'react';
import {
  Filter,
  ChevronDown,
  MoreVertical,
  X,
  Eye,
  User,
  Briefcase,
  CreditCard,
  Calculator,
  RefreshCcw,
  MessageCircle,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import TablePagination from '../../components/shared/TablePagination';


function calcPMT(principal, annualRate, years) {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}


const MOCK_APPLICATIONS = [
  {
    id: 1,
    refId: '#MRT-1024',
    name: 'John Smith',
    email: 'john@email.com',
    phone: '(503) 555-0142',
    submittedDate: 'Apr 28, 2026',
    submittedTime: '10:34 AM',
    submittedRelative: '2 hours ago',
    status: 'Pending',
    employmentStatus: 'Employed Full-Time',
    annualIncome: 95000,
    loanAmount: 425000,
    loanType: 'Fixed Rate',
    loanTerm: 30,
    propertyType: 'Single Family Home',
    purchaseAmount: 800000,
    downPayment: 160000,
    mortgageRate: 6.5,
    mortgageTerm: 30,
    refinanceLoanAmount: 600000,
    estimatedHomeValue: 1000000,
    refinanceRate: 6.5,
    fico: 740,
    refinanceTerm: 14,
    customerMessage:
      "I'm looking to purchase my first family home in the Portland area. Please reach out at your earliest convenience to discuss options.",
  },
  {
    id: 2,
    refId: '#MRT-1023',
    name: 'Sarah Johnson',
    email: 'sarah@gmail.com',
    phone: '(503) 555-0198',
    submittedDate: 'Apr 27, 2026',
    submittedTime: '2:15 PM',
    submittedRelative: '1 day ago',
    status: 'Approved',
    employmentStatus: 'Employed Full-Time',
    annualIncome: 95000,
    loanAmount: 310000,
    loanType: 'Fixed Rate',
    loanTerm: 30,
    propertyType: 'Condo',
    purchaseAmount: 380000,
    downPayment: 70000,
    mortgageRate: 6.5,
    mortgageTerm: 30,
    refinanceLoanAmount: 290000,
    estimatedHomeValue: 380000,
    refinanceRate: 6.5,
    fico: 720,
    refinanceTerm: 20,
    customerMessage:
      'Looking to buy a condo in downtown Portland. Good credit history and stable income.',
  },
  {
    id: 3,
    refId: '#MRT-1022',
    name: 'Michael Chen',
    email: 'mchen@yahoo.com',
    phone: '(503) 555-0167',
    submittedDate: 'Apr 26, 2026',
    submittedTime: '9:50 AM',
    submittedRelative: '2 days ago',
    status: 'Approved',
    employmentStatus: 'Self-Employed',
    annualIncome: 185000,
    loanAmount: 580000,
    loanType: 'Adjustable',
    loanTerm: 15,
    propertyType: 'Single Family Home',
    purchaseAmount: 720000,
    downPayment: 144000,
    mortgageRate: 5.9,
    mortgageTerm: 15,
    refinanceLoanAmount: 550000,
    estimatedHomeValue: 720000,
    refinanceRate: 5.9,
    fico: 780,
    refinanceTerm: 15,
    customerMessage:
      'Strong financials, self-employed with consistent 5-year revenue. High-value property purchase.',
  },
  {
    id: 4,
    refId: '#MRT-1021',
    name: 'Emily Davis',
    email: 'emily.d@mail.com',
    phone: '(503) 555-0134',
    submittedDate: 'Apr 25, 2026',
    submittedTime: '3:30 PM',
    submittedRelative: '4 days ago',
    status: 'Rejected',
    employmentStatus: 'Employed Part-Time',
    annualIncome: 78000,
    loanAmount: 245000,
    loanType: 'Fixed Rate',
    loanTerm: 30,
    propertyType: 'Townhouse',
    purchaseAmount: 300000,
    downPayment: 55000,
    mortgageRate: 6.5,
    mortgageTerm: 30,
    refinanceLoanAmount: 220000,
    estimatedHomeValue: 300000,
    refinanceRate: 6.5,
    fico: 650,
    refinanceTerm: 20,
    customerMessage:
      'First-time buyer looking for an affordable townhouse in the suburbs.',
  },
  {
    id: 5,
    refId: '#MRT-1020',
    name: 'Lisa Park',
    email: 'lpark@hotmail.com',
    phone: '(503) 555-0145',
    submittedDate: 'Apr 24, 2026',
    submittedTime: '11:05 AM',
    submittedRelative: '5 days ago',
    status: 'Pending',
    employmentStatus: 'Employed Full-Time',
    annualIncome: 105000,
    loanAmount: 378000,
    loanType: 'Fixed Rate',
    loanTerm: 20,
    propertyType: 'Single Family Home',
    purchaseAmount: 460000,
    downPayment: 82000,
    mortgageRate: 6.3,
    mortgageTerm: 20,
    refinanceLoanAmount: 360000,
    estimatedHomeValue: 460000,
    refinanceRate: 6.3,
    fico: 710,
    refinanceTerm: 20,
    customerMessage:
      'Awaiting income verification documents. Will upload shortly.',
  },
  {
    id: 6,
    refId: '#MRT-1019',
    name: 'David Kim',
    email: 'dkim@gmail.com',
    phone: '(503) 555-0178',
    submittedDate: 'Apr 23, 2026',
    submittedTime: '4:45 PM',
    submittedRelative: '6 days ago',
    status: 'Pending',
    employmentStatus: 'Self-Employed',
    annualIncome: 142000,
    loanAmount: 520000,
    loanType: 'Fixed Rate',
    loanTerm: 30,
    propertyType: 'Single Family Home',
    purchaseAmount: 640000,
    downPayment: 120000,
    mortgageRate: 6.5,
    mortgageTerm: 30,
    refinanceLoanAmount: 500000,
    estimatedHomeValue: 640000,
    refinanceRate: 6.5,
    fico: 690,
    refinanceTerm: 25,
    customerMessage: 'Documents currently under review by underwriting team.',
  },
  {
    id: 7,
    refId: '#MRT-1018',
    name: 'John Martinez',
    email: 'jmartinez@yahoo.com',
    phone: '(503) 555-0156',
    submittedDate: 'Apr 22, 2026',
    submittedTime: '8:20 AM',
    submittedRelative: '8 days ago',
    status: 'Pending',
    employmentStatus: 'Employed Full-Time',
    annualIncome: 200000,
    loanAmount: 620000,
    loanType: 'Adjustable',
    loanTerm: 30,
    propertyType: 'Multi-Family',
    purchaseAmount: 760000,
    downPayment: 140000,
    mortgageRate: 5.75,
    mortgageTerm: 30,
    refinanceLoanAmount: 600000,
    estimatedHomeValue: 760000,
    refinanceRate: 5.75,
    fico: 760,
    refinanceTerm: 20,
    customerMessage:
      'Investment property purchase with strong cash flow projections.',
  },
  {
    id: 8,
    refId: '#MRT-1017',
    name: 'Anna White',
    email: 'awhite@email.com',
    phone: '(503) 555-0191',
    submittedDate: 'Apr 20, 2026',
    submittedTime: '1:00 PM',
    submittedRelative: '10 days ago',
    status: 'Pending',
    employmentStatus: 'Employed Part-Time',
    annualIncome: 62000,
    loanAmount: 195000,
    loanType: 'Adjustable',
    loanTerm: 15,
    propertyType: 'Condo',
    purchaseAmount: 240000,
    downPayment: 45000,
    mortgageRate: 6.2,
    mortgageTerm: 15,
    refinanceLoanAmount: 185000,
    estimatedHomeValue: 240000,
    refinanceRate: 6.2,
    fico: 680,
    refinanceTerm: 15,
    customerMessage:
      'First-time buyer. Looking for a condo close to public transit.',
  },
  {
    id: 9,
    refId: '#MRT-1016',
    name: 'Robert Taylor',
    email: 'rtaylor@mail.com',
    phone: '(503) 555-0162',
    submittedDate: 'Apr 19, 2026',
    submittedTime: '3:10 PM',
    submittedRelative: '11 days ago',
    status: 'Rejected',
    employmentStatus: 'Employed Full-Time',
    annualIncome: 55000,
    loanAmount: 445000,
    loanType: 'Fixed Rate',
    loanTerm: 30,
    propertyType: 'Single Family Home',
    purchaseAmount: 550000,
    downPayment: 105000,
    mortgageRate: 6.5,
    mortgageTerm: 30,
    refinanceLoanAmount: 420000,
    estimatedHomeValue: 550000,
    refinanceRate: 6.5,
    fico: 620,
    refinanceTerm: 30,
    customerMessage:
      'Debt-to-income ratio is high. Seeking assistance with options.',
  },
  {
    id: 10,
    refId: '#MRT-1015',
    name: 'Maria Garcia',
    email: 'mgarcia@yahoo.com',
    phone: '(503) 555-0143',
    submittedDate: 'Apr 18, 2026',
    submittedTime: '10:55 AM',
    submittedRelative: '12 days ago',
    status: 'Rejected',
    employmentStatus: 'Part-Time',
    annualIncome: 48000,
    loanAmount: 290000,
    loanType: 'Adjustable',
    loanTerm: 30,
    propertyType: 'Townhouse',
    purchaseAmount: 355000,
    downPayment: 65000,
    mortgageRate: 6.5,
    mortgageTerm: 30,
    refinanceLoanAmount: 275000,
    estimatedHomeValue: 355000,
    refinanceRate: 6.5,
    fico: 600,
    refinanceTerm: 25,
    customerMessage:
      'Insufficient credit score. Will reapply after improving credit.',
  },
  {
    id: 11,
    refId: '#MRT-1014',
    name: 'James Wilson',
    email: 'jwilson@gmail.com',
    phone: '(503) 555-0187',
    submittedDate: 'Apr 15, 2026',
    submittedTime: '9:00 AM',
    submittedRelative: '15 days ago',
    status: 'Approved',
    employmentStatus: 'Employed Full-Time',
    annualIncome: 225000,
    loanAmount: 730000,
    loanType: 'Fixed Rate',
    loanTerm: 30,
    propertyType: 'Single Family Home',
    purchaseAmount: 900000,
    downPayment: 170000,
    mortgageRate: 6.2,
    mortgageTerm: 30,
    refinanceLoanAmount: 700000,
    estimatedHomeValue: 900000,
    refinanceRate: 6.2,
    fico: 800,
    refinanceTerm: 25,
    customerMessage:
      'Luxury property purchase. Excellent credit and strong employment history.',
  },
  {
    id: 12,
    refId: '#MRT-1013',
    name: 'Nancy Brown',
    email: 'nbrown@hotmail.com',
    phone: '(503) 555-0154',
    submittedDate: 'Apr 12, 2026',
    submittedTime: '2:40 PM',
    submittedRelative: '18 days ago',
    status: 'Rejected',
    employmentStatus: 'Part-Time',
    annualIncome: 41000,
    loanAmount: 165000,
    loanType: 'Fixed Rate',
    loanTerm: 15,
    propertyType: 'Condo',
    purchaseAmount: 200000,
    downPayment: 35000,
    mortgageRate: 6.5,
    mortgageTerm: 15,
    refinanceLoanAmount: 155000,
    estimatedHomeValue: 200000,
    refinanceRate: 6.5,
    fico: 590,
    refinanceTerm: 15,
    customerMessage:
      'Employment history is insufficient. Will apply again after 6 months.',
  },
];



const FILTER_STATUS_OPTIONS = ['All', 'Approved', 'Pending', 'Rejected'];

const LOAN_TYPE_OPTIONS = ['All', 'Fixed Rate', 'Adjustable'];

const STATUS_BADGE = {
  Approved: 'bg-green-50 text-green-600 border border-green-200',
  Pending: 'bg-orange-50 text-orange-600 border border-orange-200',
  Rejected: 'bg-red-50 text-red-600 border border-red-200',
};

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-teal-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-rose-500',
];

const PAGE_SIZE = 8;


function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function formatUSD(n) {
  if (n === null || n === undefined || n === '') return '-';
  const value = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(value)) return '-';
  return '$' + value.toLocaleString('en-US');
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function formatRelativeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function normalizeApplication(application, index = 0) {
  const hasMortgageValues =
    application.mortgagePurchaseAmount != null ||
    application.mortgageDownPayment != null ||
    application.mortgageInterestRate != null ||
    application.mortgageLoanTerm != null;

  const hasRefinanceValues =
    application.refinanceLoanAmount != null ||
    application.refinanceHomeValue != null ||
    application.refinanceInterestRate != null ||
    application.refinanceFico != null ||
    application.refinanceLoanTerm != null;

  const mortgagePurchaseAmount =
    application.mortgagePurchaseAmount ?? application.mortgagePurchase ?? null;
  const mortgageDownPayment =
    application.mortgageDownPayment ?? application.downPayment ?? null;
  const mortgageInterestRate =
    application.mortgageInterestRate ?? application.interestRate ?? null;
  const mortgageLoanTerm =
    application.mortgageLoanTerm ?? application.loanTerm ?? null;
  const mortgagePrincipalInterest =
    application.mortgagePrincipalInterest ?? null;
  const mortgagePropertyTax = application.mortgagePropertyTax ?? null;
  const mortgageHomeInsurance = application.mortgageHomeInsurance ?? null;

  const refinanceLoanAmount = application.refinanceLoanAmount ?? null;
  const refinanceHomeValue = application.refinanceHomeValue ?? null;
  const refinanceInterestRate = application.refinanceInterestRate ?? null;
  const refinanceFico = application.refinanceFico ?? null;
  const refinanceLoanTerm = application.refinanceLoanTerm ?? null;
  const refinancePrincipalInterest = application.refinancePrincipalInterest ?? null;
  const refinancePropertyTax = application.refinancePropertyTax ?? null;
  const refinanceHomeInsurance = application.refinanceHomeInsurance ?? null;
  const refinanceHoa = application.refinanceHoa ?? null;

  const mortgageEstMonthly =
    application.mortgageEstMonthly ??
    (mortgagePurchaseAmount != null && mortgageDownPayment != null && mortgageInterestRate != null && mortgageLoanTerm != null
      ? Number(
          (
            calcPMT(
              Math.max(0, Number(mortgagePurchaseAmount) - Number(mortgageDownPayment)),
              Number(mortgageInterestRate),
              Number(mortgageLoanTerm),
            ) +
            (Number(mortgagePurchaseAmount) * 0.01) / 12 +
            150
          ).toFixed(2),
        )
      : null);

  const refinanceEstMonthly =
    application.refinanceEstMonthly ??
    (refinanceLoanAmount != null && refinanceInterestRate != null && refinanceLoanTerm != null && refinanceHomeValue != null
      ? Number(
          (
            calcPMT(
              Number(refinanceLoanAmount),
              Number(refinanceInterestRate),
              Number(refinanceLoanTerm),
            ) +
            (Number(refinanceHomeValue) * 0.01) / 12 +
            150
          ).toFixed(2),
        )
      : null);

  const selectedCalculatorType =
    application.selectedCalculatorType ||
    (hasMortgageValues && !hasRefinanceValues ? 'mortgage' : hasRefinanceValues && !hasMortgageValues ? 'refinance' : null);

  const status = application.status || 'Pending';

  return {
    id: application.id,
    refId: application.refId || `#MRT-${String(index + 1).padStart(4, '0')}`,
    name: application.fullName || '',
    email: application.email || '',
    phone: application.phoneNumber || '',
    submittedDate: formatDate(application.createdAt),
    submittedRelative: formatRelativeDate(application.createdAt),
    submittedTime: application.createdAt
      ? new Date(application.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      : '-',
    status,
    employmentStatus: application.employmentStatus || '',
    annualIncome: application.annualIncome ? Number(application.annualIncome) : null,
    loanAmount: application.desiredLoanAmount ? Number(application.desiredLoanAmount) : null,
    loanType: application.loanType || (selectedCalculatorType === 'mortgage' ? 'Mortgage Calculator' : selectedCalculatorType === 'refinance' ? 'Refinance Calculator' : '-'),
    loanTerm: application.loanTerm ? Number(application.loanTerm) : null,
    propertyType: application.propertyType || '',
    purchaseAmount: mortgagePurchaseAmount ? Number(mortgagePurchaseAmount) : null,
    downPayment: mortgageDownPayment ? Number(mortgageDownPayment) : null,
    mortgageRate: mortgageInterestRate ? Number(mortgageInterestRate) : null,
    mortgageTerm: mortgageLoanTerm ? Number(mortgageLoanTerm) : null,
    mortgageEstMonthly,
    mortgagePrincipalInterest: mortgagePrincipalInterest != null ? Number(mortgagePrincipalInterest) : null,
    mortgagePropertyTax: mortgagePropertyTax != null ? Number(mortgagePropertyTax) : null,
    mortgageHomeInsurance: mortgageHomeInsurance != null ? Number(mortgageHomeInsurance) : null,
    refinanceLoanAmount: refinanceLoanAmount != null ? Number(refinanceLoanAmount) : null,
    estimatedHomeValue: refinanceHomeValue != null ? Number(refinanceHomeValue) : null,
    refinanceRate: refinanceInterestRate != null ? Number(refinanceInterestRate) : null,
    fico: refinanceFico != null ? Number(refinanceFico) : null,
    refinanceTerm: refinanceLoanTerm != null ? Number(refinanceLoanTerm) : null,
    refinanceEstMonthly,
    refinancePrincipalInterest: refinancePrincipalInterest != null ? Number(refinancePrincipalInterest) : null,
    refinancePropertyTax: refinancePropertyTax != null ? Number(refinancePropertyTax) : null,
    refinanceHomeInsurance: refinanceHomeInsurance != null ? Number(refinanceHomeInsurance) : null,
    refinanceHoa: refinanceHoa != null ? Number(refinanceHoa) : null,
    customerMessage: application.message || '',
    selectedCalculatorType,
  };
}




const StatusBadge = memo(({ status }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
      STATUS_BADGE[status] ?? 'bg-gray-100 text-gray-600'
    }`}
  >
    <Plus size={10} aria-hidden='true' />
    {status}
  </span>
));
StatusBadge.displayName = 'StatusBadge';

const MENU_HEIGHT = 120; // estimated menu height in px

const ActionMenu = memo(({ application, onView, onDelete }) => {
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
        aria-label={`Actions for ${application.name}`}
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
              onView(application);
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
              onDelete(application.id);
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

const MortgageCalcSection = memo(({ app }) => {
  const hasMortgageData =
    app.purchaseAmount != null || app.downPayment != null || app.mortgageRate != null || app.mortgageTerm != null || app.mortgageEstMonthly != null;

  const principal =
    app.purchaseAmount != null && app.downPayment != null
      ? app.purchaseAmount - app.downPayment
      : null;

  const pni =
    principal != null && app.mortgageRate != null && app.mortgageTerm != null
      ? calcPMT(principal, app.mortgageRate, app.mortgageTerm)
      : null;

  const tax = app.purchaseAmount != null ? (app.purchaseAmount * 0.01) / 12 : null;
  const insurance = 150;
  const total =
    app.mortgageEstMonthly != null
      ? app.mortgageEstMonthly
      : pni != null && tax != null
      ? pni + tax + insurance
      : null;

  return (
    <div>
      <div className='flex items-center justify-between'>
        <SectionHeader
          icon={Calculator}
          title='Mortgage Calculator'
          iconBg='bg-blue-50'
          iconColor='text-blue-500'
        />
        {hasMortgageData && (
          <span className='ml-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100'>
            Has data
          </span>
        )}
      </div>
      <div className='border border-blue-100 rounded-xl p-4 space-y-4'>
        <InfoGrid>
          <InfoCell
            label='Purchase Amount'
            value={formatUSD(app.purchaseAmount)}
          />
          <InfoCell label='Down Payment' value={formatUSD(app.downPayment)} />
          <InfoCell label='Interest Rate' value={`${app.mortgageRate}%`} />
          <InfoCell label='Loan Term' value={`${app.mortgageTerm} Years`} />
        </InfoGrid>

        <div className='bg-blue-50 rounded-xl p-4 text-center'>
          <p className='text-xs text-gray-500 mb-1'>Est. Monthly Payment</p>
          <p className='text-2xl font-bold text-orange-500'>
            {total != null ? `$${Number(total).toFixed(2)}` : '-'}
          </p>
        </div>

        <InfoGrid>
          <InfoCell label='P&amp;I' value={pni != null ? `$${pni.toFixed(2)}` : '-'} />
          <InfoCell label='Property Tax' value={tax != null ? `$${tax.toFixed(2)}` : '$0.00'} />
          <InfoCell
            label='Home Insurance'
            value={`$${insurance.toFixed(2)}`}
            valueClass='col-span-2'
          />
        </InfoGrid>
      </div>
    </div>
  );
});
MortgageCalcSection.displayName = 'MortgageCalcSection';

const RefinanceCalcSection = memo(({ app }) => {
  const hasRefinanceData =
    app.refinanceLoanAmount != null || app.estimatedHomeValue != null || app.refinanceRate != null || app.refinanceTerm != null || app.refinanceEstMonthly != null;

  const pni =
    app.refinanceLoanAmount != null && app.refinanceRate != null && app.refinanceTerm != null
      ? calcPMT(app.refinanceLoanAmount, app.refinanceRate, app.refinanceTerm)
      : null;

  const tax = app.estimatedHomeValue != null ? (app.estimatedHomeValue * 0.01) / 12 : null;
  const insurance = 150;
  const hoa = app.refinanceHoa != null ? app.refinanceHoa : 0;
  const total =
    app.refinanceEstMonthly != null
      ? app.refinanceEstMonthly
      : pni != null && tax != null
      ? pni + tax + insurance + hoa
      : null;

  return (
    <div>
      <div className='flex items-center justify-between'>
        <SectionHeader
          icon={RefreshCcw}
          title='Refinance Calculator'
          iconBg='bg-blue-50'
          iconColor='text-blue-500'
        />
        {hasRefinanceData && (
          <span className='ml-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100'>
            Has data
          </span>
        )}
      </div>
      <div className='border border-blue-100 rounded-xl p-4 space-y-4'>
        <InfoGrid>
          <InfoCell
            label='Loan Amount'
            value={formatUSD(app.refinanceLoanAmount)}
          />
          <InfoCell
            label='Est. Home Value'
            value={formatUSD(app.estimatedHomeValue)}
          />
          <InfoCell label='Interest Rate' value={`${app.refinanceRate}%`} />
          <InfoCell label='FICO Score' value={app.fico} />
          <InfoCell label='Loan Term' value={`${app.refinanceTerm} Years`} />
        </InfoGrid>

        <InfoGrid>
          <InfoCell
            label='P&amp;I'
            value={pni != null ? `$${pni.toFixed(2)}` : '-'}
            valueClass='text-orange-500'
          />
          <InfoCell
            label='Property Tax'
            value={tax != null ? `$${tax.toFixed(2)}` : '$0.00'}
            valueClass='text-orange-500'
          />
          <InfoCell
            label='Home Owner Insurance'
            value={`$${insurance.toFixed(2)}`}
          />
          <InfoCell label='HOA' value={`$${hoa.toFixed(2)}`} />
        </InfoGrid>

        <div className='bg-blue-50 rounded-xl p-4 text-center'>
          <p className='text-xs text-gray-500 mb-1'>Est. Monthly Payment</p>
          <p className='text-2xl font-bold text-orange-500'>
            {total != null ? `$${Number(total).toFixed(2)}` : '-'}
          </p>
        </div>
      </div>
    </div>
  );
});
RefinanceCalcSection.displayName = 'RefinanceCalcSection';

const DetailModal = memo(({ application, onClose }) => {
  if (!application) return null;
  const app = application;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto relative shadow-xl animate-[slideUp_0.3s_ease-out]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className='sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10'>
          <div className='flex items-center gap-3'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${getAvatarColor(app.name)}`}
            >
              {getInitials(app.name)}
            </div>
            <div>
              <div className='flex items-center gap-2 flex-wrap'>
                <h3 className='text-base font-bold text-gray-900'>
                  {app.name}
                </h3>
              </div>
              <p className='text-xs text-gray-400 font-mono'>{app.refId}</p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close'
            className='w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors'
          >
            <X size={16} />
          </button>
        </div>

        <div className='p-6 space-y-7'>
          {/* 1. Personal Information */}
          <div>
            <SectionHeader
              icon={User}
              title='Personal Information'
              iconBg='bg-blue-50'
              iconColor='text-blue-500'
            />
            <InfoGrid>
              <InfoCell label='Full Name' value={app.name} />
              <InfoCell label='Email Address' value={app.email} />
              <InfoCell label='Phone Number' value={app.phone} />
              <InfoCell
                label='Submitted'
                value={`${app.submittedDate}${app.submittedTime ? ` · ${app.submittedTime}` : ''}`}
              />
            </InfoGrid>
          </div>

          {/* 2. Employment & Income */}
          <div>
            <SectionHeader
              icon={Briefcase}
              title='Employment &amp; Income'
              iconBg='bg-green-50'
              iconColor='text-green-600'
            />
            <InfoGrid>
              <InfoCell
                label='Employment Status'
                value={app.employmentStatus}
              />
              <InfoCell
                label='Annual Income'
                value={formatUSD(app.annualIncome)}
              />
            </InfoGrid>
          </div>

          {/* 3. Loan Request */}
          <div>
            <SectionHeader
              icon={CreditCard}
              title='Loan Request'
              iconBg='bg-orange-50'
              iconColor='text-orange-500'
            />
            <InfoGrid>
              <InfoCell label='Loan Amount' value={formatUSD(app.loanAmount)} />
              <InfoCell label='Loan Type' value={app.loanType} />
              <InfoCell label='Loan Term' value={`${app.loanTerm} Years`} />
              <InfoCell label='Property Type' value={app.propertyType} />
            </InfoGrid>
          </div>

          {/* 4. Mortgage Calculator */}
          <MortgageCalcSection app={app} />

          {/* 5. Refinance Calculator */}
          <RefinanceCalcSection app={app} />

          {/* 6. Customer Message */}
          {app.customerMessage && (
            <div>
              <SectionHeader
                icon={MessageCircle}
                title='Customer Message'
                iconBg='bg-purple-50'
                iconColor='text-purple-600'
              />
              <div className='border border-gray-100 rounded-xl p-4'>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  {app.customerMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
DetailModal.displayName = 'DetailModal';


const MortgageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(
      API_ENDPOINTS.MORTGAGE_APPLICATIONS.LIST,
      {
        params: { page: currentPage, limit: PAGE_SIZE },
      },
    );

    if (error) {
      toast.error(error.message || 'Failed to load mortgage applications.');
      setApplications([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const payload = data?.data ?? data ?? {};
    const list = Array.isArray(payload?.applications) ? payload.applications : [];

    const normalized = list.map((application, index) =>
      normalizeApplication(application, index),
    );

    setApplications(normalized);
    setTotalItems(payload?.pagination?.total ?? normalized.length);
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filtered = useMemo(
    () =>
      applications.filter(
        (a) => statusFilter === 'All' || a.status === statusFilter,
      ),
    [applications, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleStatusFilter = useCallback((val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      // call backend delete
      const { data, error } = await httpMethods.delete(
        API_ENDPOINTS.MORTGAGE_APPLICATIONS.DELETE(id),
      );

      if (error) {
        toast.error(error.message || 'Failed to delete application.');
        return;
      }

      // remove locally
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setTotalItems((t) => Math.max(0, t - 1));
      setCurrentPage((p) => {
        const remaining = Math.max(0, totalItems - 1);
        const maxPage = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
        return Math.min(p, maxPage);
      });

      toast.success('Application deleted.');
    },
    [totalItems],
  );

  const handleView = useCallback((application) => {
    setSelectedApplication(application);
  }, []);

  const handlePrev = useCallback(
    () => setCurrentPage((p) => Math.max(1, p - 1)),
    [],
  );
  const handleNext = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

  const startItem =
    filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <div className='space-y-8'>
      {/* Page header */}
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Mortgage Applications
        </h1>
        <p className='text-gray-500 text-base mt-1'>
          Review, approve, and manage all submitted mortgage applications from
          one place.
        </p>
      </div>

      {/* Stat cards removed */}

      {/* Table card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        {/* Filter row */}
        <div className='px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3'>
          <div className='flex items-center gap-1.5 text-sm text-gray-500 font-medium shrink-0'>
            <Filter size={15} aria-hidden='true' />
            <span>Filters:</span>
          </div>

          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            {/* Status filter */}
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                aria-label='Filter by status'
                className='w-full sm:w-auto appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-700 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
              >
                {FILTER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'All' ? 'All Statuses' : opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400'
                aria-hidden='true'
              />
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-100'>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Applicant
                </th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Contact
                </th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Loan Amount
                </th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Loan Type
                </th>
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Submission Date
                </th>
                {/* Status column removed */}
                <th className='px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-16 text-center text-gray-400 text-sm'
                  >
                    Loading mortgage applications...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-16 text-center text-gray-400 text-sm'
                  >
                    No applications match the selected filters.
                  </td>
                </tr>
              ) : (
                paged.map((app) => (
                  <tr
                    key={app.id}
                    className='hover:bg-gray-50/60 transition-colors'
                  >
                    {/* Applicant */}
                    <td className='px-6 py-4'>
                      <div className='min-w-0'>
                        <p className='font-semibold text-gray-900 truncate'>
                          {app.name}
                        </p>
                        <p className='text-xs text-gray-400 font-mono'>
                          {app.refId}
                        </p>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className='px-6 py-4'>
                      <p className='text-gray-700 truncate'>{app.email}</p>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        {app.phone}
                      </p>
                    </td>

                    {/* Loan Amount */}
                    <td className='px-6 py-4'>
                      <span className='font-semibold text-gray-900'>
                        {formatUSD(app.loanAmount)}
                      </span>
                    </td>

                    {/* Loan Type */}
                    <td className='px-6 py-4'>
                      <p className='text-gray-700'>{app.loanType}</p>
                      <p className='text-xs text-gray-400'>{app.loanTerm} yr</p>
                    </td>

                    {/* Submission Date */}
                    <td className='px-6 py-4'>
                      <p className='text-gray-700'>{app.submittedDate}</p>
                      <p className='text-xs text-gray-400'>
                        {app.submittedRelative}
                      </p>
                    </td>

                    {/* Action */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        <ActionMenu
                          application={app}
                          onView={handleView}
                          onDelete={handleDelete}
                        />
                      </div>
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
              Loading mortgage applications...
            </p>
          ) : paged.length === 0 ? (
            <p className='px-4 py-12 text-center text-gray-400 text-sm'>
              No applications match the selected filters.
            </p>
          ) : (
            paged.map((app) => (
              <div key={app.id} className='px-4 py-4 space-y-3'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-900 truncate'>
                      {app.name}
                    </p>
                    <p className='text-xs text-gray-400 font-mono'>
                      {app.refId}
                    </p>
                  </div>
                  <ActionMenu
                    application={app}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                </div>
                <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
                  <div>
                    <p className='text-xs text-gray-400'>Email</p>
                    <p className='text-gray-700 truncate'>{app.email}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>Phone</p>
                    <p className='text-gray-700'>{app.phone}</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>Loan Amount</p>
                    <p className='font-semibold text-gray-900'>
                      {formatUSD(app.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>Loan Type</p>
                    <p className='text-gray-700'>
                      {app.loanType} / {app.loanTerm} yr
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400'>Submitted</p>
                    <p className='text-gray-700'>{app.submittedDate}</p>
                  </div>
                  {/* Status cell removed for mobile */}
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
          total={filtered.length}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* Detail modal */}
      {selectedApplication && (
        <DetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default MortgageApplications;
