export const APP_CONFIG = {
  NAME: process.env.REACT_APP_NAME || 'SKYRIDGEGROUP',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
};

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BUY: '/buy',
  RENOVATION: '/renovation-construction',
  RENOVATION_DETAILS: '/renovation-construction/:id',
  NEW_CONSTRUCTION: '/new-construction',
  RENOVATION_SERVICE: '/renovation-service',
  MORTGAGE: '/mortgage',
  WHOLESALE: '/wholesale',
  PORTFOLIO: '/portfolio',
  CASE_STUDY_DETAIL: '/portfolio/case-study/:id',
  CHAT: '/chat',
  PROPERTY_DETAILS_OFFER: '/property/offer/:id',
  PROPERTY_DETAILS: '/property/:id',
  SERVICES: '/services',
  CONTACT: '/contact',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_CONDITION: '/terms-condition',
  INVESTMENT: '/investment',
  BOOK_CONSULTATION: '/book-consultation',
  PROPERTIES: '/properties',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  OTP_VERIFICATION: '/otp-verification',
  RESET_PASSWORD: '/reset-password',
  ADMIN: '/admin',
  REDUX_DEMO: '/redux-demo',
  // User dashboard sub-routes
  USER: '/user',
  USER_DASHBOARD: '/user/dashboard',
  USER_MESSAGES: '/user/messages',
  USER_PROFILE: '/user/profile',
  // Admin sub-routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EMAILS: '/admin/emails',
  ADMIN_LEADS: '/admin/leads',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_MARKETPLACE_ORDERS: '/admin/marketplace-orders',
  ADMIN_CASE_STUDIES: '/admin/case-studies',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_PRICING: '/admin/pricing',
  // Admin -- new structure matching Figma
  ADMIN_LISTING_PROPERTY: '/admin/listing-property',
  ADMIN_EDIT_PROPERTY: '/admin/listing-property/edit/:id',
  ADMIN_ADD_PROPERTY: '/admin/listing-property/add',
  ADMIN_ADD_PROPERTY_STEP: '/admin/listing-property/add/:step',
  ADMIN_LEADS_INQUIRIES: '/admin/leads-inquiries',
  ADMIN_PORTFOLIO: '/admin/portfolio',
  ADMIN_ADD_PORTFOLIO: '/admin/portfolio/add',
  ADMIN_EDIT_PORTFOLIO: '/admin/portfolio/edit/:id',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_MORTGAGE_APPLICATIONS: '/admin/mortgage-applications',
  ADMIN_FEE_BUILDER: '/admin/fee-builder',
  ADMIN_NEW_CONSTRUCTION: '/admin/new-construction',
  ADMIN_NEW_CONSTRUCTION_DETAILS: '/admin/new-construction/:id',
  ADMIN_RENOVATION: '/admin/renovation',
  ADMIN_INVESTMENT: '/admin/investment',
  ADMIN_CONSULTATION: '/admin/consultation',
  ADMIN_MESSAGES: '/admin/messages',
};

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  VITALS_ENDPOINT: process.env.REACT_APP_VITALS_ENDPOINT || '',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
  RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3', 10),
  RETRY_DELAY: parseInt(process.env.REACT_APP_API_RETRY_DELAY || '1000', 10),
};

export const SEO_CONFIG = {
  DEFAULT_TITLE: process.env.REACT_APP_SEO_TITLE || 'SKYRIDGEGROUP',
  DEFAULT_DESCRIPTION:
    process.env.REACT_APP_SEO_DESCRIPTION || 'A professional React application',
  DEFAULT_KEYWORDS: (
    process.env.REACT_APP_SEO_KEYWORDS || 'react,webpack,tailwind'
  ).split(','),
  SITE_URL: typeof window !== 'undefined' ? window.location.origin : '',
};

export const PERFORMANCE_BUDGETS = {
  LCP: 2500,
  FCP: 1800,
  CLS: 0.1,
  INP: 200,
  TTFB: 800,
};

export const TOAST_CONFIG = {
  POSITION: 'top-center',
  DURATION: 3000,
};
