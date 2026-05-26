import React, { memo, useState, useCallback, useEffect } from 'react';
import { MapPin, BedDouble, Bath, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedButton from '../shared/AnimatedButton';
import Pagination from '../shared/Pagination';
import Modal from '../shared/Modal';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';

const ASSETS = {
  proj1:
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  proj2:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  proj3:
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  proj4:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  proj5:
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  proj6:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  proj7:
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  proj8:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
};

const ALL_PROJECTS = [
  {
    id: 1,
    name: 'Skyline Residences',
    developer: 'Premier Developers Inc.',
    location: 'Downtown Miami, FL',
    progress: 65,
    completion: 'Q4 2026',
    units: 48,
    price: '$425,000',
    img: ASSETS.proj1,
    beds: 3,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      'Luxurious waterfront residences offering panoramic skyline views and world-class amenities in the heart of Miami.',
    roi: '18-24%',
    areaGrowth: '+15% YoY',
  },
  {
    id: 2,
    name: 'Greenwood Estates',
    developer: 'EcoLiving Communities',
    location: 'Portland, OR',
    progress: 20,
    completion: 'Q2 2027',
    units: 85,
    price: '$385,000',
    img: ASSETS.proj2,
    beds: 4,
    bathrooms: 3,
    area: '5x7 sqft',
    description:
      "Eco-friendly sustainable community with LEED-certified construction and lush green spaces in Portland's thriving suburbs.",
    roi: '12-18%',
    areaGrowth: '+18% YoY',
  },
  {
    id: 3,
    name: 'Harbor View Towers',
    developer: 'Coastal Builders LLC',
    location: 'Boston, MA',
    progress: 88,
    completion: 'Q1 2027',
    units: 12,
    price: '$675,000',
    img: ASSETS.proj3,
    beds: 2,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      'Premium harbor-facing towers in Boston offering direct waterfront access, concierge services, and luxury finishes.',
    roi: '20-28%',
    areaGrowth: '+22% YoY',
  },
  {
    id: 4,
    name: 'Tech Park Plaza',
    developer: 'Innovation Properties',
    location: 'Austin, TX',
    progress: 55,
    completion: 'Q3 2026',
    units: 32,
    price: '$525,000',
    img: ASSETS.proj4,
    beds: 3,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      "Mixed-use development near Austin's tech hub with smart home integration and dedicated co-working spaces.",
    roi: '22-28%',
    areaGrowth: '+20% YoY',
  },
  {
    id: 5,
    name: 'Harbor View Towers',
    developer: 'Coastal Builders LLC',
    location: 'Boston, MA',
    progress: 88,
    completion: 'Q1 2027',
    units: 12,
    price: '$675,000',
    img: ASSETS.proj5,
    beds: 2,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      'Premium harbor-facing towers in Boston offering direct waterfront access, concierge services, and luxury finishes.',
    roi: '20-28%',
    areaGrowth: '+22% YoY',
  },
  {
    id: 6,
    name: 'Tech Park Plaza',
    developer: 'Innovation Properties',
    location: 'Austin, TX',
    progress: 55,
    completion: 'Q3 2026',
    units: 32,
    price: '$525,000',
    img: ASSETS.proj6,
    beds: 3,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      "Mixed-use development near Austin's tech hub with smart home integration and dedicated co-working spaces.",
    roi: '22-28%',
    areaGrowth: '+20% YoY',
  },
  {
    id: 7,
    name: 'Harbor View Towers',
    developer: 'Coastal Builders LLC',
    location: 'Boston, MA',
    progress: 88,
    completion: 'Q1 2027',
    units: 12,
    price: '$675,000',
    img: ASSETS.proj7,
    beds: 2,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      'Premium harbor-facing towers in Boston offering direct waterfront access, concierge services, and luxury finishes.',
    roi: '20-28%',
    areaGrowth: '+22% YoY',
  },
  {
    id: 8,
    name: 'Tech Park Plaza',
    developer: 'Innovation Properties',
    location: 'Austin, TX',
    progress: 55,
    completion: 'Q3 2026',
    units: 32,
    price: '$525,000',
    img: ASSETS.proj8,
    beds: 3,
    bathrooms: 2,
    area: '5x7 sqft',
    description:
      "Mixed-use development near Austin's tech hub with smart home integration and dedicated co-working spaces.",
    roi: '22-28%',
    areaGrowth: '+20% YoY',
  },
];

const PAYMENT_MILESTONES = [
  { milestone: 'Initial Deposit (5%)', timing: 'At Booking' },
  { milestone: 'Foundation Payment (10%)', timing: 'Foundation Complete' },
  { milestone: 'Structure Payment (20%)', timing: 'Structure Complete' },
  { milestone: 'Pre-Completion (30%)', timing: '90 Days Before Handover' },
  { milestone: 'Final Payment (35%)', timing: 'At Completion' },
];

const MODAL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'payment', label: 'Payment Plan' },
  { id: 'book', label: 'Book Now' },
];

