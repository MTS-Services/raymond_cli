import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, AtSign, MapPin } from 'lucide-react';
import { ROUTES } from '../../config';

const LOGO_URL = '/logo.png';

const SOCIAL_ICONS = [
  {
    icon: Facebook,
    alt: 'Facebook',
    href: 'https://www.facebook.com/SkyridgeTea',
  },
  {
    icon: Instagram,
    alt: 'Instagram',
    href: 'https://www.instagram.com/skyridgegroup',
  },
  {
    icon: AtSign,
    alt: 'Threads',
    href: 'https://www.threads.com/@skyridgegroup',
  },
];

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Buy', to: '/buy' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Portfolio', to: '/portfolio' },
];
const COMPANY_LINKS = [
  { label: 'Privacy Policy', to: ROUTES.PRIVACY_POLICY },
  { label: 'Terms & Condition', to: ROUTES.TERMS_CONDITION },
];
const OFFICE_ADDRESS = '411 125th PL SE Everett WA 98208';

const Footer = memo(() => (
  <footer className='bg-slate-100 pt-16 pb-4'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='flex flex-col md:flex-row gap-12 justify-between mb-10'>
        {/* Brand column */}
        <div className='flex flex-col gap-8 max-w-xs'>
          <div className='flex flex-col gap-4'>
            <Link to='/'>
              <img
                src={LOGO_URL}
                alt='Skyridge Group'
                className='h-14 w-auto object-contain self-start'
              />
            </Link>
            <p className='text-gray-900 text-lg leading-snug'>
              Redefining the real estate experience with modern technology and
              premium service.
            </p>
            <div className='flex items-start gap-2.5 text-gray-800'>
              <p className='text-base leading-relaxed'>{OFFICE_ADDRESS}</p>
              <MapPin className='w-5 h-5 mt-0.5 shrink-0' aria-hidden='true' />
            </div>
          </div>

          {/* Social icons */}
          <div className='flex items-center gap-4'>
            <span className='text-gray-900 text-base font-["DM_Sans",sans-serif]'>
              Follow :
            </span>
            <div className='flex items-center gap-3.5'>
              {SOCIAL_ICONS.map(({ icon: Icon, alt, href }) => (
                <a
                  key={alt}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`Follow us on ${alt}`}
                  className='shrink-0 text-gray-600 hover:text-primary transition-colors duration-150'
                >
                  <Icon className='w-6 h-6' aria-hidden='true' />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className='flex flex-col gap-4'>
          <h3 className='text-gray-900 text-xl font-semibold font-["DM_Sans",sans-serif]'>
            Quick Links
          </h3>
          <ul className='flex flex-col gap-3'>
            {QUICK_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className='text-gray-900 text-base font-["DM_Sans",sans-serif] hover:text-primary transition-colors duration-150'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className='flex flex-col gap-4'>
          <h3 className='text-gray-900 text-xl font-semibold font-["DM_Sans",sans-serif]'>
            Company
          </h3>
          <ul className='flex flex-col gap-3'>
            {COMPANY_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className='text-gray-900 text-base font-["DM_Sans",sans-serif] hover:text-primary transition-colors duration-150'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className='border-t border-gray-200 pt-4'>
        <p className='text-gray-800 text-base font-playfair'>
          © 2026{' '}
          <span className='font-normal font-playfair'>
            Skyridge group
          </span>
          . All rights reserved. Built with passion for real estate.
        </p>
      </div>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export default Footer;
