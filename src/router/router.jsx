import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../components/shared/MainLayout";
import AdminLayout from "../components/layout/admin/Layout";
import UserLayout from "../components/layout/user/Layout";
import { ROUTES } from "../config";
import { selectIsAuthenticated } from "../store/slices/authSlice";

// Derive a relative segment from an absolute admin route path
const seg = (route) => route.replace(`${ROUTES.ADMIN}/`, "");

const Home = lazy(() => import("../pages/Home"));
const Buy = lazy(() => import("../pages/Buy"));
const Wholesale = lazy(() => import("../pages/Wholesale"));
const Renovation = lazy(() => import("../pages/Renovation"));
const RenovationDetails = lazy(() => import("../pages/RenovationDetails"));
const NewConstruction = lazy(() => import("../pages/NewConstruction"));
const RenovationService = lazy(() => import("../pages/RenovationService"));
const Mortgage = lazy(() => import("../pages/Mortgage"));
const Investment = lazy(() => import("../pages/Investment"));
const BookConsultation = lazy(() => import("../pages/BookConsultation"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const CaseStudy = lazy(() => import("../pages/CaseStudy"));
const Chat = lazy(() => import("../pages/Chat"));
const PropertyDetails = lazy(() => import("../pages/PropertyDetails"));
const PropertyDetailsOffer = lazy(
  () => import("../pages/PropertyDetailsOffer"),
);
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsCondition = lazy(() => import("../pages/TermsCondition"));
const Services = lazy(() => import("../pages/Services"));
const ReduxDemo = lazy(() => import("../pages/ReduxDemo"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const OtpVerification = lazy(() => import("../pages/OtpVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

// User pages
const UserDashboard = lazy(() => import("../pages/user/Dashboard"));
const UserMessages = lazy(() => import("../pages/user/Messages"));
const UserProfile = lazy(() => import("../pages/user/Profile"));

// Derive a relative segment from an absolute user route path
const useg = (route) => route.replace(`${ROUTES.USER}/`, "");

// Admin pages -- each lazy-loaded so they only download when visited
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Emails = lazy(() => import("../pages/admin/Emails"));
const Leads = lazy(() => import("../pages/admin/Leads"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const MarketplaceOrders = lazy(
  () => import("../pages/admin/MarketplaceOrders"),
);
const CaseStudies = lazy(() => import("../pages/admin/CaseStudies"));
const Blog = lazy(() => import("../pages/admin/Blog"));
const Jobs = lazy(() => import("../pages/admin/Jobs"));
const Pricing = lazy(() => import("../pages/admin/Pricing"));
const ListingProperty = lazy(() => import("../pages/admin/ListingProperty"));
const EditProperty = lazy(() => import("../pages/admin/EditProperty"));
const AddProperty = lazy(() => import("../pages/admin/AddProperty"));
const LeadsInquiries = lazy(() => import("../pages/admin/LeadsInquiries"));
const AdminPortfolio = lazy(() => import("../pages/admin/Portfolio"));
const AddPortfolio = lazy(() => import("../pages/admin/AddPortfolio"));
const EditPortfolio = lazy(() => import("../pages/admin/EditPortfolio"));
const AdminSettings = lazy(() => import("../pages/admin/Settings"));
const AdminMortgageApplications = lazy(
  () => import("../pages/admin/MortgageApplications"),
);
const AdminFeeBuilder = lazy(() => import("../pages/admin/FeeBuilder"));
const AdminNewConstruction = lazy(
  () => import("../pages/admin/NewConstruction"),
);
const AdminNewConstructionDetails = lazy(
  () => import("../pages/admin/NewConstructionDetails"),
);
const AdminRenovation = lazy(() => import("../pages/admin/Renovation"));
const AdminInvestment = lazy(() => import("../pages/admin/Investment"));
const AdminConsultation = lazy(() => import("../pages/admin/Consultation"));
const AdminMessages = lazy(() => import("../pages/admin/Messages"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-500">Page not found</p>
    <a
      href={ROUTES.HOME}
      className="mt-2 text-blue-600 hover:underline text-sm font-medium"
    >
      Back to Home
    </a>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={
          <Suspense fallback={<PageLoader />}>
            <MainLayout />
          </Suspense>
        }
      >
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.BUY} element={<Buy />} />
        <Route path={ROUTES.WHOLESALE} element={<Wholesale />} />
        <Route path={ROUTES.RENOVATION} element={<Renovation />} />
        <Route
          path={ROUTES.RENOVATION_DETAILS}
          element={<RenovationDetails />}
        />
        <Route path={ROUTES.NEW_CONSTRUCTION} element={<NewConstruction />} />
        <Route
          path={ROUTES.RENOVATION_SERVICE}
          element={<RenovationService />}
        />
        <Route path={ROUTES.MORTGAGE} element={<Mortgage />} />
        <Route path={ROUTES.INVESTMENT} element={<Investment />} />
        <Route path={ROUTES.BOOK_CONSULTATION} element={<BookConsultation />} />
        <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
        <Route path={ROUTES.CASE_STUDY_DETAIL} element={<CaseStudy />} />
        <Route
          path={ROUTES.PROPERTY_DETAILS_OFFER}
          element={<PropertyDetailsOffer />}
        />
        <Route path={ROUTES.PROPERTY_DETAILS} element={<PropertyDetails />} />
        <Route path={ROUTES.CHAT} element={<Chat />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.TERMS_CONDITION} element={<TermsCondition />} />
        <Route path={ROUTES.SERVICES} element={<Services />} />
      </Route>

      <Route path={ROUTES.REDUX_DEMO} element={<ReduxDemo />} />

      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.OTP_VERIFICATION} element={<OtpVerification />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

      <Route
        path={ROUTES.ADMIN}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route path={seg(ROUTES.ADMIN_DASHBOARD)} element={<Dashboard />} />
        <Route path={seg(ROUTES.ADMIN_EMAILS)} element={<Emails />} />
        <Route path={seg(ROUTES.ADMIN_LEADS)} element={<Leads />} />
        <Route path={seg(ROUTES.ADMIN_ORDERS)} element={<Orders />} />
        <Route
          path={seg(ROUTES.ADMIN_MARKETPLACE_ORDERS)}
          element={<MarketplaceOrders />}
        />
        <Route
          path={seg(ROUTES.ADMIN_CASE_STUDIES)}
          element={<CaseStudies />}
        />
        <Route path={seg(ROUTES.ADMIN_BLOG)} element={<Blog />} />
        <Route path={seg(ROUTES.ADMIN_JOBS)} element={<Jobs />} />
        <Route path={seg(ROUTES.ADMIN_PRICING)} element={<Pricing />} />
        {/* New admin routes matching Figma */}
        <Route
          index
          element={<Navigate to={ROUTES.ADMIN_LISTING_PROPERTY} replace />}
        />
        <Route
          path={seg(ROUTES.ADMIN_LISTING_PROPERTY)}
          element={<ListingProperty />}
        />
        <Route
          path={seg(ROUTES.ADMIN_EDIT_PROPERTY)}
          element={<EditProperty />}
        />
        <Route
          path={seg(ROUTES.ADMIN_ADD_PROPERTY)}
          element={<Navigate to={`${ROUTES.ADMIN_ADD_PROPERTY}/1`} replace />}
        />
        <Route
          path={seg(ROUTES.ADMIN_ADD_PROPERTY_STEP)}
          element={<AddProperty />}
        />
        <Route
          path={seg(ROUTES.ADMIN_LEADS_INQUIRIES)}
          element={<LeadsInquiries />}
        />
        <Route
          path={seg(ROUTES.ADMIN_PORTFOLIO)}
          element={<AdminPortfolio />}
        />
        <Route
          path={seg(ROUTES.ADMIN_ADD_PORTFOLIO)}
          element={<AddPortfolio />}
        />
        <Route
          path={seg(ROUTES.ADMIN_EDIT_PORTFOLIO)}
          element={<EditPortfolio />}
        />
        <Route path={seg(ROUTES.ADMIN_SETTINGS)} element={<AdminSettings />} />
        <Route
          path={seg(ROUTES.ADMIN_MORTGAGE_APPLICATIONS)}
          element={<AdminMortgageApplications />}
        />
        <Route
          path={seg(ROUTES.ADMIN_FEE_BUILDER)}
          element={<AdminFeeBuilder />}
        />
        <Route
          path={seg(ROUTES.ADMIN_NEW_CONSTRUCTION)}
          element={<AdminNewConstruction />}
        />
        <Route
          path={seg(ROUTES.ADMIN_NEW_CONSTRUCTION_DETAILS)}
          element={<AdminNewConstructionDetails />}
        />
        <Route
          path={seg(ROUTES.ADMIN_RENOVATION)}
          element={<AdminRenovation />}
        />
        <Route
          path={seg(ROUTES.ADMIN_INVESTMENT)}
          element={<AdminInvestment />}
        />
        <Route
          path={seg(ROUTES.ADMIN_CONSULTATION)}
          element={<AdminConsultation />}
        />
        <Route path={seg(ROUTES.ADMIN_MESSAGES)} element={<AdminMessages />} />
      </Route>

      {/* User dashboard -- protected, with user sidebar (Messages + Profile) */}
      <Route
        path={ROUTES.USER}
        element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<Navigate to={ROUTES.USER_MESSAGES} replace />} />
        <Route path={useg(ROUTES.USER_DASHBOARD)} element={<UserDashboard />} />
        <Route path={useg(ROUTES.USER_MESSAGES)} element={<UserMessages />} />
        <Route path={useg(ROUTES.USER_PROFILE)} element={<UserProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

export default router;
