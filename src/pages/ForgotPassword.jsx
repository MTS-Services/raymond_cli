import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useGsapButton } from '../hooks/useGsapButton';
import { ROUTES } from '../config';
import axiosInstance from '../services/axiosInstance';

const HERO_IMAGE = '/loginHeroBg.webp';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = memo(() => {
  useSEO({
    title: 'Forgot Password',
    description: 'Reset your Skyridge Group account password.',
  });

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useGsapButton();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email.trim()) {
        setError('Email address is required.');
        return;
      }
      if (!EMAIL_REGEX.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      setError('');
      setIsLoading(true);
      try {
        const response = await axiosInstance.post('/api/v1/auth/forgot-password', {
          email: email.trim(),
        });
        
        if (response.success) {
          navigate(ROUTES.OTP_VERIFICATION, { state: { email: email.trim() } });
        } else {
          setError(response.message || 'Failed to send reset code.');
        }
      } catch (error) {
        setError(error?.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, navigate],
  );

  return (
    <div className='min-h-dvh flex'>
      <div className='hidden lg:block lg:w-1/2 relative overflow-hidden bg-sky-200'>
        <img
          src={HERO_IMAGE}
          alt='Skyridge property'
          className='absolute inset-0 w-full h-full object-cover'
        />
      </div>

      <div className='flex-1 relative flex flex-col bg-white shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)]'>
        {/* Floating back link */}
        <Link
          to={ROUTES.LOGIN}
          className='absolute top-6 right-6 z-10 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 font-medium transition-colors duration-200 group'
        >
          <ArrowLeft
            size={15}
            aria-hidden='true'
            className='transition-transform duration-200 group-hover:-translate-x-0.5'
          />
          Back to Login
        </Link>

        {/* Vertically centred form */}
        <div className='flex-1 flex items-center justify-center px-6 py-16 overflow-y-auto'>
          <div className='w-full max-w-90'>
            {/* Heading */}
            <div className='flex flex-col gap-3 mb-6'>
              <h1 className='text-xl font-semibold leading-7 text-gray-950'>
                Forgot Password
              </h1>
              <p className='text-base leading-5 text-gray-700'>
                Enter your email address linked to your account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className='flex flex-col gap-6'
            >
              {/* Email field */}
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='fp-email'
                  className='text-sm leading-5 text-slate-900'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='fp-email'
                  autoComplete='email'
                  placeholder='Enter your email address'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'fp-email-error' : undefined}
                  className={`w-full h-11 bg-indigo-50 border rounded-xs px-3 text-sm text-slate-900 placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                    error ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {error && (
                  <p id='fp-email-error' className='text-xs text-red-600'>
                    {error}
                  </p>
                )}
              </div>

              {/* Send Code button */}
              <button
                ref={btnRef}
                type='submit'
                disabled={isLoading}
                className='w-full h-12 bg-orange-500 hover:bg-orange-600 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white text-sm font-bold uppercase tracking-[0.168px] rounded-lg flex items-center justify-center gap-2 transition-colors duration-200'
              >
                {isLoading ? (
                  <span
                    className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
                    aria-hidden='true'
                  />
                ) : (
                  <>
                    Send Code
                    <ArrowRight size={20} aria-hidden='true' />
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className='flex flex-col gap-2 mt-6'>
              <p className='text-sm leading-5 text-gray-700'>
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className='font-medium text-orange-500 hover:underline transition-colors'
                >
                  Sign In
                </Link>
              </p>
              <p className='text-sm leading-5 text-gray-700'>
                New to Sideguru?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className='font-medium text-orange-500 hover:underline transition-colors'
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ForgotPassword.displayName = 'ForgotPassword';
export default ForgotPassword;
