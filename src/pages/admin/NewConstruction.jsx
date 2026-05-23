import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  MapPin,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  CloudUpload,
  FileText,
  BedDouble,
  Bath,
  Maximize2,
} from 'lucide-react';
import AnimatedButton from '../../components/shared/AnimatedButton';
import { ROUTES } from '../../config';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';


const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Skyline Residences',
    company: 'Premier Developers Inc.',
    location: 'Downtown Miami, FL',
    price: 425000,
    beds: 3,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description:
      'Luxury high-rise residences in the heart of downtown Miami with panoramic ocean views and world-class amenities including a rooftop infinity pool, concierge services, and smart home integration.',
    expectedRoi: '18--24%',
    areaGrowth: '+15% YoY',
  },
  {
    id: 2,
    name: 'Greenwood Estates',
    company: 'EcoLiving Communities',
    location: 'Portland, OR',
    price: 385000,
    beds: 4,
    bathrooms: 3,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    description:
      'Eco-friendly suburban estates with green-certified construction and community gardens in a thriving Portland neighborhood, designed to minimize environmental footprint.',
    expectedRoi: '14--20%',
    areaGrowth: '+12% YoY',
  },
  {
    id: 3,
    name: 'Harbor View Towers',
    company: 'Coastal Builders LLC',
    location: 'Boston, MA',
    price: 675000,
    beds: 2,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    description: `Modern waterfront towers offering stunning harbor views, premium finishes, and direct access to Boston's waterfront district with private marina slips.`,
    expectedRoi: '20--26%',
    areaGrowth: '+18% YoY',
  },
  {
    id: 4,
    name: 'Tech Park Plaza',
    company: 'Innovation Properties',
    location: 'Austin, TX',
    price: 525000,
    beds: 3,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    description: `Mixed-use development near tech hub with smart home integration, co-working spaces, and retail amenities -- positioned for Austin's booming innovation economy.`,
    expectedRoi: '22-28%',
    areaGrowth: '+20% YoY',
  },
  {
    id: 5,
    name: 'Urban Heights',
    company: 'Metro Construction Group',
    location: 'New York, NY',
    price: 895000,
    beds: 2,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description: `Premium urban skyscraper in Manhattan's thriving tech corridor, offering unparalleled city views, state-of-the-art facilities, and direct subway access.`,
    expectedRoi: '25--32%',
    areaGrowth: '+22% YoY',
  },
  {
    id: 6,
    name: 'Lakeside Manor',
    company: 'Pacific Coast Builders',
    location: 'Seattle, WA',
    price: 575000,
    beds: 3,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    description:
      'Serene lakeside living with contemporary architectural design, surrounded by the natural beauty of the Pacific Northwest and private waterfront access.',
    expectedRoi: '16--22%',
    areaGrowth: '+14% YoY',
  },
  {
    id: 7,
    name: 'Summit Ridge',
    company: 'Altitude Development Co.',
    location: 'Denver, CO',
    price: 445000,
    beds: 3,
    bathrooms: 3,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    description:
      'Mountain-inspired residences offering breathtaking Rocky Mountain views, premium ski-in/ski-out access, and year-round resort-style amenities.',
    expectedRoi: '17--23%',
    areaGrowth: '+16% YoY',
  },
  {
    id: 8,
    name: 'Riverside Lofts',
    company: 'Delta Construction Corp.',
    location: 'Chicago, IL',
    price: 725000,
    beds: 2,
    bathrooms: 1,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    description: `Industrial-chic loft conversions on the Chicago Riverwalk with open-plan living, exposed brick, and direct access to the city's premier waterfront trail.`,
    expectedRoi: '19--25%',
    areaGrowth: '+17% YoY',
  },
  {
    id: 9,
    name: 'Oakwood Village',
    company: 'Heritage Developers',
    location: 'Nashville, TN',
    price: 365000,
    beds: 4,
    bathrooms: 3,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description: `Charming craftsman-style community in Nashville's fastest-growing suburb, close to music venues, top-rated dining, and major employment centers.`,
    expectedRoi: '15--21%',
    areaGrowth: '+13% YoY',
  },
  {
    id: 10,
    name: 'The Pinnacle',
    company: 'Apex Real Estate Group',
    location: 'Los Angeles, CA',
    price: 1250000,
    beds: 3,
    bathrooms: 3,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    description:
      'Iconic luxury tower in West LA featuring 24/7 concierge, rooftop infinity pool, private cinema, and panoramic ocean-to-mountain views from every unit.',
    expectedRoi: '28--35%',
    areaGrowth: '+25% YoY',
  },
  {
    id: 11,
    name: 'Coral Bay Residences',
    company: 'Seaside Construction',
    location: 'Tampa, FL',
    price: 495000,
    beds: 3,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    description:
      'Coastal living redefined with private marina access, resort-style pools, and premium waterfront finishes throughout every unit.',
    expectedRoi: '16-22%',
    areaGrowth: '+14% YoY',
  },
  {
    id: 12,
    name: 'Maple Grove Estates',
    company: 'Green Valley Builders',
    location: 'Minneapolis, MN',
    price: 415000,
    beds: 4,
    bathrooms: 3,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    description: `Family-friendly suburban community with top-rated schools, parks, and energy-efficient homes engineered for Minnesota's demanding climate.`,
    expectedRoi: '13--19%',
    areaGrowth: '+11% YoY',
  },
  {
    id: 13,
    name: 'Silver Creek Heights',
    company: 'Horizon Properties',
    location: 'Phoenix, AZ',
    price: 485000,
    beds: 3,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    description: `Desert-modern residences featuring greywater recycling, solar panels, and resort-style outdoor living spaces designed for Phoenix's vibrant lifestyle.`,
    expectedRoi: '18--24%',
    areaGrowth: '+16% YoY',
  },
  {
    id: 14,
    name: 'The Metropolitan',
    company: 'Urban Core Development',
    location: 'San Francisco, CA',
    price: 1450000,
    beds: 2,
    bathrooms: 2,
    area: '5x7 m²',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    description: `SoMa district's premier mixed-use high-rise combining tech-forward amenities, premium ground-floor retail, and luxury residences steps from the Bay.`,
    expectedRoi: '30--38%',
    areaGrowth: '+28% YoY',
  },
  {
    id: 15,
    name: 'Willow Brook Commons',
    company: "Nature's Edge Builders",
    location: 'Raleigh, NC',
    price: 355000,
    beds: 3,
    bathrooms: 2,
    area: '1,850 sqft',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
    description: `Wooded retreat community in Raleigh's Research Triangle, blending nature-inspired architecture with proximity to the region's top tech employers.`,
    expectedRoi: '14--20%',
    areaGrowth: '+12% YoY',
  },
  {
    id: 16,
    name: 'Ironwood Villas',
    company: 'Premier Construction LLC',
    location: 'Atlanta, GA',
    price: 535000,
    beds: 4,
    bathrooms: 3,
    area: '2,600 sqft',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    description: `Upscale villa community in Atlanta's premier Buckhead district, featuring private landscaped courtyards and fully bespoke interior design packages.`,
    expectedRoi: '19--25%',
    areaGrowth: '+17% YoY',
  },
];

