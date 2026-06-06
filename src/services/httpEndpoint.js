export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/api/v1/auth/me",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    UPDATE_PROFILE: "/api/v1/auth/update-profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    LIST: "/users",
    BY_ID: (id) => `/users/${id}`,
  },

  CONTACT: {
    SEND: "/contact",
  },

  INQUIRIES: {
    LIST: "/api/v1/inquiries",
    SEND: (propertyId) => `/api/v1/inquiries/${propertyId}`,
    BY_ID: (inquiryId) => `/api/v1/inquiries/${inquiryId}`,
    STATUS: (inquiryId) => `/api/v1/inquiries/${inquiryId}/status`,
    DELETE: (inquiryId) => `/api/v1/inquiries/${inquiryId}`,
  }, 

  FEE_BUILDER: {
    LIST: "/api/v1/fee-builder",
    DELETE: (Id) => `/api/v1/fee-builder/${Id}`,
  },

  PORTFOLIOS: {
    LIST: "/api/v1/portfolios",
    CREATE: "/api/v1/portfolios",
    DELETE: (portfolioId) => `/api/v1/portfolios/${portfolioId}`,
    BY_ID: (portfolioId) => `/api/v1/portfolios/${portfolioId}`,
    UPDATE: (portfolioId) => `/api/v1/portfolios/${portfolioId}`,
  },

  SERVICES: {
    LIST: "/services",
    BY_ID: (id) => `/services/${id}`,
  },

  PROPERTIES: {
    LIST: "/api/v1/properties",
    CREATE: "/api/v1/properties",
    BY_ID: (id) => `/api/v1/properties/${id}`,
    DELETE_IMAGE: (propertyId, imageId) =>
      `/api/v1/properties/${propertyId}/images/${imageId}`,
  },

  INVESTMENTS: {
    LIST: "/api/v1/investments",
    CREATE: "/api/v1/investments",
    BY_ID: (id) => `/api/v1/investments/${id}`,
    DELETE: (id) => `/api/v1/investments/${id}`,
    UPDATE: (id) => `/api/v1/investments/${id}`,
    APPLICATIONS: {
      CREATE: "/api/v1/investments/applications",
      LIST: "/api/v1/investments/applications",
      DELETE: (id) => `/api/v1/investments/applications/${id}`,
    },
  },

  CHAT: {
    ROOM: "/api/v1/chat/room", // POST  — user: create/get own room with admin
    ROOMS: "/api/v1/chat/rooms", // GET   — admin: list all rooms
    ROOM_DETAIL: (id) => `/api/v1/chat/rooms/${id}`, // GET   — room details
    MESSAGES: (id) => `/api/v1/chat/rooms/${id}/messages`, // GET   — message history
    SEND_MESSAGE: (id) => `/api/v1/chat/rooms/${id}/messages`, // POST  — send message { content }
    MARK_READ: (id) => `/api/v1/chat/rooms/${id}/read`, // PUT   — mark messages as read
  },
  CONSTRUCTIONS: {
    LIST: "/api/v1/constructions",
    CREATE: "/api/v1/constructions",
    DELETE: (Id) => `/api/v1/constructions/${Id}`,
    BY_ID: (constructionsId) => `/api/v1/constructions/${constructionsId}`,
    UPDATE: (constructionsId) => `/api/v1/constructions/${constructionsId}`,
    REGISTER: (constructionsId) =>
      `/api/v1/constructions/${constructionsId}/register`,
  },
  RENOVATIONS: {
    LIST: "/api/v1/renovations",
    CREATE: "/api/v1/renovations",
    DELETE: (Id) => `/api/v1/renovations/${Id}`,
  },
  CONSULTATIONS: {
    LIST: "/api/v1/consultations",
    CREATE: "/api/v1/consultations",
    DELETE: (Id) => `/api/v1/consultations/${Id}`,
  },
  MORTGAGE_APPLICATIONS: {
    LIST: "/api/v1/mortgage-applications",
    CREATE: "/api/v1/mortgage-applications",
    DELETE: (Id) => `/api/v1/mortgage-applications/${Id}`,
  },
};

export default API_ENDPOINTS;
