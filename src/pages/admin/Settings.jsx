import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/axiosInstance';
import API_ENDPOINTS from '../../services/httpEndpoint';
import { Camera, Eye, EyeOff, User } from 'lucide-react';

const PROFILE_AVATAR = '';

// No local fallback data; profile will be populated from backend only

const Field = ({ label, children }) => (
  <div className='flex flex-col gap-2'>
    <label className='text-[10px] font-medium text-icon-mid uppercase tracking-[2px]'>
      {label}
    </label>
    {children}
  </div>
);

const IdentityInput = (props) => (
  <input
    {...props}
    className='bg-input-bg rounded-lg px-4 py-3 text-sm font-medium text-ink-admin placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow w-full'
  />
);

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-base text-ink-deep-alt'>{label}</label>
      <div className='relative'>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className='border border-border-very-light rounded px-4 py-3 pr-11 text-base text-ink-deep-alt placeholder:text-gray-400 focus:outline-none focus:border-orange-400 transition-colors w-full'
        />
        <button
          type='button'
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
        >
          {show ? (
            <EyeOff size={18} aria-hidden='true' />
          ) : (
            <Eye size={18} aria-hidden='true' />
          )}
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
  });
  const [avatarSrc, setAvatarSrc] = useState(PROFILE_AVATAR);
  const fileInputRef = useRef(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
        if (!mounted) return;

        // axiosInstance returns response.data per interceptor. Backend returns { success, message, data }
        const profile = res?.data ?? res;

        setForm({
          fullName: profile?.name ?? '',
          email: profile?.email ?? '',
          oldPwd: '',
          newPwd: '',
          confirmPwd: '',
        });

        if (profile?.profileImage) setAvatarSrc(profile.profileImage);
      } catch (err) {
        console.error('Failed loading profile:', err);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc((prev) => {
      if (prev && prev.startsWith && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    setProfileFile(file);
    e.target.value = '';
  };

  const handleSaveProfile = async () => {
    // send multipart form data: profileImage (file), name, email
    const formData = new FormData();
    formData.append('name', form.fullName || '');
    formData.append('email', form.email || '');
    if (profileFile) formData.append('profileImage', profileFile);

    setProfileLoading(true);
    try {
      const res = await axiosInstance.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const profile = res?.data ?? res;
      // update UI from returned profile object when available
      if (profile?.name || profile?.email) {
        setForm((prev) => ({ ...prev, fullName: profile.name ?? prev.fullName, email: profile.email ?? prev.email }));
      }
      if (profile?.profileImage) setAvatarSrc(profile.profileImage);

      toast.success('Profile updated successfully');
      setProfileFile(null);
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!form.oldPwd || !form.newPwd || !form.confirmPwd) {
      toast.error('Please fill all password fields');
      return;
    }
    if (form.newPwd !== form.confirmPwd) {
      toast.error('New password and confirmation do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const payload = {
        oldPassword: form.oldPwd,
        newPassword: form.newPwd,
        confirmedPassword: form.confirmPwd,
      };

      await axiosInstance.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
      toast.success('Password changed successfully');
      setForm((prev) => ({ ...prev, oldPwd: '', newPwd: '', confirmPwd: '' }));
    } catch (err) {
      console.error('Change password error:', err);
      toast.error(err?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Page Header */}
      <div className='space-y-3'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Account Settings
        </h1>
        <p className='text-gray-500 text-base mt-1'>
          Manage your architectural portfolio, security protocols, and platform
          engagement preferences from a centralized command center.
        </p>
      </div>

      {/* Cards — single col on mobile, 2-col side-by-side on lg, equal height */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch'>
        {/* Personal Identity Card */}
        <div className='bg-white rounded-xl p-5 sm:p-6 lg:p-8 space-y-6 shadow-sm flex flex-col'>
          <div>
            <h2 className='text-2xl font-semibold capitalize text-ink-deep-alt'>
              Personal Identity
            </h2>
            <p className='text-sm text-icon-mid mt-0.5'>
              Update your public profile and contact details.
            </p>
          </div>

          {/* Profile photo row */}
          <div className='flex items-center gap-6 pb-4 border-b border-gray-100'>
            <div className='relative shrink-0'>
              <div className='w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-gray-50'>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt='Admin profile'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    <User size={48} aria-hidden='true' />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png,image/gif'
                className='hidden'
                onChange={handlePhotoChange}
              />
              <button
                type='button'
                aria-label='Change profile photo'
                onClick={() => fileInputRef.current?.click()}
                className='absolute -bottom-2 -right-2 bg-purple-deep hover:bg-purple-hover text-white p-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-md'
              >
                <Camera size={12} aria-hidden='true' />
              </button>
            </div>
            <div>
              <p className='text-sm font-bold text-dark-navy'>Profile Photo</p>
              <p className='text-xs text-icon-muted mt-1'>
                JPG, GIF or PNG. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Identity fields — single col on mobile, 2-col on md+ */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto'>
            <Field label='Full Name'>
              <IdentityInput
                value={form.fullName}
                placeholder='Enter your full name'
                onChange={onChange('fullName')}
              />
            </Field>
            <Field label='Email Address'>
              <IdentityInput
                type='email'
                value={form.email}
                placeholder='Enter your email address'
                onChange={onChange('email')}
              />
            </Field>
          </div>
          <div className='pt-4'>
            <button
              type='button'
              onClick={handleSaveProfile}
              disabled={profileLoading}
              className={`bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-8 py-3 rounded-md transition-colors cursor-pointer w-full sm:w-auto ${profileLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div className='bg-white rounded-xl p-5 sm:p-6 lg:p-8 space-y-6 shadow-sm flex flex-col'>
          <h2 className='text-2xl font-semibold capitalize text-ink-deep-alt'>
            Change Password
          </h2>

          <div className='space-y-5'>
            <PasswordField
              label='Old Password'
              value={form.oldPwd}
              onChange={onChange('oldPwd')}
              placeholder='Enter your current password'
            />
            {/* New + Confirm side-by-side on md+ */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <PasswordField
                label='New Password'
                value={form.newPwd}
                onChange={onChange('newPwd')}
                placeholder='Enter your new password'
              />
              <PasswordField
                label='Confirm New Password'
                value={form.confirmPwd}
                onChange={onChange('confirmPwd')}
                placeholder='Confirm your new password'
              />
            </div>
          </div>

          <div className='pt-2 mt-auto'>
            <button
              type='button'
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className={`bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-8 py-3 rounded-md transition-colors cursor-pointer w-full sm:w-auto ${passwordLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {passwordLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      {/* end grid */}
    </div>
  );
};

export default Settings;