const PAGE_SIZE = 6;

const normalizeConstruction = (construction) => ({
  id: construction.id,
  name: construction.title || '',
  company: construction.developer || '',
  location: construction.location || '',
  price: parseFloat(String(construction.price || 0)) || 0,
  beds: construction.bedrooms,
  bathrooms: construction.bathrooms,
  area: construction.area || '',
  image: construction.images?.[0] || '',
  description: construction.description || '',
  expectedRoi: construction.expectedRoi || '',
  areaGrowth: construction.areaGrowth || '',
  payment: {
    booking: construction.atBooking || '',
    foundation: construction.foundationComplete || '',
    structure: construction.structureComplete || '',
    preCompletion: construction.ninetyDaysHandover || '',
    atCompletion: construction.atCompletion || '',
    note: construction.paymentNote || '',
  },
});


function formatUSD(n) {
  return '$' + n.toLocaleString('en-US');
}

function getPageRange(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '...', total];
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}


const ProjectCard = memo(({ project, onDelete, onEdit, onView }) => (
  <article className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col'>
    {/* Image */}
    <div className='relative h-56 shrink-0'>
      <img
        src={project.image}
        alt={project.name}
        className='absolute inset-0 size-full object-cover'
        loading='lazy'
      />
    </div>

    {/* Body */}
    <div className='flex flex-col p-5 flex-1'>
      {/* Name */}
      <h3 className='font-bold text-ink text-lg leading-6 mb-1'>
        {project.name}
      </h3>

      {/* Developer */}
      <p className='text-muted-slate text-sm leading-5 mb-2'>
        {project.company}
      </p>

      {/* Location */}
      <div className='flex items-center gap-1.5 mb-5'>
        <MapPin
          size={14}
          className='text-muted-slate shrink-0'
          aria-hidden='true'
        />
        <span className='text-muted-slate text-sm leading-5'>
          {project.location}
        </span>
      </div>

      {/* Divider */}
      <div className='border-t border-gray-100 mb-4' />

      {/* Stats row: beds / bathrooms / area */}
      <div className='flex items-center gap-5 mb-5'>
        <div className='flex items-center gap-1.5'>
          <BedDouble
            size={15}
            className='text-indigo-dark shrink-0'
            aria-hidden='true'
          />
          <span className='text-sm text-muted-slate'>
            {project.beds ?? '--'} Beds
          </span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Bath
            size={15}
            className='text-indigo-dark shrink-0'
            aria-hidden='true'
          />
          <span className='text-sm text-muted-slate'>
            {project.bathrooms ?? '--'} Bathrooms
          </span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Maximize2
            size={14}
            className='text-indigo-dark shrink-0'
            aria-hidden='true'
          />
          <span className='text-sm text-muted-slate'>
            {project.area ?? '--'}
          </span>
        </div>
      </div>

      {/* Price + View Project */}
      <div className='border-t border-gray-100 mt-auto pt-4 flex items-center justify-between gap-3 flex-wrap'>
        {/* Price */}
        <div className='flex flex-col gap-0.5'>
          <p className='text-sm text-slate-500'>Starting From</p>
          <p className='text-2xl font-bold text-blue-900 leading-8'>
            {formatUSD(project.price)}
          </p>
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-2.5 flex-wrap'>
          <AnimatedButton
            onClick={() => onDelete(project.id)}
            className='flex items-center gap-2 px-5 py-2 text-sm font-medium border border-violet-700 text-violet-700 rounded-lg hover:bg-violet-50 transition-colors cursor-pointer'
          >
            <Trash2 size={16} aria-hidden='true' />
            Delete
          </AnimatedButton>
          <AnimatedButton
            onClick={() => onEdit(project.id)}
            className='flex items-center gap-2 px-5 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer'
          >
            <Pencil size={16} aria-hidden='true' />
            Edit
          </AnimatedButton>
          <AnimatedButton
            onClick={() => onView(project.id)}
            className='px-5 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer'
          >
            View Project
          </AnimatedButton>
        </div>
      </div>
    </div>
  </article>
));
ProjectCard.displayName = 'ProjectCard';


