import React, { useState, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { useSEO } from '../hooks/useSEO';
import { ROUTES } from '../config';
import AnimatedButton from '../components/shared/AnimatedButton';
import axiosInstance from '../services/axiosInstance';

const HERO_IMAGE = '/loginHeroBg.webp';

const NAME_REGEX = /^.{2,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const MIN_PASSWORD_LENGTH = 8;

const Register = memo(() => {
  useSEO({
    title: 'Sign Up',
    description: 'Create your Skyridge Group account.',
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = useCallback(() => {
    const errs = {};
    if (!name.trim() || !NAME_REGEX.test(name.trim())) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!PHONE_REGEX.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errs.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return errs;
  }, [name, email, phone, password]);

  const handleSignUp = useCallback(
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
        const response = await axiosInstance.post('/api/v1/auth/register', {
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phone.trim(),
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
          setErrors({ form: response.message || 'Registration failed.' });
        }
      } catch (error) {
        setErrors({
          form: error?.message || 'Failed to register. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [validate, name, email, phone, password, dispatch, navigate],
  );

  const handleNameChange = useCallback(
    (e) => {
      setName(e.target.value);
      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
    },
    [errors.name],
  );

  const handleEmailChange = useCallback(
    (e) => {
      setEmail(e.target.value);
      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
    },
    [errors.email],
  );

  const handlePhoneChange = useCallback(
    (e) => {
      setPhone(e.target.value);
      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
    },
    [errors.phone],
  );

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value);
      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
    },
    [errors.password],
  );

  return (
    <div className='min-h-dvh flex'>
      <div className='hidden lg:block lg:w-1/2 relative overflow-hidden bg-sky-200'>
        <img
          src={HERO_IMAGE}
          alt='Luxury property'
          className='absolute inset-0 w-full h-full object-cover'
        />
      </div>

      <div className='flex-1 flex flex-col bg-white shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)]'>
        <div className='flex-1 flex items-center justify-center px-6 py-16 overflow-y-auto'>
          <div className='w-full max-w-153.5'>
            {/* Heading */}
            <div className='flex flex-col gap-3 mb-6'>
              <h1 className='font-poppins font-medium text-2xl leading-normal text-gray-950'>
                Personal Information
              </h1>
              <p className='text-base leading-7 text-gray-700'>
                Provide your basic personal details to create your user profile.
              </p>
            </div>

            {errors.form && (
              <div
                role='alert'
                className='bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5'
              >
                {errors.form}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSignUp}
              noValidate
              className='flex flex-col gap-6'
            >
              {/* Fields */}
              <div className='flex flex-col gap-4'>
                {/* Full Name */}
                <div className='flex flex-col gap-2.5'>
                  <label
                    htmlFor='reg-name'
                    className='text-base font-medium leading-5 text-gray-700'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='reg-name'
                    autoComplete='name'
                    value={name}
                    onChange={handleNameChange}
                    placeholder='Enter your full name'
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? 'reg-name-error' : undefined
                    }
                    className={`w-full h-15 bg-indigo-50 border rounded-lg px-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                      errors.name ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.name && (
                    <p
                      id='reg-name-error'
                      role='alert'
                      className='text-xs text-red-600'
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className='flex flex-col gap-2.5'>
                  <label
                    htmlFor='reg-email'
                    className='text-base font-medium leading-5 text-gray-700'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='reg-email'
                    autoComplete='email'
                    value={email}
                    onChange={handleEmailChange}
                    placeholder='Enter your email..'
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? 'reg-email-error' : undefined
                    }
                    className={`w-full h-15 bg-indigo-50 border rounded-lg px-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                      errors.email ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id='reg-email-error'
                      role='alert'
                      className='text-xs text-red-600'
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className='flex flex-col gap-2.5'>
                  <label
                    htmlFor='reg-phone'
                    className='text-base font-medium leading-5 text-gray-700'
                  >
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    id='reg-phone'
                    autoComplete='tel'
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder='Enter your Phone number..'
                    aria-invalid={!!errors.phone}
                    aria-describedby={
                      errors.phone ? 'reg-phone-error' : undefined
                    }
                    className={`w-full h-15 bg-indigo-50 border rounded-lg px-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                      errors.phone ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.phone && (
                    <p
                      id='reg-phone-error'
                      role='alert'
                      className='text-xs text-red-600'
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className='flex flex-col gap-2.5'>
                  <label
                    htmlFor='reg-password'
                    className='text-base font-medium leading-5 text-gray-700'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='reg-password'
                    autoComplete='new-password'
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder='write password'
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? 'reg-password-error' : undefined
                    }
                    className={`w-full h-15 bg-indigo-50 border rounded-lg px-3.5 text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${
                      errors.password ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.password && (
                    <p
                      id='reg-password-error'
                      role='alert'
                      className='text-xs text-red-600'
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className='flex flex-col gap-6 items-center'>
                <AnimatedButton
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-12 bg-orange-500 hover:bg-orange-500 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white cursor-pointer font-poppins font-medium text-base rounded-lg flex items-center justify-center transition-colors duration-200'
                >
                  {isLoading ? (
                    <span
                      className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
                      aria-hidden='true'
                    />
                  ) : (
                    'Sign UP'
                  )}
                </AnimatedButton>

                <p className='text-center text-base text-gray-700'>
                  Already Have an account{' '}
                  <Link
                    to={ROUTES.LOGIN}
                    className='font-poppins font-semibold text-orange-500 underline decoration-solid hover:text-orange-500 transition-colors'
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

Register.displayName = 'Register';
export default Register;
