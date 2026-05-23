import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { ROUTES } from '../config';
import {
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import AnimatedButton from '../components/shared/AnimatedButton';
import axiosInstance from '../services/axiosInstance';

const HERO_IMAGE = '/loginHeroBg.webp';

const SUBTITLE = 'Sign in to access your account, manage your properties, and connect with our agents.';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);

  const validate = useCallback(() => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    return errs;
  }, [email, password]);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      setErrors({});
      setIsLoading(true);
      try {
        const response = await axiosInstance.post('/api/v1/auth/login', {
          email,
          password,
        });

        if (response.success) {
          const { user, token } = response.data;
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          dispatch(
            loginSuccess({
              user,
              token,
            }),
          );

          let destination = ROUTES.HOME;
          switch (user.role?.toUpperCase()) {
            case 'ADMIN':
              destination = ROUTES.ADMIN_DASHBOARD;
              break;
            case 'USER':
              destination = ROUTES.USER_DASHBOARD;
              break;
            default:
              destination = ROUTES.USER_DASHBOARD;
              break;
          }
          navigate(destination, { replace: true });
        } else {
          setErrors({ form: response.message || 'Login failed. Please try again.' });
        }
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message || error?.data?.message || error?.message;
        setErrors({
          form: serverMessage || 'Invalid credentials. Please check your email and password.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [validate, email, password, dispatch, navigate],
  );

  return (
    <div className='min-h-dvh flex'>
      <div className='hidden lg:block lg:w-1/2 relative overflow-hidden bg-sky-200'>
        <img
          src={HERO_IMAGE}
          alt='Luxury property with pool'
          className='absolute inset-0 w-full h-full object-cover'
        />
      </div>

      <div className='flex-1 relative flex flex-col bg-white shadow-[-7px_0_11px_rgba(0,0,0,0.25)]'>
        {/* Floating back link */}
        <Link
          to={ROUTES.HOME}
          className='absolute top-6 right-6 z-10 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 font-medium transition-colors duration-200 group'
        >
          <ArrowLeft
            size={15}
            aria-hidden='true'
            className='transition-transform duration-200 group-hover:-translate-x-0.5'
          />
          Back to Home
        </Link>

        {/* Vertically centred form */}
        <div className='flex-1 flex items-center justify-center px-6 py-16 overflow-y-auto'>
          <div className='w-full max-w-103.5'>
            <h1 className='font-poppins text-2xl font-medium text-black leading-normal mb-2'>
              Login to Continue
            </h1>
            <p className='text-gray-700 text-base leading-6 mb-6'>
              {SUBTITLE}
            </p>



            {errors.form && (
              <div
                role='alert'
                className='bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5'
              >
                {errors.form}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className='space-y-4'>
              {/* Email */}
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='email'
                  className='font-poppins text-base text-black leading-normal'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email here...'
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full h-12 px-4 bg-[rgba(201,215,255,0.5)] rounded-lg text-base text-gray-900 placeholder-gray-400 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                    errors.email ? 'border-red-400' : 'border-transparent'
                  }`}
                />
                {errors.email && (
                  <p id='email-error' className='text-xs text-red-600 mt-0.5'>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='password'
                  className='font-poppins text-base text-black leading-normal'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    autoComplete='current-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter your password here...'
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    className={`w-full h-12 px-4 pr-11 bg-[rgba(201,215,255,0.5)] rounded-lg text-base text-gray-900 placeholder-gray-400 border focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                      errors.password ? 'border-red-400' : 'border-transparent'
                    }`}
                  />
                  <button
                    type='button'
                    onClick={togglePassword}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer'
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id='password-error'
                    className='text-xs text-red-600 mt-0.5'
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password -- right-aligned per Figma */}
              <div className='flex justify-end'>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className='font-poppins font-medium text-base text-orange-500 underline decoration-solid whitespace-nowrap hover:text-orange-500 transition-colors'
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In button */}
              <AnimatedButton
                type='submit'
                disabled={isLoading}
                className='w-full h-12 bg-orange-500 hover:bg-orange-500 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white rounded-lg font-poppins font-medium text-base transition-colors duration-200 flex items-center justify-center gap-2'
              >
                {isLoading && (
                  <span
                    className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
                    aria-hidden='true'
                  />
                )}
                {isLoading ? 'Signing in\u2026' : 'Sign In'}
              </AnimatedButton>
            </form>

            <p className='mt-6 text-center text-base text-gray-700'>
              Don&apos;t Have an account{' '}
              <Link
                to={ROUTES.REGISTER}
                className='font-poppins font-semibold text-orange-500 underline decoration-solid hover:text-orange-500 transition-colors'
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.displayName = 'Login';
export default Login;