const INITIAL_FORM = { name: '', email: '', phone: '' };
const PAGE_SIZE = 10;

const formatArea = (value) => {
  if (value == null || value === '' || value === '—') return '—';
  const text = String(value).trim();
  if (
    text.toLowerCase().includes('sqft') ||
    text.toLowerCase().includes('sq ft') ||
    text.toLowerCase().includes('m²') ||
    text.toLowerCase().includes('m2') ||
    text.toLowerCase().includes('sqm')
  ) {
    return text;
  }
  return `${text} sqft`;
};

const normalizeConstruction = (construction) => ({
  id: construction.id,
  name: construction.title || '',
  developer: construction.developer || '',
  location: construction.location || '',
  price: construction.price
    ? `$${Number(construction.price).toLocaleString('en-US')}`
    : '$0',
  img: construction.images?.[0] || '',
  beds: construction.bedrooms ?? '--',
  bathrooms: construction.bathrooms ?? '--',
  area: construction.area || '--',
  description: construction.description || '',
  roi: construction.expectedRoi || '-',
  areaGrowth: construction.areaGrowth || '-',
  paymentPlan: [
    { milestone: construction.atBooking || '-', timing: 'At Booking' },
    {
      milestone: construction.foundationComplete || '-',
      timing: 'Foundation Complete',
    },
    {
      milestone: construction.structureComplete || '-',
      timing: 'Structure Complete',
    },
    {
      milestone: construction.ninetyDaysHandover || '-',
      timing: '90 Days Before Handover',
    },
    { milestone: construction.atCompletion || '-', timing: 'At Completion' },
  ],
});

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors';

