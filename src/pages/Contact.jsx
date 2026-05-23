import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import HeroSection from '../components/contact/HeroSection';
import ContactSection from '../components/contact/ContactSection';

const Contact = memo(() => {
  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with us',
    keywords: ['contact', 'email', 'message'],
  });

  return (
    <div className='min-h-dvh flex flex-col bg-white'>
      <HeroSection />
      <ContactSection />
    </div>
  );
});

Contact.displayName = 'Contact';

export default Contact;
