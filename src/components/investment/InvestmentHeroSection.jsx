import React, { memo } from 'react';
import {
  TrendingUp,
  BarChart2,
  Target,
  Shield,
  Users,
  Sliders,
} from 'lucide-react';

const HERO_BG = '/InvestmentHeroBg.jpg';

const HERO_STATS = [
  { value: '$50M+', label: 'Total Investments Managed' },
  { value: '200+', label: 'Successful Projects Completed' },
  { value: '18-24%', label: 'Average Annual ROI' },
];

const WHY_INVEST_FEATURES = [
  {
    icon: TrendingUp,
    title: 'Proven Market Expertise',
    description:
      'Over 15 years of real estate development experience with a track record of consistent returns and successful project delivery.',
  },
  {
    icon: BarChart2,
    title: 'Diverse Revenue Streams',
    description:
      'Multiple income channels through home sales, construction contracts, and property management projects minimize risk and maximize stability.',
  },
  {
    icon: Target,
    title: 'High ROI Potential',
    description:
      'Consistently returns 18-24% annual returns for our investment partners through strategic property selection and value-add innovations.',
  },
  {
    icon: Shield,
    title: 'Transparent Process',
    description:
      'Detailed quarterly reporting, real-time project updates, and full visibility into every phase of development and construction.',
  },
  {
    icon: Users,
    title: 'Experienced Team',
    description:
      'Led by industry veterans with backgrounds in development, construction management, and financial planning.',
  },
  {
    icon: Sliders,
    title: 'Flexible Investment Options',
    description:
      'Customizable investment tiers ranging from $50K to $5M+ with options for equity partnerships or debt positions.',
  },
];

const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <div className='bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
    <div className='w-12 h-12 bg-orange-500 flex items-center justify-center rounded-xl shrink-0'>
      <Icon className='w-6 h-6 text-white' aria-hidden='true' />
    </div>
    <div className='flex flex-col gap-2'>
      <h3 className='text-ink-soft font-semibold text-lg leading-snug'>
        {title}
      </h3>
      <p className='text-base text-gray-500 leading-relaxed'>{description}</p>
    </div>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const InvestmentHeroSection = memo(() => (
  <>
    {/* Hero */}
    <section className='relative overflow-hidden w-full'>
      <div className='absolute inset-0'>
        <img
          src={HERO_BG}
          alt='Real estate investment background'
          className='absolute inset-0 size-full object-cover'
        />
        <div className='absolute inset-0 bg-[rgba(16,24,40,0.55)]' />
      </div>
      <div className='relative z-10 py-16 sm:py-20 lg:py-24'>
        <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 w-full'>
          <div className='max-w-3xl'>
            <p className='text-orange-400 text-xs font-semibold tracking-widest uppercase mb-4'>
              Premium Investment Opportunities
            </p>
            <h1 className='text-white font-bold text-[30px] sm:text-[42px] lg:text-[56px] leading-tight mb-5 sm:mb-6'>
              Invest With Confidence in{' '}
              <span className='text-orange-500'>High-Growth Real Estate</span>
            </h1>
            <p className='font-inter text-lg leading-relaxed font-medium text-white/85 mb-8 max-w-xl'>
              Join elite investors in diversified real estate opportunities
              spanning residential development, premium construction projects,
              and renovation ventures. Built on expertise, transparency, and
              proven results.
            </p>
            <div className='flex flex-col sm:flex-row gap-6 sm:gap-0'>
              {HERO_STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`flex flex-col gap-1 ${i > 0 ? 'sm:pl-10 sm:border-l sm:border-white/20' : ''}`}
                >
                  <span className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white'>
                    {value}
                  </span>
                  <span className='text-sm text-white/70'>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why Invest With Us */}
    <section
      className='py-12 sm:py-16 lg:py-20 bg-white'
      aria-labelledby='why-invest-heading'
    >
      <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
        <div className='text-center mb-8 sm:mb-12'>
          <div className='inline-flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-4'>
            <span className='text-orange-500 text-xs font-semibold tracking-wide uppercase'>
              Our Advantage
            </span>
          </div>
          <h2
            id='why-invest-heading'
            className='font-playfair text-2xl sm:text-3xl lg:text-4xl text-ink-soft font-bold mb-4'
          >
            Why Invest With Us
          </h2>
          <p className='text-base text-gray-500 max-w-2xl mx-auto leading-relaxed'>
            Partner with a trusted leader in real estate development and
            construction, backed by proven performance and unwavering commitment
            to investor success.
          </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {WHY_INVEST_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  </>
));

InvestmentHeroSection.displayName = 'InvestmentHeroSection';

export default InvestmentHeroSection;
