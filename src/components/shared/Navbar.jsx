import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { ROUTES } from "../../config";
import {
  logout,
  selectIsAuthenticated,
  selectUser,
} from "../../store/slices/authSlice";
import AnimatedButton from "./AnimatedButton";

// Map nav label → route path (items without a route stay as decorative links)
const NAV_ITEMS = [
  { label: "Home", route: ROUTES.HOME },
  { label: "About Us", route: ROUTES.ABOUT },
  { label: "Listings", route: ROUTES.BUY },
  { label: "Wholesale", route: ROUTES.WHOLESALE },
  {
    label: "Build & Renovate",
    dropdown: [
      {
        label: "Fee Built",
        route: ROUTES.RENOVATION,
        img: "/navFeeBuilt.webp",
        desc: "Custom homes built to your exact specs on your land.",
      },
      {
        label: "New Construction",
        route: ROUTES.NEW_CONSTRUCTION,
        img: "/navNewConstruction.webp",
        desc: "Brand-new residential construction from the ground up.",
      },
      {
        label: "Renovation",
        route: ROUTES.RENOVATION_SERVICE,
        img: "/navRenovation.webp",
        desc: "Transform your existing property inside and out.",
      },
    ],
  },
  { label: "Mortgage", route: ROUTES.MORTGAGE },
  { label: "Investment", route: ROUTES.INVESTMENT },
  { label: "Portfolio", route: ROUTES.PORTFOLIO },
];

