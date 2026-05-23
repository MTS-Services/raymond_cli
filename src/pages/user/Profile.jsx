import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Camera,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../store/slices/authSlice';
import axiosInstance from '../../services/axiosInstance';
import API_ENDPOINTS from '../../services/httpEndpoint';
import { useGsapButton } from '../../hooks/useGsapButton';
import toast from 'react-hot-toast';

const inputCls =
  'w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all';

const Field = ({ label, id, icon: Icon, children }) => (
  <div className='flex flex-col gap-1.5'>
    <label
      htmlFor={id}
      className='text-xs font-semibold uppercase tracking-widest text-gray-400'
    >
      {label}
    </label>
    <div className='relative'>
      {Icon && (
        <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none'>
          <Icon size={15} aria-hidden='true' />
        </span>
      )}
      {React.cloneElement(children, {
        className: Icon
          ? `${children.props.className ?? inputCls} pl-10`
          : (children.props.className ?? inputCls),
      })}
    </div>
  </div>
);

const Card = ({ children }) => (
  <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title, subtitle }) => (
  <div className='flex items-center gap-3 px-6 py-5 border-b border-gray-100'>
    <div className='w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0'>
      <Icon size={18} className='text-orange-500' aria-hidden='true' />
    </div>
    <div>
      <p className='text-sm font-semibold text-gray-800'>{title}</p>
      {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
    </div>
  </div>
);

const SaveButton = React.forwardRef(({ children, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled}
    {...props}
    className='h-11 px-8 bg-orange-500 hover:bg-orange-600 active:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm'
  >
    {children}
  </button>
));
SaveButton.displayName = 'SaveButton';

const PasswordInput = ({ id, value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className='relative'>
      <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none'>
        <Lock size={15} aria-hidden='true' />
      </span>
      <input
        type={show ? 'text' : 'password'}
        id={id}
        autoComplete={autoComplete ?? 'current-password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputCls} pl-10 pr-11`}
      />
      <button
        type='button'
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors'
      >
        {show ? (
          <EyeOff size={16} aria-hidden='true' />
        ) : (
          <Eye size={16} aria-hidden='true' />
        )}
      </button>
    </div>
  );
};

const Spinner = () => (
  <span
    className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'
    aria-hidden='true'
  />
);

const UserProfile = () => {
  const user = useSelector(selectUser);

  // Account state
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(
    user?.name?.split(' ').slice(1).join(' ') ?? '',
  );
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const saveBtnRef = useGsapButton();
  const changeBtnRef = useGsapButton();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
        if (!mounted) return;
        const profile = res?.data ?? res;

        const name = profile?.name ?? '';
        setFirstName(name.split(' ')[0] ?? '');
        setLastName(name.split(' ').slice(1).join(' ') ?? '');
        setEmail(profile?.email ?? '');
        setPhone(profile?.phoneNumber ?? '');
        setAddress(profile?.address ?? '');
        if (profile?.profileImage) setAvatarSrc(profile.profileImage);

        // update redux user object
        if (profile) dispatch(updateUser(profile));
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc((prev) => {
      if (prev && prev.startsWith && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    setProfileFile(file);
  }, []);

  const handleSaveChanges = useCallback(async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      formData.append('name', fullName);
      formData.append('email', email || '');
      formData.append('phoneNumber', phone || '');
      formData.append('address', address || '');
      if (profileFile) formData.append('profileImage', profileFile);

      const res = await axiosInstance.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const profile = res?.data ?? res;
      if (profile) {
        const name = profile.name ?? fullName;
        setFirstName(name.split(' ')[0] ?? '');
        setLastName(name.split(' ').slice(1).join(' ') ?? '');
        setEmail(profile.email ?? email);
        setPhone(profile.phoneNumber ?? phone);
        setAddress(profile.address ?? address);
        if (profile.profileImage) setAvatarSrc(profile.profileImage);
        dispatch(updateUser(profile));
      }

      toast.success('Profile updated successfully.');
      setProfileFile(null);
    } catch (err) {
      console.error('Save profile error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  }, [firstName, lastName, email, phone, address, profileFile, dispatch]);

  const handleChangePassword = useCallback(
    async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      setIsChanging(true);
      try {
        const payload = {
          oldPassword: currentPassword,
          newPassword,
          confirmedPassword: confirmPassword,
        };
        await axiosInstance.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
        toast.success('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        console.error('Change password error:', err);
        toast.error(err?.response?.data?.message || err?.message || 'Failed to change password');
      } finally {
        setIsChanging(false);
      }
    },
    [currentPassword, newPassword, confirmPassword],
  );

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || user?.name || 'User';

  return (
    <div className='flex flex-col gap-6 pb-10'>
      <Card>
        <div className='p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5'>
          {/* Avatar */}
          <div className='relative shrink-0'>
            <div className='w-20 h-20 rounded-2xl bg-orange-50 overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm'>
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                <User
                  size={32}
                  className='text-orange-300'
                  aria-hidden='true'
                />
              )}
            </div>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              aria-label='Change profile photo'
              className='absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-orange-500 hover:bg-orange-600 border-2 border-white rounded-lg flex items-center justify-center transition-colors cursor-pointer shadow-sm'
            >
              <Camera size={13} className='text-white' aria-hidden='true' />
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleAvatarChange}
              aria-label='Upload profile photo'
            />
          </div>

          {/* Identity */}
          <div className='flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left'>
            <div>
              <h2 className='text-lg font-bold text-gray-900 leading-snug'>
                {displayName}
              </h2>
              <p className='text-sm text-gray-400 mt-0.5'>
                {user?.email ?? ''}
              </p>
              <p className='text-xs text-gray-300 mt-2'>
                JPG or PNG · Max 5 MB
              </p>
            </div>
            <span className='inline-flex items-center gap-1.5 self-center sm:self-auto px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-orange-500 text-xs font-semibold uppercase tracking-wide'>
              <ShieldCheck size={13} aria-hidden='true' />
              {user?.role ?? 'user'}
            </span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          icon={User}
          title='Account Settings'
          subtitle='Update your personal information'
        />

        <form onSubmit={handleSaveChanges} noValidate>
          <div className='p-6 flex flex-col gap-5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Field label='First name' id='prof-firstname' icon={User}>
                <input
                  type='text'
                  id='prof-firstname'
                  autoComplete='given-name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='Enter your first name'
                />
              </Field>
              <Field label='Last name' id='prof-lastname' icon={User}>
                <input
                  type='text'
                  id='prof-lastname'
                  autoComplete='family-name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Enter your last name'
                />
              </Field>
              <Field label='Email address' id='prof-email' icon={Mail}>
                <input
                  type='email'
                  id='prof-email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                />
              </Field>
              <Field label='Phone number' id='prof-phone' icon={Phone}>
                <input
                  type='tel'
                  id='prof-phone'
                  autoComplete='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='Enter your phone number'
                />
              </Field>
              <Field label='Address' id='prof-address' icon={MapPin}>
                <input
                  type='text'
                  id='prof-address'
                  autoComplete='street-address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder='Enter your street address'
                />
              </Field>
            </div>

            <div className='flex justify-end pt-1 border-t border-gray-50'>
              <SaveButton ref={saveBtnRef} type='submit' disabled={isSaving}>
                {isSaving ? <Spinner /> : 'Save Changes'}
              </SaveButton>
            </div>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader
          icon={Lock}
          title='Change Password'
          subtitle='Use a strong password to keep your account secure'
        />

        <form onSubmit={handleChangePassword} noValidate>
          <div className='p-6 flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='cp-current'
                className='text-xs font-semibold uppercase tracking-widest text-gray-400'
              >
                Current Password
              </label>
              <PasswordInput
                id='cp-current'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder='Enter your current password'
                autoComplete='current-password'
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='cp-new'
                  className='text-xs font-semibold uppercase tracking-widest text-gray-400'
                >
                  New Password
                </label>
                <PasswordInput
                  id='cp-new'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter your new password'
                  autoComplete='new-password'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <label
                  htmlFor='cp-confirm'
                  className='text-xs font-semibold uppercase tracking-widest text-gray-400'
                >
                  Confirm Password
                </label>
                <PasswordInput
                  id='cp-confirm'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your new password'
                  autoComplete='new-password'
                />
              </div>
            </div>

            <div className='flex justify-end pt-1 border-t border-gray-50'>
              <SaveButton
                ref={changeBtnRef}
                type='submit'
                disabled={isChanging}
              >
                {isChanging ? <Spinner /> : 'Update Password'}
              </SaveButton>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserProfile;
