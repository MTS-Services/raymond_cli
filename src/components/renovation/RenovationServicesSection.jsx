import React, { memo } from 'react';
import { Pencil, KeyRound, Users, House } from 'lucide-react';

const SERVICES = [
  {
    id: 'arch',
    Icon: Pencil,
    title: 'Architectural Planning',
    description:
      'Site analysis, concept design, and permit-ready drawings tailored to your land.',
  },
  {
    id: 'build',
    Icon: KeyRound,
    title: 'Custom Home Build',
    description:
      'Move in on day one. We deliver fully finished, furnished, photo-ready homes.',
  },
  {
    id: 'mgmt',
    Icon: Users,
    title: 'Design-Build Management',
    description:
      'One contract, one team — we handle architects, contractors, and timelines.',
  },
  {
    id: 'finish',
    Icon: House,
    title: 'Turnkey Finish',
    description:
      'Single-residence builds where every material, finish, and detail is your call.',
  },
];

const ServiceCard = memo(({ service }) => {
  const { Icon, title, description } = service;
  return (
    <div className='bg-surface-white border border-gray-200/70 rounded-2xl flex flex-col gap-2 p-8'>
      <Icon size={24} className='text-gray-700 shrink-0' aria-hidden='true' />
      <h3 className='font-playfair font-semibold text-ink-soft text-xl sm:text-2xl leading-snug mt-2'>
        {title}
      </h3>
      <p className='text-text-mid text-base leading-6'>{description}</p>
    </div>
  );
});
ServiceCard.displayName = 'ServiceCard';

const RenovationServicesSection = memo(() => (
  <section
    className='bg-white py-14 lg:py-20 '
    aria-labelledby='services-heading'
  >
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='flex flex-col gap-3 mb-16'>
        <p className='text-cta-orange font-semibold text-xs tracking-[1.2px] uppercase leading-none'>
          What We Build
        </p>
        <h2
          id='services-heading'
          className='font-playfair font-semibold text-ink-soft text-3xl sm:text-4xl lg:text-[48px] leading-tight'
        >
          End-to-end build services.
        </h2>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  </section>
)); 

RenovationServicesSection.displayName = 'RenovationServicesSection';

export default RenovationServicesSection;
