import React, { memo, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { httpMethods } from '../../services/httpMethods';
import API_ENDPOINTS from '../../services/httpEndpoint';
import {
  Calendar,
  UserCheck,
  ClipboardList,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Choose a time that works best for you.',
  },
  {
    icon: UserCheck,
    title: 'Expert Advisors',
    description: 'Meet with experienced investment professionals.',
  },
  {
    icon: ClipboardList,
    title: 'Personalized Plan',
    description: 'Get a custom investment strategy.',
  },
];

const WHAT_TO_EXPECT = [
  "We'll contact you within 24 hours to confirm your consultation",
  '30--60 minute consultation with an investment specialist',
  'Personalized investment strategy based on your goals',
  'Access to current investment opportunities',
];

const CONTACT_ITEMS = [
  { icon: Phone, label: 'Call Us Directly', value: '+1 206-948-6426' },
  { icon: Mail, label: 'Email Us', value: 'Support@skyridgegroup.com' },
  { icon: Clock, label: 'Office Hours', value: 'Mon-Fri: 9 AM - 6 PM PST' },
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  message: '',
};

const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <div className='bg-white rounded-[14px] drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center text-center gap-3'>
    <div className='w-14 h-14 bg-orange-500 flex items-center justify-center rounded-full shrink-0'>
      <Icon className='w-7 h-7 text-white' aria-hidden='true' />
    </div>
    <div className='flex flex-col gap-1'>
      <h3 className='text-black font-bold text-lg leading-snug'>{title}</h3>
      <p className='text-sm text-gray-500 leading-relaxed'>{description}</p>
    </div>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const ContactItem = memo(({ icon: Icon, label, value }) => (
  <div className='bg-white rounded-[14px] drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center text-center gap-3'>
    <div className='w-14 h-14 bg-orange-500 flex items-center justify-center rounded-full shrink-0'>
      <Icon className='w-7 h-7 text-white' aria-hidden='true' />
    </div>
    <div className='flex flex-col gap-0.5'>
      <span className='text-black font-bold text-base'>{label}</span>
      <span className='text-gray-500 text-base font-normal'>{value}</span>
    </div>
  </div>
));
ContactItem.displayName = 'ContactItem';

const BookConsultationSection = memo(() => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  function formatTimeTo12h(time24) {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    const h = Number(hStr);
    const m = Number(mStr);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr12 = h % 12 === 0 ? 12 : h % 12;
    return `${hr12}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phone,
        preferredConsultationDate: form.date ? new Date(form.date).toISOString() : null,
        preferredTime: form.time ? formatTimeTo12h(form.time) : '',
        additionalInformation: form.message,
      };

      const { data, error } = await httpMethods.post(
        API_ENDPOINTS.CONSULTATIONS.CREATE,
        payload,
      );

      if (error) throw error;

      toast.success('Consultation request submitted! We will contact you within 24 hours.');
      setForm(INITIAL_FORM);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  const inputClass =
    'h-[50px] w-full border border-gray-200 rounded-[10px] px-4 text-sm text-black placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white';

  return (
    <section
      className='py-12 sm:py-16 lg:py-20 bg-white'
      aria-labelledby='book-consultation-heading'
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-8 lg:px-12'>
        {/* Section header */}
        <div className='text-center mb-10 sm:mb-14'>
          <div className='inline-flex items-center bg-orange-50 rounded-full px-4 py-1.5 mb-4'>
            <span className='text-orange-500 text-sm font-semibold'>
              Book Your Consultation
            </span>
          </div>
          <h1
            id='book-consultation-heading'
            className='font-playfair text-3xl sm:text-5xl lg:text-[60px] lg:leading-18.75 text-black font-bold mb-4 leading-tight'
          >
            Schedule Your Investment Consultation
          </h1>
          <p className='font-inter lg:text-xl text-lg leading-8.25 font-medium text-gray-500 max-w-xl mx-auto'>
            Fill out the form below and our investment team will reach out to
            schedule a personalized consultation to discuss your real estate
            investment goals.
          </p>
        </div>

        {/* Feature cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 sm:mb-12'>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* Form card */}
        <div className='bg-white rounded-2xl drop-shadow-[0px_25px_25px_rgba(0,0,0,0.25)] p-6 sm:p-10'>
          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex flex-col gap-5'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='bc-fullName'
                  className='text-sm font-medium text-black'
                >
                  Full Name <span className='text-orange-500'>*</span>
                </label>
                <input
                  id='bc-fullName'
                  name='fullName'
                  type='text'
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder='Enter your full legal name'
                  required
                  className={inputClass}
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='bc-email'
                  className='text-sm font-medium text-black'
                >
                  Email Address <span className='text-orange-500'>*</span>
                </label>
                <input
                  id='bc-email'
                  name='email'
                  type='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter your email address'
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='bc-phone'
                className='text-sm font-medium text-black'
              >
                Phone Number <span className='text-orange-500'>*</span>
              </label>
              <input
                id='bc-phone'
                name='phone'
                type='tel'
                value={form.phone}
                onChange={handleChange}
                placeholder='Enter your phone number'
                required
                className={inputClass}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='bc-date'
                  className='text-sm font-medium text-black'
                >
                  Preferred Consultation Date
                </label>
                <input
                  id='bc-date'
                  name='date'
                  type='date'
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='bc-time'
                  className='text-sm font-medium text-black'
                >
                  Preferred Time
                </label>
                <input
                  id='bc-time'
                  name='time'
                  type='time'
                  value={form.time}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='bc-message'
                className='text-sm font-medium text-black'
              >
                Additional Information
              </label>
              <textarea
                id='bc-message'
                name='message'
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="Share your investment goals, experience level, preferred timeline, and any specific questions you'd like to discuss..."
                className='w-full border border-gray-200 rounded-[10px] px-4 py-3 text-sm text-black placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none bg-white'
              />
            </div>
            <div className='bg-[rgba(15,23,42,0.05)] border-l-4 border-orange-400 rounded-[10px] pl-7 pr-6 pt-6 pb-5'>
              <p className='text-sm font-bold text-black mb-3'>
                What to Expect:
              </p>
              <ul className='flex flex-col gap-2'>
                {WHAT_TO_EXPECT.map((item) => (
                  <li key={item} className='flex items-start gap-2'>
                    <span
                      className='text-orange-400 text-sm font-normal leading-5 shrink-0 mt-0.5'
                      aria-hidden='true'
                    >
                      ✓
                    </span>
                    <span className='text-sm text-gray-500 leading-5'>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type='submit'
              disabled={submitting}
              className='h-16 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg rounded-[10px] transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center drop-shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)]'
            >
              {submitting ? 'Submitting...' : 'Schedule Consultation'}
            </button>
            <p className='text-xs text-gray-400 text-center leading-relaxed'>
              By submitting this form, you agree to our privacy policy and
              consent to be contacted by our investment team regarding real
              estate opportunities.
            </p>
          </form>
        </div>

        {/* Contact info strip */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 sm:mt-12'>
          {CONTACT_ITEMS.map((c) => (
            <ContactItem key={c.label} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
});

BookConsultationSection.displayName = 'BookConsultationSection';

export default BookConsultationSection;
