import React, { memo } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = memo(() => (
  <div className='min-h-screen flex flex-col bg-white'>
    <ScrollRestoration />
    <Navbar />
    <main className='flex-1'>
      <Outlet />
    </main>
    <Footer />
  </div>
));

MainLayout.displayName = 'MainLayout';

export default MainLayout;
