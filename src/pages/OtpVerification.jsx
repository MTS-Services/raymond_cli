import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { loginSuccess } from '../store/slices/authSlice';
import { useSEO } from '../hooks/useSEO';
import { useGsapButton } from '../hooks/useGsapButton';
import { ROUTES } from '../config';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

const HERO_IMAGE = '/loginHeroBg.webp';

const CODE_LENGTH = 5;

const OtpVerification = memo(() => {
  useSEO({
    title: 'OTP Verification',
    description: 'Enter the verification code sent to your email.',
  });

  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Guard: if arrived without email (e.g. direct URL access), go back to forgot-password
  const email = state?.email ?? '';
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [email, navigate]);

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const btnRef = useGsapButton();

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleDigitChange = useCallback((index, value) => {
    // Allow only single digit
    const char = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    setError('');
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace') {
        if (digits[index]) {
          // Clear current cell
          setDigits((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
          });
        } else if (index > 0) {
          // Move focus to previous and clear it
          inputRefs.current[index - 1]?.focus();
          setDigits((prev) => {
            const next = [...prev];
            next[index - 1] = '';
            return next;
          });
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, CODE_LENGTH);
      if (!pasted) return;
      const next = [...digits];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      setDigits(next);
      setError('');
      const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [digits],
  );

  const handleVerify = useCallback(
    async (e) => {
      e.preventDefault();
      const code = digits.join('');
      if (code.length < CODE_LENGTH) {
        setError('Please enter all 5 digits of the verification code.');
        return;
      }
      setError('');
      setIsLoading(true);
      try {
        const response = await axiosInstance.post('/api/v1/auth/verify-otp', {
          email,
          otp: code,
        });

        if (response.success && response.data?.resetToken) {
          navigate(ROUTES.RESET_PASSWORD, {
            state: { email, resetToken: response.data.resetToken },
            replace: true,
          });
        } else {
          setError(response.message || 'Invalid verification code.');
        }
      } catch (error) {
        setError(error?.message || 'Verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [digits, navigate, email],
  );

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    setDigits(Array(CODE_LENGTH).fill(''));
    setError('');
    
    try {
      await axiosInstance.post('/api/v1/auth/forgot-password', { email });
      setResendCooldown(60);
      inputRefs.current[0]?.focus();
      toast.success('A new verification code has been sent.');
    } catch (error) {
      setError(error?.message || 'Failed to resend code.');
    }
  }, [resendCooldown, email]);

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
          to={ROUTES.FORGOT_PASSWORD}
          className='absolute top-6 right-6 z-10 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 font-medium transition-colors duration-200 group'
        >
          <ArrowLeft
            size={15}
            aria-hidden='true'
            className='transition-transform duration-200 group-hover:-translate-x-0.5'
          />
          Back
        </Link>

        {/* Vertically centred card */}
        <div className='flex-1 flex items-center justify-center px-6 py-16 overflow-y-auto'>
          <div className='w-full max-w-90 bg-white rounded-lg border border-gray-100 shadow-sm p-8'>
            {/* Heading */}
            <div className='flex flex-col gap-3 mb-8'>
              <h1 className='text-xl font-semibold leading-7 text-gray-950'>
                OTP Verification
              </h1>
              <p className='text-base leading-5 text-gray-700'>
                Enter the verification code we just sent to your email address
                {email && (
                  <>
                    {' '}
                    <span className='font-medium text-gray-950'>{email}</span>
                  </>
                )}
                .
              </p>
            </div>

            {/* OTP form */}
            <form onSubmit={handleVerify} noValidate>
              {/* 5-digit boxes */}
              <div
                className='flex gap-3 mb-6'
                role='group'
                aria-label='One-time password'
              >
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    aria-label={`Digit ${i + 1}`}
                    className={`w-full aspect-square text-center text-lg font-semibold text-gray-950 bg-white border-2 rounded-lg focus:outline-none transition-colors ${
                      digit
                        ? 'border-orange-500 text-orange-500'
                        : 'border-slate-200 focus:border-orange-500'
                    } ${error ? 'border-red-400' : ''}`}
                  />
                ))}
              </div>

              {/* Inline error */}
              {error && (
                <p className='text-xs text-red-600 mb-4' role='alert'>
                  {error}
                </p>
              )}

              {/* Verify button */}
              <button
                ref={btnRef}
                type='submit'
                disabled={isLoading}
                className='w-full h-12 bg-orange-500 hover:bg-orange-600 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 mb-4'
              >
                {isLoading ? (
                  <span
                    className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
                    aria-hidden='true'
                  />
                ) : (
                  'Verify'
                )}
              </button>

              {/* Resend */}
              <p className='text-center text-sm leading-5 text-gray-700'>
                Didn&apos;t receive a code?{' '}
                {resendCooldown > 0 ? (
                  <span className='text-gray-400'>
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type='button'
                    onClick={handleResend}
                    className='font-medium text-orange-500 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded cursor-pointer'
                  >
                    Resend
                  </button>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

OtpVerification.displayName = 'OtpVerification';
export default OtpVerification;