const Navbar = memo(() => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const [mobileBuildOpen, setMobileBuildOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authUser = useSelector(selectUser);
  const dashboardRoute =
    String(authUser?.role || "").toUpperCase() === "ADMIN"
      ? ROUTES.ADMIN_LISTING_PROPERTY
      : ROUTES.USER_DASHBOARD;
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeTimer = useRef(null);

  // Scroll to top on every page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openDropdown = useCallback(() => {
    clearTimeout(closeTimer.current);
    setBuildOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    closeTimer.current = setTimeout(() => setBuildOpen(false), 120);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setMenuOpen(false);
    setMobileBuildOpen(false);
    navigate(ROUTES.LOGIN, { replace: true });
  }, [dispatch, navigate]);

  const isActive = useCallback(
    (route) => {
      if (!route) return false;
      if (route === "/") return pathname === "/";
      return pathname === route || pathname.startsWith(`${route}/`);
    },
    [pathname],
  );

  const isBuildActive = useCallback(
    (items) => items.some((item) => isActive(item.route)),
    [isActive],
  );

  const baseActive =
    "bg-orange-500/70 text-white px-4 py-2 rounded-lg text-sm uppercase font-normal tracking-wider cursor-pointer";
  const baseInactive =
    "text-ink-nav text-sm uppercase tracking-wider hover:text-secondary transition-colors duration-150 px-2 py-2 cursor-pointer";
  const mobileCtaBase =
    "flex w-full items-center justify-center rounded-lg px-6 py-2.5 text-base uppercase transition-colors cursor-pointer box-border";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between h-20">
        {/* Logo -- full on tablet/desktop, icon-only on mobile */}
        <Link
          to={ROUTES.HOME}
          aria-label="Skyridge Group home page"
          className="shrink-0"
        >
          <img
            src="/logo.png"
            alt="Skyridge Group"
            className="hidden sm:block h-14 w-auto object-contain"
          />
          <img
            src="/mobileLogo.png"
            alt="Skyridge Group"
            className="block sm:hidden h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden 2xl:flex items-center gap-5"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map(({ label, route, dropdown }) => {
            /* ---- Dropdown item ---- */
            if (dropdown) {
              const dropActive = isBuildActive(dropdown);
              return (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={buildOpen}
                    className={`${dropActive ? baseActive : baseInactive} inline-flex items-center gap-1`}
                  >
                    {label}
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${buildOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Flyout panel -- always in DOM, animated via inline styles */}
                  <div
                    className="absolute top-full left-1/2 mt-2 bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 grid grid-cols-3 gap-4 w-155 z-50"
                    style={{
                      transform: buildOpen
                        ? "translateX(-50%) translateY(0px)"
                        : "translateX(-50%) translateY(8px)",
                      opacity: buildOpen ? 1 : 0,
                      pointerEvents: buildOpen ? "auto" : "none",
                      transition:
                        "opacity 0.2s ease-out, transform 0.2s ease-out",
                    }}
                  >
                    {dropdown.map((item) => {
                      const itemActive = isActive(item.route);
                      return (
                        <Link
                          key={item.label}
                          to={item.route}
                          className={`group flex flex-col rounded-xl overflow-hidden border transition-all duration-150 hover:shadow-md ${itemActive ? "border-orange-400" : "border-gray-100 hover:border-orange-200"}`}
                          onClick={() => setBuildOpen(false)}
                        >
                          <div className="relative h-36 overflow-hidden">
                            <img
                              src={item.img}
                              alt={item.label}
                              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-3.5 flex flex-col gap-1">
                            <p
                              className={`font-semibold text-sm leading-snug ${
                                itemActive
                                  ? "text-orange-500"
                                  : "text-ink-soft group-hover:text-orange-500 transition-colors"
                              }`}
                            >
                              {item.label}
                            </p>
                            <p className="text-ink-caption text-xs leading-relaxed line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            /* ---- Regular link ---- */
            const active = isActive(route);
            const baseActive2 =
              "bg-orange-500/70 text-white px-4 py-2 rounded-lg text-sm uppercase font-normal tracking-wider cursor-pointer";
            const baseInactive2 =
              "text-ink-nav text-sm uppercase tracking-wider hover:text-secondary transition-colors duration-150 px-2 py-2 cursor-pointer";
            if (route) {
              return (
                <Link
                  key={label}
                  to={route}
                  aria-current={active ? "page" : undefined}
                  className={active ? baseActive2 : baseInactive2}
                >
                  {label}
                </Link>
              );
            }
            return (
              <button key={label} type="button" className={baseInactive2}>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Desktop right side: message icon (user only) | dashboard (admin only) | sign-in + CTA */}
        <div className="hidden 2xl:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={dashboardRoute}
              className="text-ink-nav text-sm uppercase tracking-wide hover:text-orange-500 transition-colors duration-150 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-orange-400 cursor-pointer"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="text-ink-nav text-sm uppercase tracking-wide hover:text-orange-500 transition-colors duration-150 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-orange-400 cursor-pointer"
            >
              Sign In
            </Link>
          )}
          <AnimatedButton
            to={ROUTES.BOOK_CONSULTATION}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-sm uppercase tracking-wide hover:bg-orange-600 transition-colors duration-150 cursor-pointer"
          >
            Book A Consultation
          </AnimatedButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="2xl:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="2xl:hidden fixed inset-x-0 top-20 bottom-0 z-50 bg-white p-4 overflow-y-auto overscroll-contain border-t border-gray-100 flex flex-col">
          <nav
            className="flex flex-col gap-1 py-4 flex-1"
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map(({ label, route, dropdown }) => {
              /* ---- Dropdown item (mobile) ---- */
              if (dropdown) {
                const dropActive = isBuildActive(dropdown);
                return (
                  <div key={label}>
                    <button
                      type="button"
                      onClick={() => setMobileBuildOpen((prev) => !prev)}
                      className={`${dropActive ? "bg-orange-100 text-orange-700" : "text-ink-nav hover:bg-gray-50"} flex items-center justify-between text-base uppercase px-4 py-2.5 rounded-lg w-full transition-colors cursor-pointer`}
                    >
                      {label}
                      <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${mobileBuildOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileBuildOpen && (
                      <div className="mt-1 ml-4 flex flex-col gap-1">
                        {dropdown.map((item) => {
                          const itemActive = isActive(item.route);
                          return (
                            <Link
                              key={item.label}
                              to={item.route}
                              aria-current={itemActive ? "page" : undefined}
                              className={`${itemActive ? "bg-orange-100 text-orange-700" : "text-ink-nav hover:bg-gray-50"} text-base uppercase px-4 py-2 rounded-lg transition-colors`}
                              onClick={() => {
                                setMenuOpen(false);
                                setMobileBuildOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /* ---- Regular link (mobile) ---- */
              const active = isActive(route);
              const mobileActive =
                "bg-orange-100 text-orange-700 px-4 py-2.5 rounded-lg text-base uppercase text-left w-full cursor-pointer";
              const mobileInactive =
                "text-ink-nav text-base uppercase hover:bg-gray-50 px-4 py-2.5 rounded-lg text-left w-full transition-colors cursor-pointer";
              if (route) {
                return (
                  <Link
                    key={label}
                    to={route}
                    aria-current={active ? "page" : undefined}
                    className={active ? mobileActive : mobileInactive}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <button key={label} type="button" className={mobileInactive}>
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Sticky CTA area */}
          <div className="bg-white pt-4 pb-4 border-t border-gray-100 shrink-0">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3 mb-3">
                <Link
                  to={dashboardRoute}
                  onClick={() => setMenuOpen(false)}
                  className={`${mobileCtaBase} bg-orange-50 text-ink-nav border border-gray-200 hover:border-orange-400 hover:bg-orange-100 hover:text-orange-500`}
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${mobileCtaBase} gap-2 border border-red-200 text-red-600 hover:bg-red-50`}
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-3">
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setMenuOpen(false)}
                  className={`${mobileCtaBase} text-ink-nav border border-gray-200 hover:border-orange-400 hover:text-orange-500`}
                >
                  Sign In
                </Link>

                <AnimatedButton
                  to={ROUTES.BOOK_CONSULTATION}
                  onClick={() => setMenuOpen(false)}
                  className={`${mobileCtaBase} bg-orange-500 text-white hover:bg-orange-600`}
                >
                  Book A Consultation
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
});
Navbar.displayName = "Navbar";

export default Navbar;
