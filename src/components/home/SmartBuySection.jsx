import React, { memo } from 'react';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { ROUTES } from '../../config';
import AnimatedButton from '../shared/AnimatedButton';

const SMART_BUY_IMAGE = '/ListYourProperty.jpg';

const SMART_FEATURES = [
  {
    id: 1,
    Icon: TrendingUp,
    title: 'Real-time Market Data',
    description:
      'Get instant access to the latest market trends and property valuations powered by our proprietary AI.',
  },
  {
    id: 2,
    Icon: ShieldCheck,
    title: 'Verified Listings',
    description:
      'Every property on our platform undergoes a rigorous verification process to ensure transparency.',
  },
  {
    id: 3,
    Icon: Zap,
    title: 'Instant Inquiries',
    description:
      'Connect with top-rated agents in seconds and schedule viewings with a single click.',
  },
];

const SmartBuySection = memo(() => (
  <section className='bg-site-bg py-14 lg:py-20'>
    <div className='mx-auto grid max-w-384 grid-cols-1 gap-10 px-4 sm:px-8 md:grid-cols-[1fr_1fr] md:items-center md:gap-16 lg:px-12'>
      <div className='overflow-hidden rounded-xl'>
        <img
          src={SMART_BUY_IMAGE}
          alt='House with green lawn'
          className='h-75 w-full object-cover sm:h-105 lg:h-138.5'
          loading='lazy'
        />
      </div>

      <div className='space-y-6'>
        <h2 className='font-playfair text-3xl leading-tight text-ink-navy lg:text-[40px]'>
          The smartest way to <em className='text-purple'>buy real estate.</em>
        </h2>

        <div className='space-y-4'>
          {SMART_FEATURES.map(({ id, Icon, title, description }) => (
            <div key={id} className='space-y-2'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-8 w-8 items-center justify-center rounded-sm bg-purple'>
                  <Icon className='h-5 w-5 text-white' aria-hidden='true' />
                </div>
                <h3 className='text-xl font-semibold text-ink-navy lg:text-2xl'>
                  {title}
                </h3>
              </div>
              <p className='text-base leading-6 text-text-dim'>{description}</p>
            </div>
          ))}
        </div>

        <AnimatedButton
          to={ROUTES.BUY}
          className='inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:text-base'
        >
          Buy Your Property
        </AnimatedButton>
      </div>
    </div>
  </section>
));

SmartBuySection.displayName = 'SmartBuySection';

export default SmartBuySection;
