import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { logout, selectUser } from '../../../../store/slices/authSlice';
import { ROUTES } from '../../../../config';
import {
  MessageSquare,
  User,
  LogOut,
  X,
  ChevronsRight,
  ChevronsLeft,
  House,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Messages', path: ROUTES.USER_MESSAGES, icon: MessageSquare },
  { name: 'Profile', path: ROUTES.USER_PROFILE, icon: User },
];

const NAV_BASE =
  'group flex items-center gap-3 rounded-lg border text-base font-medium transition-all duration-200 pl-3.25 pr-3 py-2.5 hover:-translate-y-0.5';
const NAV_ACTIVE =
  'bg-orange-100 text-orange-700 border-transparent shadow-[inset_3px_0_0_0_#ea580c]';
const NAV_INACTIVE =
  'text-gray-700 border-gray-100 hover:bg-orange-50/40 hover:text-gray-900 hover:border-orange-100';

const getNavClass = ({ isActive }) =>
  `${NAV_BASE} ${isActive ? NAV_ACTIVE : NAV_INACTIVE}`;

const UserSidebar = ({ onClose, isCollapsed, onExpand, onDesktopClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully');
    setTimeout(() => navigate(ROUTES.LOGIN), 900);
  };

  if (isCollapsed) {
    return (
      <div className='h-full w-full bg-white flex flex-col items-center border-r border-gray-100 py-3 gap-1'>
        <Link
          to={ROUTES.HOME}
          title='Back to Home'
          aria-label='Back to Home'
          className='w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50/40 transition-colors duration-200 shrink-0'
        >
          <House size={20} aria-hidden='true' />
        </Link>
        <button
          type='button'
          onClick={onExpand}
          title='Expand sidebar'
          aria-label='Expand sidebar'
          className='w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-orange-50/40 transition-colors duration-200 mb-2 shrink-0 cursor-pointer'
        >
          <ChevronsRight size={20} aria-hidden='true' />
        </button>

        <nav
          className='flex-1 flex flex-col items-center gap-1 w-full px-2'
          aria-label='User navigation'
        >
          {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              title={name}
              onClick={onClose}
              className={({ isActive }) =>
                `w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-orange-50/40'
                }`
              }
            >
              <Icon size={20} aria-hidden='true' />
            </NavLink>
          ))}
        </nav>

        <button
          type='button'
          onClick={handleLogout}
          title='Sign Out'
          aria-label='Sign Out'
          className='mt-1 w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 shrink-0 cursor-pointer'
        >
          <LogOut size={20} aria-hidden='true' />
        </button>
      </div>
    );
  }

  return (
    <div className='h-full w-full bg-white flex flex-col border-r border-gray-100'>
      {/* Header */}
      <div className='relative flex items-center px-5 py-4 border-b border-gray-100 shrink-0'>
        <Link
          to={ROUTES.HOME}
          aria-label='Skyridge Group -- Back to Home'
          className='transition-opacity duration-200 hover:opacity-75 shrink-0'
        >
          <img
            src='/mobileLogo.png'
            alt='Skyridge Group'
            className='h-7 w-auto object-contain object-left'
          />
        </Link>
        <div className='absolute right-3 flex items-center gap-1'>
          <button
            type='button'
            onClick={onDesktopClose}
            title='Collapse sidebar'
            aria-label='Collapse sidebar'
            className='hidden lg:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
          >
            <ChevronsLeft size={18} aria-hidden='true' />
          </button>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close navigation'
            className='lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
          >
            <X size={18} aria-hidden='true' />
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className='flex-1 overflow-y-auto px-3 py-4'>
        <p className='text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2'>
          Main Menu
        </p>
        <nav className='flex flex-col gap-1' aria-label='User navigation'>
          {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={getNavClass}
            >
              <Icon size={18} className='shrink-0' aria-hidden='true' />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User info + logout */}
      <div className='px-4 py-4 border-t border-gray-100 shrink-0'>
        <div className='flex items-center gap-3 mb-3 px-1'>
          <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0'>
            <User size={15} className='text-orange-600' aria-hidden='true' />
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-semibold text-gray-800 truncate'>
              {user?.name ?? 'User'}
            </span>
            <span className='text-xs text-gray-400 truncate'>
              {user?.email ?? ''}
            </span>
          </div>
        </div>
        <button
          type='button'
          onClick={handleLogout}
          className='flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-base text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium cursor-pointer'
        >
          <LogOut size={16} aria-hidden='true' />
          Sign Out
        </button>
      </div>
    </div>
  );
};

UserSidebar.displayName = 'UserSidebar';
export default UserSidebar;
