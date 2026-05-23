import React, { useState, useCallback, useEffect, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSEO } from '../hooks/useSEO';
import { useGsapButton } from '../hooks/useGsapButton';
import { ROUTES } from '../config';
import axiosInstance from '../services/axiosInstance';

const HERO_IMAGE = '/loginHeroBg.webp';

const ResetPassword = memo(() => {
  useSEO({
    title: 'Reset Password',
    description: 'Create a new password for your Skyridge Group account.',
  });

  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email ?? '';
  const resetToken = state?.resetToken ?? '';
  
  useEffect(() => {
    if (!email || !resetToken) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, resetToken, navigate]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useGsapButton();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      if (!password || !confirmPassword) {
        toast.error('Both password fields are required.');
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          '/api/v1/auth/reset-password',
          {
            newPassword: password,
            confirmedPassword: confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${resetToken}`,
            },
          }
        );

        if (response.success) {
          toast.success(response.message || 'Password reset successfully! Please sign in.');
          navigate(ROUTES.LOGIN, { replace: true });
        } else {
          toast.error(response.message || 'Failed to reset password.');
        }
      } catch (error) {
        toast.error(error?.message || 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [password, confirmPassword, resetToken, navigate],
  );

  const toggleShowPassword = useCallback(() => setShowPassword((v) => !v), []);

  const toggleShowConfirmPassword = useCallback(
    () => setShowConfirmPassword((v) => !v),
    [],
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
          to={ROUTES.OTP_VERIFICATION}
          className='absolute top-6 right-6 z-10 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 font-medium transition-colors duration-200 group'
        >
          <ArrowLeft
            size={15}
            aria-hidden='true'
            className='transition-transform duration-200 group-hover:-translate-x-0.5'
          />
          Back
        </Link>

        {/* Vertically centred form */}
        <div className='flex-1 flex items-center justify-center px-6 py-16 overflow-y-auto'>
          <div className='w-full max-w-90'>
            {/* Heading */}
            <div className='flex flex-col gap-3 mb-6'>
              <h1 className='text-xl font-semibold leading-7 text-gray-950'>
                Reset Password
              </h1>
              <p className='text-base leading-5 text-gray-700'>
                Create a new password for your account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className='flex flex-col gap-4'
            >
              {/* Password field */}
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='rp-password'
                  className='text-sm leading-5 text-slate-900'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='rp-password'
                    autoComplete='new-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter new password'
                    className='w-full h-11 bg-indigo-50 border border-slate-200 rounded-xs pl-3 pr-11 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all'
                  />
                  <button
                    type='button'
                    onClick={toggleShowPassword}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-900 transition-colors cursor-pointer'
                  >
                    {showPassword ? (
                      <EyeOff size={20} aria-hidden='true' />
                    ) : (
                      <Eye size={20} aria-hidden='true' />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password field */}
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='rp-confirm'
                  className='text-sm leading-5 text-slate-900'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id='rp-confirm'
                    autoComplete='new-password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                    className='w-full h-11 bg-indigo-50 border border-slate-200 rounded-xs pl-3 pr-11 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all'
                  />
                  <button
                    type='button'
                    onClick={toggleShowConfirmPassword}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-900 transition-colors cursor-pointer'
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} aria-hidden='true' />
                    ) : (
                      <Eye size={20} aria-hidden='true' />
                    )}
                  </button>
                </div>
              </div>

              {/* Reset Password button */}
              <button
                ref={btnRef}
                type='submit'
                disabled={isLoading}
                className='w-full h-12 bg-orange-500 hover:bg-orange-600 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white text-sm font-bold uppercase tracking-[0.168px] rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 mt-2'
              >
                {isLoading ? (
                  <span
                    className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
                    aria-hidden='true'
                  />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={20} aria-hidden='true' />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

ResetPassword.displayName = 'ResetPassword';
export default ResetPassword;
