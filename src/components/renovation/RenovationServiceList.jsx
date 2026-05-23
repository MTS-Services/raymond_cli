import React, { memo } from 'react';
import { ChefHat, Droplets, House, Briefcase } from 'lucide-react';

const SERVICES = [
  {
    id: 'kitchen',
    Icon: ChefHat,
    title: 'Kitchen Renovation',
    description:
      'Modern kitchen makeovers with custom cabinets, countertops, and premium appliances.',
  },
  {
    id: 'bathroom',
    Icon: Droplets,
    title: 'Bathroom Remodeling',
    description:
      'Luxury bathroom upgrades with spa-like features and contemporary fixtures.',
  },
  {
    id: 'fullhome',
    Icon: House,
    title: 'Full Home Makeover',
    description:
      'Complete home transformations including flooring, paint, and structural changes.',
  },
  {
    id: 'office',
    Icon: Briefcase,
    title: 'Office Renovation',
    description:
      'Professional workspace redesigns for productivity and modern aesthetics.',
  },
];

const ServiceCard = memo(({ service }) => {
  const { Icon, title, description } = service;
  return (
    <div className='flex flex-col items-center text-center gap-3 p-6 sm:p-8'>
      <div className='flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-1'>
        <Icon size={26} className='text-blue-600' aria-hidden='true' />
      </div>
      <h3 className='font-semibold text-ink-soft text-lg leading-snug'>
        {title}
      </h3>
      <p className='text-text-mid text-sm leading-relaxed'>{description}</p>
    </div>
  );
});
ServiceCard.displayName = 'ServiceCard';

const RenovationServiceList = memo(() => (
  <section
    className='bg-white py-14 lg:py-20 '
    aria-labelledby='services-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <h2
        id='services-heading'
        className='text-center font-bold text-ink-soft text-3xl sm:text-4xl leading-tight mb-14'
      >
        Our Services
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {SERVICES.map((service) => (
          <div key={service.id} className='border border-gray-200 rounded-xl'>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  </section>
));

RenovationServiceList.displayName = 'RenovationServiceList';

export default RenovationServiceList;