const EMPTY_FORM = {
  title: '',
  developer: '',
  location: '',
  price: '',
  beds: '',
  bathrooms: '',
  area: '',
  description: '',
  expectedRoi: '',
  areaGrowth: '',
  image: null,
  imagePreview: null,
};

const EMPTY_PAYMENT = {
  booking: '',
  foundation: '',
  structure: '',
  preCompletion: '',
  atCompletion: '',
  note: '',
};

const AddConstructionModal = memo(({ onClose, onAdd, initialData }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() =>
    initialData
      ? {
          title: initialData.name || '',
          developer: initialData.company || '',
          location: initialData.location || '',
          price: initialData.price ? String(initialData.price) : '',
          beds: initialData.beds ? String(initialData.beds) : '',
          bathrooms: initialData.bathrooms ? String(initialData.bathrooms) : '',
          area: initialData.area || '',
          description: initialData.description || '',
          expectedRoi: initialData.expectedRoi || '',
          areaGrowth: initialData.areaGrowth || '',
          image: null,
          imagePreview: initialData.image || null,
        }
      : EMPTY_FORM,
  );
  const [payment, setPayment] = useState(() =>
    initialData?.payment
      ? {
          booking: initialData.payment.booking || '',
          foundation: initialData.payment.foundation || '',
          structure: initialData.payment.structure || '',
          preCompletion: initialData.payment.preCompletion || '',
          atCompletion: initialData.payment.atCompletion || '',
          note: initialData.payment.note || '',
        }
      : EMPTY_PAYMENT,
  );
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const isEdit = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const applyFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: e.target.result,
      }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const handleNext = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a project title.');
      return;
    }
    if (isEdit) {
      const didSave = await onAdd({ ...form, payment }, initialData?.id);
      if (didSave) onClose();
    } else {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    const didSave = await onAdd({ ...form, payment }, initialData?.id);
    if (didSave) onClose();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl animate-[slideUp_0.3s_ease-out]'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 pt-6 pb-4'>
          <h2 className='text-xl font-bold text-gray-900'>
            {isEdit ? 'Edit Construction' : 'Add Construction'}
          </h2>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close modal'
            className='w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 && (
          <div className='px-6 pb-6 space-y-5'>
            {/* Section label */}
            <div className='flex items-center gap-2'>
              <FileText
                size={18}
                className='text-orange-500'
                aria-hidden='true'
              />
              <span className='text-base font-semibold text-gray-900'>
                Overview
              </span>
            </div>

            {/* Title */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='nc-title'
              >
                Tittle
              </label>
              <input
                id='nc-title'
                name='title'
                type='text'
                value={form.title}
                onChange={handleChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* Image upload */}
            <div className='flex flex-col gap-1.5'>
              <label className='text-sm text-gray-600 cursor-pointer'>
                Add Image
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  form.imagePreview
                    ? 'border-gray-200 overflow-hidden'
                    : `flex flex-col items-center justify-center gap-2 py-8 ${
                        dragOver
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                      }`
                }`}
              >
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt='Preview'
                    className='w-full h-48 object-cover block'
                  />
                ) : (
                  <>
                    <CloudUpload
                      size={36}
                      className='text-gray-400'
                      aria-hidden='true'
                    />
                    <p className='text-sm font-semibold text-gray-700'>
                      Drag and drop photos here
                    </p>
                    <p className='text-xs text-gray-400'>
                      Or click to browse from your computer
                    </p>
                    <AnimatedButton
                      onClick={(e) => {
                        e.stopPropagation();
                        fileRef.current?.click();
                      }}
                      className='mt-1 px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors cursor-pointer'
                    >
                      Upload Photos
                    </AnimatedButton>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => applyFile(e.target.files[0])}
              />
            </div>

            {/* Developer + Location */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-developer'
                >
                  Developer
                </label>
                <input
                  id='nc-developer'
                  name='developer'
                  type='text'
                  value={form.developer}
                  onChange={handleChange}
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-location'
                >
                  Location
                </label>
                <input
                  id='nc-location'
                  name='location'
                  type='text'
                  value={form.location}
                  onChange={handleChange}
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
            </div>

            {/* Price */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='nc-price'
              >
                Price
              </label>
              <input
                id='nc-price'
                name='price'
                type='number'
                min='0'
                value={form.price}
                onChange={handleChange}
                placeholder='e.g. 425000'
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* Bedroom / Bathroom / Area */}
            <div className='grid grid-cols-3 gap-3'>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-beds'
                >
                  Bedroom
                </label>
                <input
                  id='nc-beds'
                  name='beds'
                  type='number'
                  min='0'
                  value={form.beds}
                  onChange={handleChange}
                  placeholder='e.g. 3'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-bathrooms'
                >
                  Bathroom
                </label>
                <input
                  id='nc-bathrooms'
                  name='bathrooms'
                  type='number'
                  min='0'
                  value={form.bathrooms}
                  onChange={handleChange}
                  placeholder='e.g. 2'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-area'
                >
                  Area
                </label>
                <input
                  id='nc-area'
                  name='area'
                  type='text'
                  value={form.area}
                  onChange={handleChange}
                  placeholder='e.g. 5x7 m²'
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
            </div>

            {/* Description */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='nc-description'
              >
                Description
              </label>
              <textarea
                id='nc-description'
                name='description'
                rows={5}
                value={form.description}
                onChange={handleChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none'
              />
            </div>

            {/* Expected ROI + Area Growth */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-roi'
                >
                  Expected ROI
                </label>
                <input
                  id='nc-roi'
                  name='expectedRoi'
                  type='text'
                  value={form.expectedRoi}
                  onChange={handleChange}
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  className='text-sm text-gray-600 cursor-pointer'
                  htmlFor='nc-growth'
                >
                  Area Growth
                </label>
                <input
                  id='nc-growth'
                  name='areaGrowth'
                  type='text'
                  value={form.areaGrowth}
                  onChange={handleChange}
                  className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
                />
              </div>
            </div>

            <AnimatedButton
              onClick={handleNext}
              className='w-full py-3 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer'
            >
              {isEdit ? 'Save Changes' : 'Next'}
            </AnimatedButton>
          </div>
        )}

        {step === 2 && (
          <div className='px-6 pb-6 space-y-5'>
            {/* Section label */}
            <div className='flex items-center gap-2'>
              <FileText
                size={18}
                className='text-orange-500'
                aria-hidden='true'
              />
              <span className='text-base font-semibold text-gray-900'>
                Payment Plan
              </span>
            </div>

            {/* At Booking */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='pp-booking'
              >
                At Booking
              </label>
              <input
                id='pp-booking'
                name='booking'
                type='text'
                placeholder='Initial deposite 5%'
                value={payment.booking}
                onChange={handlePaymentChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* Foundation Complete */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='pp-foundation'
              >
                Foundation Complete
              </label>
              <input
                id='pp-foundation'
                name='foundation'
                type='text'
                placeholder='Foundation 20%'
                value={payment.foundation}
                onChange={handlePaymentChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* Structure Complete */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='pp-structure'
              >
                Structure Complete
              </label>
              <input
                id='pp-structure'
                name='structure'
                type='text'
                placeholder='Structure 20%'
                value={payment.structure}
                onChange={handlePaymentChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* 90 Days before handover */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='pp-precompletion'
              >
                90 Days before handover
              </label>
              <input
                id='pp-precompletion'
                name='preCompletion'
                type='text'
                placeholder='Pre-completion 30%'
                value={payment.preCompletion}
                onChange={handlePaymentChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* At Completion */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='pp-atcompletion'
              >
                At Completion
              </label>
              <input
                id='pp-atcompletion'
                name='atCompletion'
                type='text'
                placeholder='Final payment 30%'
                value={payment.atCompletion}
                onChange={handlePaymentChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* Note */}
            <div className='flex flex-col gap-1.5'>
              <label
                className='text-sm text-gray-600 cursor-pointer'
                htmlFor='pp-note'
              >
                Note
              </label>
              <textarea
                id='pp-note'
                name='note'
                rows={3}
                value={payment.note}
                onChange={handlePaymentChange}
                className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none'
              />
            </div>

            <div className='flex gap-3'>
              <AnimatedButton
                onClick={() => setStep(1)}
                className='flex-1 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'
              >
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={handleSubmit}
                className='flex-1 py-3 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer'
              >
                Submit
              </AnimatedButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
AddConstructionModal.displayName = 'AddConstructionModal';

const LS_KEY = 'admin_nc_projects';

function loadProjects() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return MOCK_PROJECTS;
}

const NewConstruction = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchConstructions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await httpMethods.get(API_ENDPOINTS.CONSTRUCTIONS.LIST, {
      params: { page: currentPage, limit: PAGE_SIZE },
    });

    if (error) {
      toast.error(error.message || 'Failed to load constructions.');
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
  }, [currentPage]);

  useEffect(() => {
    fetchConstructions();
  }, [fetchConstructions]);

  const handleAdd = useCallback(async (form, id) => {
    if (id) {
      const payload = new FormData();
      payload.append('title', form.title?.trim() || '');
      payload.append('price', String(form.price || '').trim());
      payload.append('bedrooms', String(form.beds || '').trim());
      payload.append('bathrooms', String(form.bathrooms || '').trim());
      payload.append('area', form.area?.trim() || '');
      payload.append('developer', form.developer?.trim() || '');
      payload.append('location', form.location?.trim() || '');
      payload.append('description', form.description?.trim() || '');
      payload.append('expectedRoi', form.expectedRoi?.trim() || '');
      payload.append('areaGrowth', form.areaGrowth?.trim() || '');
      payload.append('atBooking', form.payment?.booking?.trim() || '');
      payload.append(
        'foundationComplete',
        form.payment?.foundation?.trim() || '',
      );
      payload.append('structureComplete', form.payment?.structure?.trim() || '');
      payload.append(
        'ninetyDaysHandover',
        form.payment?.preCompletion?.trim() || '',
      );
      payload.append('atCompletion', form.payment?.atCompletion?.trim() || '');
      payload.append('paymentNote', form.payment?.note?.trim() || '');

      if (form.image) {
        payload.append('images', form.image);
      }

      const { error } = await httpMethods.put(
        API_ENDPOINTS.CONSTRUCTIONS.UPDATE(id),
        payload,
        { headers: { 'Content-Type': undefined } },
      );

      if (error) {
        toast.error(
          error?.data?.message || error?.message || 'Failed to update construction.',
        );
        return false;
      }

      fetchConstructions();
      toast.success('Project updated successfully!');
      return true;
    } else {
      const payload = new FormData();
      payload.append('title', form.title?.trim() || '');
      payload.append('price', String(form.price || '').trim());
      payload.append('bedrooms', String(form.beds || '').trim());
      payload.append('bathrooms', String(form.bathrooms || '').trim());
      payload.append('area', form.area?.trim() || '');
      payload.append('developer', form.developer?.trim() || '');
      payload.append('location', form.location?.trim() || '');
      payload.append('description', form.description?.trim() || '');
      payload.append('expectedRoi', form.expectedRoi?.trim() || '');
      payload.append('areaGrowth', form.areaGrowth?.trim() || '');
      payload.append('atBooking', form.payment?.booking?.trim() || '');
      payload.append(
        'foundationComplete',
        form.payment?.foundation?.trim() || '',
      );
      payload.append('structureComplete', form.payment?.structure?.trim() || '');
      payload.append(
        'ninetyDaysHandover',
        form.payment?.preCompletion?.trim() || '',
      );
      payload.append('atCompletion', form.payment?.atCompletion?.trim() || '');
      payload.append('paymentNote', form.payment?.note?.trim() || '');

      if (form.image) {
        payload.append('images', form.image);
      }

      const { error } = await httpMethods.post(
        API_ENDPOINTS.CONSTRUCTIONS.CREATE,
        payload,
        { headers: { 'Content-Type': undefined } },
      );

      if (error) {
        toast.error(error?.data?.message || error?.message || 'Failed to add construction.');
        return false;
      }

      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchConstructions();
      }
      toast.success('Project added successfully!');
      return true;
    }
  }, [currentPage, fetchConstructions]);

  const pageRange = useMemo(
    () => getPageRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: 'Delete construction?',
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
        API_ENDPOINTS.CONSTRUCTIONS.DELETE(id),
      );

      if (error) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete construction.');
        return;
      }

      toast.success('Construction deleted successfully.');

      if (projects.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      } else {
        fetchConstructions();
      }
    },
    [currentPage, projects.length, fetchConstructions],
  );

  const handleView = useCallback(
    (id) => {
      navigate(ROUTES.ADMIN_NEW_CONSTRUCTION_DETAILS.replace(':id', id));
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (id) => {
      const project = projects.find((p) => p.id === id);
      if (!project) return;
      setEditingProject(project);
      setShowAddModal(true);
    },
    [projects],
  );

  return (
    <div className='space-y-8'>
      {/* Page header */}
      <div className='flex items-start justify-between gap-4 flex-wrap'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            New Construction
          </h1>
          <p className='text-gray-500 text-base mt-1'>
            Plan, manage, and track your new construction projects from start to
            completion.
          </p>
        </div>
        <AnimatedButton
          onClick={() => {
            setEditingProject(null);
            setShowAddModal(true);
          }}
          className='shrink-0 px-6 py-3 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer'
        >
          Add Construction
        </AnimatedButton>
      </div>

      {/* Project grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {loading ? (
          <p className='col-span-2 text-center text-gray-400 py-16 text-sm'>
            Loading constructions...
          </p>
        ) : projects.length === 0 ? (
          <p className='col-span-2 text-center text-gray-400 py-16 text-sm'>
            No projects found.
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Numbered pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-1 pt-2 pb-4 flex-wrap'>
          {/* Previous */}
          <AnimatedButton
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label='Previous page'
            className='w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'
          >
            <ChevronLeft size={16} aria-hidden='true' />
          </AnimatedButton>

          {/* Page numbers */}
          {pageRange.map((page, i) =>
            page === '...' ? (
              <span
                key={`ellipsis-${i}`}
                className='w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none'
              >
                ...
              </span>
            ) : (
              <AnimatedButton
                key={page}
                onClick={() => setCurrentPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {page}
              </AnimatedButton>
            ),
          )}

          {/* Next */}
          <AnimatedButton
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label='Next page'
            className='w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'
          >
            <ChevronRight size={16} aria-hidden='true' />
          </AnimatedButton>
        </div>
      )}
      {showAddModal && (
        <AddConstructionModal
          onClose={() => {
            setShowAddModal(false);
            setEditingProject(null);
          }}
          onAdd={handleAdd}
          initialData={editingProject}
        />
      )}
    </div>
  );
};

export default NewConstruction;
