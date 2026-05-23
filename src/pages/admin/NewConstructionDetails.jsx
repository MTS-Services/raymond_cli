import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  Building2,
  MapPin,
  TrendingUp,
  BarChart3,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '../../config';
import AnimatedButton from '../../components/shared/AnimatedButton';
import TablePagination from '../../components/shared/TablePagination';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';

const CUST_PAGE_SIZE = 5;

const MOCK_DETAILS_MAP = {
  1: {
    name: 'Skyline Residences',
    company: 'Premier Developers Inc.',
    location: 'Downtown Miami, FL',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    description:
      'Luxury high-rise residences in the heart of downtown Miami with panoramic ocean views and world-class amenities including a rooftop infinity pool, concierge services, and smart home integration.',
    expectedRoi: '18--24%',
    areaGrowth: '+15% YoY',
  },
  2: {
    name: 'Greenwood Estates',
    company: 'EcoLiving Communities',
    location: 'Portland, OR',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
    description:
      'Eco-friendly suburban estates with green-certified construction and community gardens in a thriving Portland neighborhood, designed to minimize environmental footprint.',
    expectedRoi: '14--20%',
    areaGrowth: '+12% YoY',
  },
  3: {
    name: 'Harbor View Towers',
    company: 'Coastal Builders LLC',
    location: 'Boston, MA',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    description: `Modern waterfront towers offering stunning harbor views, premium finishes, and direct access to Boston's waterfront district with private marina slips.`,
    expectedRoi: '20--26%',
    areaGrowth: '+18% YoY',
  },
  4: {
    name: 'Tech Park Plaza',
    company: 'Innovation Properties',
    location: 'Austin, TX',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    description: `Mixed-use development near tech hub with smart home integration, co-working spaces, and retail amenities -- positioned for Austin's booming innovation economy.`,
    expectedRoi: '22-28%',
    areaGrowth: '+20% YoY',
  },
  5: {
    name: 'Urban Heights',
    company: 'Metro Construction Group',
    location: 'New York, NY',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    description: `Premium urban skyscraper in Manhattan's thriving tech corridor, offering unparalleled city views, state-of-the-art facilities, and direct subway access.`,
    expectedRoi: '25--32%',
    areaGrowth: '+22% YoY',
  },
  6: {
    name: 'Lakeside Manor',
    company: 'Pacific Coast Builders',
    location: 'Seattle, WA',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
    description:
      'Serene lakeside living with contemporary architectural design, surrounded by the natural beauty of the Pacific Northwest and private waterfront access.',
    expectedRoi: '16--22%',
    areaGrowth: '+14% YoY',
  },
  7: {
    name: 'Summit Ridge',
    company: 'Altitude Development Co.',
    location: 'Denver, CO',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    description:
      'Mountain-inspired residences offering breathtaking Rocky Mountain views, premium ski-in/ski-out access, and year-round resort-style amenities.',
    expectedRoi: '17--23%',
    areaGrowth: '+16% YoY',
  },
  8: {
    name: 'Riverside Lofts',
    company: 'Delta Construction Corp.',
    location: 'Chicago, IL',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    description: `Industrial-chic loft conversions on the Chicago Riverwalk with open-plan living, exposed brick, and direct access to the city's premier waterfront trail.`,
    expectedRoi: '19--25%',
    areaGrowth: '+17% YoY',
  },
  9: {
    name: 'Oakwood Village',
    company: 'Heritage Developers',
    location: 'Nashville, TN',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    description: `Charming craftsman-style community in Nashville's fastest-growing suburb, close to music venues, top-rated dining, and major employment centers.`,
    expectedRoi: '15--21%',
    areaGrowth: '+13% YoY',
  },
  10: {
    name: 'The Pinnacle',
    company: 'Apex Real Estate Group',
    location: 'Los Angeles, CA',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
    description:
      'Iconic luxury tower in West LA featuring 24/7 concierge, rooftop infinity pool, private cinema, and panoramic ocean-to-mountain views from every unit.',
    expectedRoi: '28--35%',
    areaGrowth: '+25% YoY',
  },
  11: {
    name: 'Coral Bay Residences',
    company: 'Seaside Construction',
    location: 'Tampa, FL',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    description:
      'Coastal living redefined with private marina access, resort-style pools, and premium waterfront finishes throughout every unit.',
    expectedRoi: '16--22%',
    areaGrowth: '+14% YoY',
  },
  12: {
    name: 'Maple Grove Estates',
    company: 'Green Valley Builders',
    location: 'Minneapolis, MN',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    description: `Family-friendly suburban community with top-rated schools, parks, and energy-efficient homes engineered for Minnesota's demanding climate.`,
    expectedRoi: '13--19%',
    areaGrowth: '+11% YoY',
  },
  13: {
    name: 'Silver Creek Heights',
    company: 'Horizon Properties',
    location: 'Phoenix, AZ',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    description: `Desert-modern residences featuring greywater recycling, solar panels, and resort-style outdoor living spaces designed for Phoenix's vibrant lifestyle.`,
    expectedRoi: '18--24%',
    areaGrowth: '+16% YoY',
  },
  14: {
    name: 'The Metropolitan',
    company: 'Urban Core Development',
    location: 'San Francisco, CA',
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
    description: `SoMa district's premier mixed-use high-rise combining tech-forward amenities, premium ground-floor retail, and luxury residences steps from the Bay.`,
    expectedRoi: '30--38%',
    areaGrowth: '+28% YoY',
  },
  15: {
    name: 'Willow Brook Commons',
    company: "Nature's Edge Builders",
    location: 'Raleigh, NC',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
    description: `Wooded retreat community in Raleigh's Research Triangle, blending nature-inspired architecture with proximity to the region's top tech employers.`,
    expectedRoi: '14--20%',
    areaGrowth: '+12% YoY',
  },
  16: {
    name: 'Ironwood Villas',
    company: 'Premier Construction LLC',
    location: 'Atlanta, GA',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    description: `Upscale villa community in Atlanta's premier Buckhead district, featuring private landscaped courtyards and fully bespoke interior design packages.`,
    expectedRoi: '19--25%',
    areaGrowth: '+17% YoY',
  },
};

