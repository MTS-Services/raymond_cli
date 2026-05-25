import React, { memo, useState, useCallback } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import { APP_CONFIG, ROUTES } from '../config';

const NAV_LINKS = [
  { to: ROUTES.HOME, label: 'Home', end: true },
  { to: ROUTES.ABOUT, label: 'About' },
  { to: ROUTES.SERVICES, label: 'Services' },
  { to: ROUTES.CONTACT, label: 'Contact' },
]; 

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'px-3 py-2 rounded font-semibold bg-white/20'
    : 'px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-150';

const mobileNavLinkClass = ({ isActive }) =>
  isActive
    ? 'block px-4 py-2 rounded font-semibold bg-white/20'
    : 'block px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-150';

const Layout = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-blue-600 text-white shadow-lg'>
        <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
          <div className='flex items-center justify-between h-16'>
            {/* Brand */}
            <div className='flex items-center gap-8'>
              <Link
                to={ROUTES.HOME}
                className='text-xl font-bold tracking-tight'
              >
                {APP_CONFIG.NAME}
              </Link>

              {/* Desktop links */}
              <div className='hidden md:flex gap-1'>
                {NAV_LINKS.map(({ to, label, end }) => (
                  <NavLink key={to} to={to} end={end} className={navLinkClass}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Link
                to={ROUTES.LOGIN}
                className='hidden md:flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-sm'
              >
                <LogIn size={16} aria-hidden='true' />
                Login
              </Link>

              {/* Mobile hamburger */}
              <button
                type='button'
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls='mobile-menu'
                className='md:hidden p-2 rounded hover:bg-blue-700 transition-colors cursor-pointer'
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id='mobile-menu'
            className='md:hidden border-t border-blue-500 px-4 py-3 flex flex-col gap-1'
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                {label}
              </NavLink>
            ))}
            <Link
              to={ROUTES.LOGIN}
              onClick={closeMenu}
              className='mt-2 flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 self-start'
            >
              <LogIn size={16} aria-hidden='true' />
              Login
            </Link>
          </div>
        )}
      </nav>

      <main className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12 py-8'>
        <Outlet />
      </main>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
