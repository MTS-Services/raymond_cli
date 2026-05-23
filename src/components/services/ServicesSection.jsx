import React, { memo } from 'react';

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------
const ServiceCard = memo(({ title, description }) => (
  <div className='bg-white p-6 rounded-lg shadow-md'>
    <h2 className='text-2xl font-semibold text-blue-600 mb-3'>{title}</h2>
    <p className='text-gray-600'>{description}</p>
  </div>
));

ServiceCard.displayName = 'ServiceCard';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies',
  },
  {
    id: 2,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications',
  },
  {
    id: 3,
    title: 'UI/UX Design',
    description: 'Beautiful and intuitive user interfaces',
  },
  {
    id: 4,
    title: 'Consulting',
    description: 'Expert technical consulting and architecture',
  },
];

const ServicesSection = memo(() => (
  <section className='py-12 sm:py-16 lg:py-20'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <h1 className='text-4xl font-bold text-gray-800 mb-6'>Our Services</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  </section>
));

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;