const PAYMENT_PLAN = [
  { label: 'Initial Deposit (5%)', milestone: 'At Booking', highlight: false },
  {
    label: 'Foundation Payment (10%)',
    milestone: 'Foundation Complete',
    highlight: false,
  },
  {
    label: 'Structure Payment (20%)',
    milestone: 'Structure Complete',
    highlight: false,
  },
  {
    label: 'Pre-Completion (30%)',
    milestone: '90 Days Before Handover',
    highlight: false,
  },
  { label: 'Final Payment (35%)', milestone: 'At Completion', highlight: true },
];

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'Eleanor Pena',
    email: 'aliza@gmail.com',
    phone: '+880 1712-345678',
  },
  {
    id: 2,
    name: 'Esther Howard',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 3,
    name: 'Annette Black',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 4,
    name: 'Jenny Wilson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 5,
    name: 'Darlene Robertson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 6,
    name: 'Guy Hawkins',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 7,
    name: 'Jerome Bell',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 8,
    name: 'Kristin Watson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
  {
    id: 9,
    name: 'Kristin Watson',
    email: 'liyana@gmail.com',
    phone: '+880 1934-567890',
  },
];

export default function NewConstructionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [custPage, setCustPage] = useState(1);
  const customers = project?.registrations ?? [];
  const custTotal = Math.max(
    1,
    Math.ceil(customers.length / CUST_PAGE_SIZE),
  );
  const pagedCustomers = useMemo(
    () =>
      customers.slice(
        (custPage - 1) * CUST_PAGE_SIZE,
        custPage * CUST_PAGE_SIZE,
      ),
    [custPage, customers],
  );
  const custStart =
    customers.length === 0 ? 0 : (custPage - 1) * CUST_PAGE_SIZE + 1;
  const custEnd = Math.min(custPage * CUST_PAGE_SIZE, customers.length);

  const fetchConstruction = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await httpMethods.get(
      API_ENDPOINTS.CONSTRUCTIONS.BY_ID(id),
    );

    if (error || !data?.data) {
      toast.error(error?.data?.message || error?.message || 'Failed to load project details.');
      setProject(null);
      setLoading(false);
      return;
    }

    const payload = data.data;
    setProject({
      id: payload.id,
      name: payload.title || '',
      company: payload.developer || '',
      location: payload.location || '',
      image: payload.images?.[0] || '',
      description: payload.description || '',
      expectedRoi: payload.expectedRoi || '-',
      areaGrowth: payload.areaGrowth || '-',
      paymentPlan: [
        {
          label: payload.atBooking || '-',
          milestone: 'At Booking',
          highlight: false,
        },
        {
          label: payload.foundationComplete || '-',
          milestone: 'Foundation Complete',
          highlight: false,
        },
        {
          label: payload.structureComplete || '-',
          milestone: 'Structure Complete',
          highlight: false,
        },
        {
          label: payload.ninetyDaysHandover || '-',
          milestone: '90 Days Before Handover',
          highlight: false,
        },
        {
          label: payload.atCompletion || '-',
          milestone: 'At Completion',
          highlight: true,
        },
      ],
      registrations: Array.isArray(payload.registrations)
        ? payload.registrations.map((r) => ({
            id: r.id,
            name: r.fullName || '',
            email: r.email || '',
            phone: r.phoneNumber || '',
          }))
        : [],
    });
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchConstruction();
  }, [fetchConstruction]);

  useEffect(() => {
    setCustPage(1);
  }, [id, customers.length]);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-4'>
        <p className='text-sm text-gray-500'>Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-4'>
        <div className='w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center'>
          <Building2 size={28} className='text-gray-400' aria-hidden='true' />
        </div>
        <div className='text-center'>
          <p className='text-lg font-semibold text-gray-900'>
            Project Not Found
          </p>
          <p className='text-sm text-gray-500 mt-1'>
            This project does not exist or has been removed.
          </p>
        </div>
        <AnimatedButton
          onClick={() => navigate(ROUTES.ADMIN_NEW_CONSTRUCTION)}
          className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer'
        >
          <ChevronLeft size={16} aria-hidden='true' />
          Back to New Construction
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <AnimatedButton
        onClick={() => navigate(ROUTES.ADMIN_NEW_CONSTRUCTION)}
        className='inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer'
      >
        <ChevronLeft size={16} aria-hidden='true' />
        Back to New Construction
      </AnimatedButton>

      <div>
        <h1 className='text-2xl font-bold text-gray-900'>{project.name}</h1>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-2'>
          <div className='flex items-center gap-1.5 text-sm text-gray-500'>
            <Building2 size={14} className='shrink-0' aria-hidden='true' />
            {project.company}
          </div>
          <span className='text-gray-300' aria-hidden='true'>
            |
          </span>
          <div className='flex items-center gap-1.5 text-sm text-gray-500'>
            <MapPin size={14} className='shrink-0' aria-hidden='true' />
            {project.location}
          </div>
        </div>
      </div>

      <div className='w-full h-72 sm:h-96 lg:h-125 rounded-2xl overflow-hidden shadow-sm'>
        <img
          src={project.image}
          alt={project.name}
          className='w-full h-full object-cover'
          loading='eager'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Description */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
            <h2 className='text-base font-semibold text-gray-900 mb-3'>
              About This Project
            </h2>
            <p className='text-base text-gray-500 leading-relaxed'>
              {project.description}
            </p>
          </div>

          {/* Payment Plan Breakdown */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4'>
            <h2 className='text-base font-semibold text-gray-900'>
              Payment Plan Breakdown
            </h2>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-80'>
                <thead>
                  <tr className='border-b border-gray-100'>
                    <th className='pb-3 text-left text-sm font-medium text-gray-400'>
                      Payment Stage
                    </th>
                    <th className='pb-3 text-right text-sm font-medium text-gray-400'>
                      Milestone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(project.paymentPlan || []).map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-50 last:border-b-0 ${
                        row.highlight ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className='py-4 pr-4'>
                        <div className='flex items-center gap-2.5'>
                          <CheckCircle2
                            size={15}
                            className={
                              row.highlight
                                ? 'text-blue-500 shrink-0'
                                : 'text-gray-300 shrink-0'
                            }
                            aria-hidden='true'
                          />
                          <span
                            className={`text-sm ${
                              row.highlight
                                ? 'font-semibold text-blue-700'
                                : 'font-medium text-gray-900'
                            }`}
                          >
                            {row.label}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-4 text-sm text-right ${
                          row.highlight
                            ? 'font-semibold text-blue-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {row.milestone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          {/* Expected ROI Stat */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0'>
                <TrendingUp
                  size={18}
                  className='text-green-600'
                  aria-hidden='true'
                />
              </div>
              <div>
                <p className='text-xs text-gray-400'>Expected ROI</p>
                <p className='text-xl font-bold text-green-600 mt-0.5'>
                  {project.expectedRoi}
                </p>
              </div>
            </div>
          </div>

          {/* Area Growth Stat */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0'>
                <BarChart3
                  size={18}
                  className='text-blue-600'
                  aria-hidden='true'
                />
              </div>
              <div>
                <p className='text-xs text-gray-400'>Area Growth</p>
                <p className='text-xl font-bold text-blue-600 mt-0.5'>
                  {project.areaGrowth}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <h2 className='text-2xl font-bold text-gray-900'>Customer List</h2>
        <p className='text-base text-gray-500'>
          Manage and view all your customers in one place for better tracking,
          communication, and relationship management.
        </p>
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='px-5 sm:px-6 py-4 border-b border-gray-100'>
          <h2 className='font-serif text-lg sm:text-xl font-bold text-gray-900'>
            Customer List
          </h2>
        </div>
        {/* Mobile cards */}
        <div className='md:hidden divide-y divide-gray-100'>
          {pagedCustomers.map((customer) => (
            <div key={customer.id} className='px-4 sm:px-6 py-4'>
              <p className='text-sm font-semibold text-gray-900'>
                {customer.name}
              </p>
              <p className='text-sm text-gray-500 truncate mt-0.5'>
                {customer.email}
              </p>
              <p className='text-sm text-gray-500'>{customer.phone}</p>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='min-w-full text-sm table-fixed'>
            <thead>
              <tr className='text-left text-sm font-medium text-gray-500 bg-gray-50/50'>
                <th className='px-6 py-3 w-[34%]'>Name</th>
                <th className='px-6 py-3 w-[36%]'>Email</th>
                <th className='px-6 py-3 w-[30%]'>Phone Number</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {pagedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className='hover:bg-gray-50/40 transition-colors'
                >
                  <td className='px-6 py-4 text-sm text-gray-800 truncate'>
                    {customer.name}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                    {customer.email}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600 truncate'>
                    {customer.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={custPage}
          totalPages={custTotal}
          startItem={custStart}
          endItem={custEnd}
          total={customers.length}
          onPrev={() => setCustPage((p) => Math.max(1, p - 1))}
          onNext={() => setCustPage((p) => Math.min(custTotal, p + 1))}
        />
      </div>
    </div>
  );
}
