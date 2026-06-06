import React, { useState, useCallback, memo } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import AnimatedButton from '../shared/AnimatedButton';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const CONTACT_INFO = [
  {
    id: 'address',
    Icon: MapPin,
    label: 'Our Office',
    value: '411 125th PL SE Everett WA 98208',
  },
  {
    id: 'phone',
    Icon: Phone,
    label: 'Phone',
    value: '+1 206-948-6426',
  },
  {
    id: 'email',
    Icon: Mail,
    label: 'Email',
    value: 'Support@skyridgegroup.com',
  },
];

// ---------------------------------------------------------------------------
// ContactForm
// ---------------------------------------------------------------------------
const ContactForm = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { loading: isSubmitting, execute: submitForm } = useApi((data) =>
    httpMethods.post(API_ENDPOINTS.CONTACT.SEND, data),
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { error } = await submitForm(formData);
      if (error) {
        toast.error(
          error.message || 'Failed to send message. Please try again.',
        );
        return;
      }
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    },
    [formData, submitForm],
  );

  return (
    <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2.5'>
        <label
          htmlFor='contact-name'
          className='text-base font-medium leading-5 text-gray-700'
        >
          Full Name
        </label>
        <input
          type='text'
          id='contact-name'
          name='name'
          autoComplete='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter your full name'
          required
          aria-required='true'
          disabled={isSubmitting}
          className='w-full h-15 bg-indigo-50 border border-slate-200 rounded-lg px-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-60 transition-all'
        />
      </div>

      <div className='flex flex-col gap-2.5'>
        <label
          htmlFor='contact-email'
          className='text-base font-medium leading-5 text-gray-700'
        >
          Email
        </label>
        <input
          type='email'
          id='contact-email'
          name='email'
          autoComplete='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email address'
          required
          aria-required='true'
          disabled={isSubmitting}
          className='w-full h-15 bg-indigo-50 border border-slate-200 rounded-lg px-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-60 transition-all'
        />
      </div>

      <div className='flex flex-col gap-2.5'>
        <label
          htmlFor='contact-message'
          className='text-base font-medium leading-5 text-gray-700'
        >
          Message
        </label>
        <textarea
          id='contact-message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder='Write your message here...'
          required
          aria-required='true'
          disabled={isSubmitting}
          className='w-full bg-indigo-50 border border-slate-200 rounded-lg px-3.5 py-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-60 resize-none transition-all'
        />
      </div>

      <AnimatedButton
        type='submit'
        disabled={isSubmitting}
        className='w-full h-12 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-poppins font-medium text-base rounded-lg flex items-center justify-center gap-2 transition-colors duration-200'
      >
        {isSubmitting ? (
          <span
            className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
            aria-hidden='true'
          />
        ) : (
          'Send Message'
        )}
      </AnimatedButton>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';

// ---------------------------------------------------------------------------
// ContactSection contact info + form
// ---------------------------------------------------------------------------
const ContactSection = memo(() => (
  <section className='py-16 lg:py-24'>
    <div className='max-w-384 mx-auto px-4 sm:px-8 lg:px-12'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-3'>
            <h2 className='font-playfair text-slate-950 text-3xl lg:text-4xl font-bold leading-tight'>
              We would love to hear from you
            </h2>
            <p className='text-gray-700 text-base leading-7'>
              Reach out to our team and we will get back to you within 24 hours.
            </p>
          </div>

          <div className='flex flex-col gap-6'>
            {CONTACT_INFO.map(({ id, Icon, label, value }) => (
              <div key={id} className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0'>
                  <Icon
                    size={20}
                    className='text-orange-500'
                    aria-hidden='true'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                    {label}
                  </p>
                  {value && <p className='text-sm text-gray-600'>{value}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm'>
          <h2 className='font-playfair text-slate-950 text-2xl font-bold mb-6'>
            Send a Message
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  </section>
));

ContactSection.displayName = 'ContactSection';

export default ContactSection;