// ---------------------------------------------------------------------------
// ProjectModal
// ---------------------------------------------------------------------------
const ProjectModal = memo(({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value,
    }));
  }, []);

  const handleBookSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
        toast.error('Please fill in all required fields.');
        return;
      }

      setSubmitting(true);

      const payload = {
        fullName: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phone.trim(),
      };

      const { error } = await httpMethods.post(
        API_ENDPOINTS.CONSTRUCTIONS.REGISTER(project.id),
        payload,
      );

      setSubmitting(false);

      if (error) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            'Failed to submit booking request.',
        );
        return;
      }

      toast.success(
        `Booking request for "${project.name}" submitted! We'll contact you within 24 hours.`,
      );
        setForm(INITIAL_FORM);
      onClose();
    },
    [form, project.id, project.name, onClose],
  );

  return (
    <div className='flex flex-col gap-0'>
      <div
        className='flex border border-gray-200 rounded-lg overflow-hidden mb-6'
        role='tablist'
        aria-label='Project details tabs'
      >
        {MODAL_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            type='button'
            role='tab'
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${idx > 0 ? 'border-l border-gray-200' : ''} ${activeTab === tab.id ? 'bg-indigo-dark text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className='flex flex-col gap-5'>
          <div className='h-52 rounded-lg overflow-hidden shrink-0'>
            <img
              src={project.img}
              alt={project.name}
              className='size-full object-cover'
            />
          </div>
          <div className='flex justify-between gap-4'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
                Developer
              </span>
              <span className='text-sm font-semibold text-ink'>
                {project.developer}
              </span>
            </div>
            <div className='flex flex-col gap-0.5 text-right'>
              <span className='text-xs text-gray-400 font-medium uppercase tracking-wide'>
                Location
              </span>
              <span className='text-sm font-semibold text-ink'>
                {project.location}
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-1.5'>
            <h3 className='font-semibold text-base text-ink'>Description</h3>
            <p className='text-sm text-muted-slate leading-relaxed'>
              {project.description}
            </p>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col gap-1'>
              <span className='text-xs text-gray-500 font-medium'>
                Expected ROI
              </span>
              <span className='text-2xl font-bold text-green-600 leading-tight'>
                {project.roi}
              </span>
            </div>
            <div className='bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col gap-1'>
              <span className='text-xs text-gray-500 font-medium'>
                Area Growth
              </span>
              <span className='text-2xl font-bold text-blue-600 leading-tight'>
                {project.areaGrowth}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className='flex flex-col gap-4'>
          <h3 className='text-base font-semibold text-ink'>
            Payment Plan Breakdown
          </h3>
          <div className='rounded-lg border border-gray-200 overflow-hidden'>
            {(project.paymentPlan || PAYMENT_MILESTONES).map((row, idx) => {
              const isLast =
                idx === (project.paymentPlan || PAYMENT_MILESTONES).length - 1;
              return (
                <div
                  key={row.milestone}
                  className={`flex items-center justify-between px-4 py-3 ${idx > 0 ? 'border-t border-gray-100' : ''} ${isLast ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <span
                    className={`text-sm ${isLast ? 'font-bold text-ink' : 'font-medium text-ink'}`}
                  >
                    {row.milestone}
                  </span>
                  <span
                    className={`text-sm ${isLast ? 'font-bold text-ink' : 'text-gray-600'}`}
                  >
                    {row.timing}
                  </span>
                </div>
              );
            })}
          </div>
          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <p className='text-sm text-green-800 leading-relaxed'>
              <span className='font-semibold'>Flexible Financing:</span> We
              offer various payment plans and can connect you with preferred
              lenders for mortgage pre-approval.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'book' && (
        <form
          onSubmit={handleBookSubmit}
          className='flex flex-col gap-4'
          noValidate
        >
          <p className='text-sm text-muted-slate leading-relaxed'>
            Reserve your unit at <strong>{project.name}</strong>. Our team will
            reach out within 24 hours.
          </p>
          <div className='flex flex-col gap-1.5'>
            <label htmlFor='book-name' className='text-sm font-medium text-ink'>
              Full Name{' '}
              <span className='text-red-500' aria-hidden='true'>
                *
              </span>
            </label>
            <input
              id='book-name'
              name='name'
              type='text'
              value={form.name}
              onChange={handleFieldChange}
              placeholder='Enter your full name'
              className={inputClass}
              autoComplete='name'
              required
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='book-email'
              className='text-sm font-medium text-ink'
            >
              Email Address{' '}
              <span className='text-red-500' aria-hidden='true'>
                *
              </span>
            </label>
            <input
              id='book-email'
              name='email'
              type='email'
              value={form.email}
              onChange={handleFieldChange}
              placeholder='Enter your email address'
              className={inputClass}
              autoComplete='email'
              required
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='book-phone'
              className='text-sm font-medium text-ink'
            >
              Phone Number{' '}
              <span className='text-red-500' aria-hidden='true'>
                *
              </span>
            </label>
            <input
              id='book-phone'
              name='phone'
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              value={form.phone}
              onChange={handleFieldChange}
              placeholder='Enter your phone number'
              className={inputClass}
              autoComplete='tel'
              required
            />
          </div>
          <AnimatedButton
            type='submit'
            disabled={submitting}
            className='inline-flex items-center justify-center w-full bg-cta-orange hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-150'
          >
            {submitting ? 'Submitting...' : 'Submit Booking Request'}
          </AnimatedButton>
        </form>
      )}
    </div>
  );
});
ProjectModal.displayName = 'ProjectModal';

// ---------------------------------------------------------------------------
// ProjectCard
// ---------------------------------------------------------------------------
const ProjectCard = memo(({ project, onViewProject }) => {
  const { name, developer, location, beds, bathrooms, area, price, img } =
    project;
  return (
    <article className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col'>
      <div className='relative h-56 shrink-0'>
        <img
          src={img}
          alt={name}
          className='absolute inset-0 size-full object-cover'
          loading='lazy'
        />
      </div>
      <div className='flex flex-col p-5 flex-1'>
        <h2 className='font-bold text-ink text-lg leading-6 mb-1'>{name}</h2>
        <p className='text-muted-slate text-sm leading-5 mb-2'>{developer}</p>
        <div className='flex items-center gap-1.5 mb-5'>
          <MapPin
            size={14}
            className='text-muted-slate shrink-0'
            aria-hidden='true'
          />
          <span className='text-muted-slate text-sm leading-5'>{location}</span>
        </div>
        <div className='border-t border-gray-100 mb-4' />
        <div className='flex items-center gap-5 mb-5'>
          <div className='flex items-center gap-1.5'>
            <BedDouble
              size={15}
              className='text-indigo-dark shrink-0'
              aria-hidden='true'
            />
            <span className='text-sm text-muted-slate'>{beds} Beds</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Bath
              size={15}
              className='text-indigo-dark shrink-0'
              aria-hidden='true'
            />
            <span className='text-sm text-muted-slate'>
              {bathrooms} Bathrooms
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Maximize2
              size={14}
              className='text-indigo-dark shrink-0'
              aria-hidden='true'
            />
            <span className='text-sm text-muted-slate'>
              {formatArea(area)}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between mt-auto pt-4 border-t border-gray-100'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-muted-slate text-xs'>Starting From</span>
            <span className='font-bold text-xl text-deep-navy leading-7'>
              {price}
            </span>
          </div>
          <AnimatedButton
            onClick={() => onViewProject(project)}
            className='inline-flex items-center justify-center bg-cta-orange hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors duration-150 shrink-0 cursor-pointer'
          >
            View Project
          </AnimatedButton>
        </div>
      </div>
    </article>
  );
});
ProjectCard.displayName = 'ProjectCard';

// ---------------------------------------------------------------------------
// ProjectsSection
// ---------------------------------------------------------------------------
const ProjectsSection = memo(() => {
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(API_ENDPOINTS.CONSTRUCTIONS.LIST, {
      params: { page, limit: PAGE_SIZE },
    });

    if (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to load projects.');
      setProjects([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    const payload = data?.data ?? data ?? {};
    const constructions = Array.isArray(payload?.constructions)
      ? payload.constructions
      : [];
    setProjects(constructions.map(normalizeConstruction));
    setTotalPages(payload?.pagination?.totalPages ?? 1);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleViewProject = useCallback((project) => {
    setSelectedProject(project);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <section
      id='projects'
      className='bg-white py-16 lg:py-20'
      aria-labelledby='projects-heading'
    >
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {loading ? (
            <p className='sm:col-span-2 text-center text-gray-400 py-12 text-sm'>
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <p className='sm:col-span-2 text-center text-gray-400 py-12 text-sm'>
              No projects found.
            </p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewProject={handleViewProject}
              />
            ))
          )}
        </div>
        <div className='flex justify-center'>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedProject?.name ?? ''}
        size='sm'
      >
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleCloseModal} />
        )}
      </Modal>
    </section>
  );
});
ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
