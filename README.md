# Real Estate Portal

A production-ready React single-page application for a real-estate portal featuring property listings, mortgage calculators, consultation booking, user authentication, chat, and admin/user areas.

**Live Demo:** Replace with your deployed URL: https://your-live-site.example

---

**Quick Links**
- **Live Site:** https://your-live-site.example (replace with real URL)
- **Architecture & Guidelines:** [frontend-architecture.md](frontend-architecture.md)
- **Redux Guide:** [REDUX_GUIDE.md](REDUX_GUIDE.md)

---

## Summary
This repository contains a feature-first React application intended for property search, enquiries, mortgage calculations and agent consultations. The UI is modular and built for maintainability and performance.

## Features
- Property listings: search, filter, sort, and pagination
- Listing details with images, offers, and contact/enquiry
- Mortgage calculators (purchase & refinance)
- Mortgage application form & local storage
- Authentication: register, login, OTP, reset password
- Real-time chat (socket-based) for user-agent communication
- Role-based routes and layouts for admin and users
- Contact forms and consultation booking flow
- SEO and performance best-practices built-in

---

## Tech stack
- React (JSX)
- Redux Toolkit
- Axios for HTTP
- WebSockets (socket wrapper in `src/services/socket.js`)
- PostCSS / Tailwind utility pipeline (see `postcss.config.js`)
- Webpack build (`webpack.config.js`)

---

## Local Setup
Prerequisites: `Node.js >= 18`, `npm >= 9`

1. Install dependencies

```powershell
npm install
```

2. Copy and configure environment variables

```powershell
cp .env.example .env
# then edit .env to set API & socket endpoints
```

3. Start development server

```powershell
npm start
```

4. Build for production

```powershell
npm run build
```

Useful scripts (in `package.json`)
- `start` — run dev server
- `build` — create production bundle
- `test` — run unit tests
- `lint` / `format` — code quality commands

Environment variables used by the app (examples)
- `REACT_APP_API_BASE_URL` — backend API URL
- `REACT_APP_SOCKET_URL` — websocket server URL

---

## Folder structure (important files)

```
.
├─ public/                 # static files + index.html
├─ src/
│  ├─ App.jsx
│  ├─ index.jsx
│  ├─ index.css
│  ├─ components/          # grouped by feature (home, buy, mortgage...)
│  │  ├─ mortgage/         # MortgageCalcSection, ApplicationFormSection
│  │  ├─ chat/             # ChatPanel.jsx
│  │  └─ layout/           # admin/ and user/ layout shells
│  ├─ hooks/               # useApi, useSocket, useSEO
│  ├─ pages/               # route pages (Home, About, Buy, Mortgage...)
│  ├─ services/            # axiosInstance.js, httpEndpoint.js, socket.js
│  ├─ store/               # Redux store + slices
│  └─ utils/               # seo.js, web-vitals.js
├─ config/                 # app configuration
├─ package.json
├─ webpack.config.js
├─ postcss.config.js
└─ README.md
```

Representative files to inspect first
- [src/pages/Home.jsx](src/pages/Home.jsx)
- [src/components/mortgage/MortgageCalcSection.jsx](src/components/mortgage/MortgageCalcSection.jsx)
- [src/services/axiosInstance.js](src/services/axiosInstance.js)
- [src/services/socket.js](src/services/socket.js)
- [src/store/store.js](src/store/store.js)

---

## Architecture & Conventions
- Feature-based folders: keep components grouped by feature (home, buy, mortgage, etc.)
- Centralized API endpoints: `src/services/httpEndpoint.js`
- Shared hooks: `src/hooks` for reusable behaviors
- Global styles & tokens: `src/index.css` + Tailwind/PostCSS

---

