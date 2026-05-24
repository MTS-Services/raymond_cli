import React, { memo, useState, useCallback, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import PropertyCard from "../shared/PropertyCard";
import PropertiesCTA from "../shared/PropertiesCTA";
import TablePagination from "../shared/TablePagination";
import FilterPanel from "./FilterPanel";
import { ROUTES } from "../../config";
import { httpMethods } from "../../services/httpMethods";
import API_ENDPOINTS from "../../services/httpEndpoint";

const PAGE_SIZE = 13;
const ALL_PRICE = "All Price";
const ALL_TYPES = "All Types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const resolveList = (d) =>
  Array.isArray(d)
    ? d
    : Array.isArray(d?.properties)
      ? d.properties
      : Array.isArray(d?.data)
        ? d.data
        : [];

const mapToPropertyCard = (res) => ({
  id: res.id,
  name: res.title,
  address: [res.streetAddress, res.city, res.state].filter(Boolean).join(", "),
  price: res.askingPrice != null ? `$${res.askingPrice}` : "—",
  rawPrice: res.askingPrice ?? null,
  propertyType: res.propertyType ?? "",
  beds: res.bedrooms,
  Bathrooms: res.bathrooms,
  area: res.area ?? "—",
  image: res.images?.[0]?.url ?? null,
});

const toNumberOrNull = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const PRICE_RANGE_TO_API = {
  "All Price": "ALL",
  "Under $200K": "UNDER_200K",
  "$250K to $500K": "250K_500K",
  "$501K to $750K": "501K_750K",
  "$751K to $1M": "751K_1M",
  "$1M+": "1M_PLUS",
};

const PROPERTY_TYPE_TO_API = {
  "All Types": null,
  "Single Family Home": "SINGLE_FAMILY_HOME",
  Townhomes: "TOWNHOMES",
  Land: "LAND",
  Commercial: "COMMERCIAL",
};

// ---------------------------------------------------------------------------
// ListingsSection -- property grid, filter sidebar/drawer
// ---------------------------------------------------------------------------
const ListingsSection = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationSearch, setLocationSearch] = useState(
    searchParams.get("location") || "",
  );
  const [heroMinPrice, setHeroMinPrice] = useState(
    searchParams.get("minPrice") || "",
  );
  const [heroMaxPrice, setHeroMaxPrice] = useState(
    searchParams.get("maxPrice") || "",
  );
  const [heroBeds, setHeroBeds] = useState(searchParams.get("beds") || "");
  const [heroBathrooms, setHeroBathrooms] = useState(
    searchParams.get("bathrooms") || "",
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(ALL_PRICE);
  const [selectedPropertyType, setSelectedPropertyType] = useState(ALL_TYPES);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasHeroSecondFilters =
    heroMinPrice !== "" ||
    heroMaxPrice !== "" ||
    heroBeds !== "" ||
    heroBathrooms !== "";

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startItem = properties.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = properties.length === 0 ? 0 : startItem + properties.length - 1;

  const clearHeroFilters = useCallback(() => {
    setHeroMinPrice("");
    setHeroMaxPrice("");
    setHeroBeds("");
    setHeroBathrooms("");
  }, []);

  const syncSearchParams = useCallback(
    (nextState) => {
      const params = new URLSearchParams();

      if (nextState.locationSearch.trim()) {
        params.set("location", nextState.locationSearch.trim());
      }

      if (nextState.minPrice.trim()) {
        params.set("minPrice", nextState.minPrice.trim());
      }

      if (nextState.maxPrice.trim()) {
        params.set("maxPrice", nextState.maxPrice.trim());
      }

      if (
        nextState.selectedPriceRange &&
        nextState.selectedPriceRange !== ALL_PRICE
      ) {
        params.set("priceRange", nextState.selectedPriceRange);
      }

      if (
        nextState.selectedPropertyType &&
        nextState.selectedPropertyType !== ALL_TYPES
      ) {
        params.set("propertyType", nextState.selectedPropertyType);
      }

      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params, { replace: true });
      }
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    syncSearchParams({
      locationSearch,
      minPrice: heroMinPrice,
      maxPrice: heroMaxPrice,
      selectedPriceRange,
      selectedPropertyType,
    });
  }, [
    locationSearch,
    heroMinPrice,
    heroMaxPrice,
    selectedPriceRange,
    selectedPropertyType,
    syncSearchParams,
  ]);

  useEffect(() => {
    const locationFromUrl = searchParams.get("location") || "";
    const minPriceFromUrl = searchParams.get("minPrice") || "";
    const maxPriceFromUrl = searchParams.get("maxPrice") || "";
    const bedsFromUrl = searchParams.get("beds") || "";
    const bathroomsFromUrl = searchParams.get("bathrooms") || "";

    setLocationSearch((prev) => {
      if (prev === locationFromUrl) return prev;
      setCurrentPage(1);
      return locationFromUrl;
    });

    setHeroMinPrice((prev) => (prev === minPriceFromUrl ? prev : minPriceFromUrl));
    setHeroMaxPrice((prev) => (prev === maxPriceFromUrl ? prev : maxPriceFromUrl));
    setHeroBeds((prev) => (prev === bedsFromUrl ? prev : bedsFromUrl));
    setHeroBathrooms((prev) =>
      prev === bathroomsFromUrl ? prev : bathroomsFromUrl,
    );

    setCurrentPage(1);
  }, [searchParams]);

  const handleLocationChange = useCallback((value) => {
    setCurrentPage(1);
    setLocationSearch(value);
    clearHeroFilters();
  }, [clearHeroFilters]);

  const handlePriceRangeChange = useCallback((value) => {
    setCurrentPage(1);
    setSelectedPriceRange(value);
    clearHeroFilters();
  }, [clearHeroFilters]);

  const handlePropertyTypeChange = useCallback((value) => {
    setCurrentPage(1);
    setSelectedPropertyType(value);
    clearHeroFilters();
  }, [clearHeroFilters]);

  useEffect(() => {
    let cancelled = false;
    const fetchProperties = async () => {
      setLoading(true);
      const selectedApiPriceRange =
        PRICE_RANGE_TO_API[selectedPriceRange] ?? "ALL";
      const selectedApiPropertyType =
        PROPERTY_TYPE_TO_API[selectedPropertyType] ?? null;
      const normalizedLocation = locationSearch.trim();
      const requestPage = hasHeroSecondFilters ? 1 : currentPage;
      const requestLimit = hasHeroSecondFilters ? 500 : PAGE_SIZE;
      const params = {
        listingType: "REGULAR",
        page: requestPage,
        limit: requestLimit,
        priceRange: selectedApiPriceRange,
      };

      if (selectedApiPropertyType) {
        params.propertyType = selectedApiPropertyType;
      }

      if (normalizedLocation) {
        params.location = normalizedLocation;
      }

      if (heroMinPrice) {
        const minPriceValue = Number(heroMinPrice);
        params.minPrice = minPriceValue;
        params.minAskingPrice = minPriceValue;
      }

      if (heroMaxPrice) {
        const maxPriceValue = Number(heroMaxPrice);
        params.maxPrice = maxPriceValue;
        params.maxAskingPrice = maxPriceValue;
      }

      if (heroBeds) {
        const bedsValue = Number(heroBeds);
        params.minBedrooms = bedsValue;
        params.bedrooms = bedsValue;
        params.beds = bedsValue;
      }

      if (heroBathrooms) {
        const bathroomsValue = Number(heroBathrooms);
        params.minBathrooms = bathroomsValue;
        params.bathrooms = bathroomsValue;
        params.baths = bathroomsValue;
      }

      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.PROPERTIES.LIST,
        {
          params,
        },
      );
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load listings.");
        setProperties([]);
        setTotalItems(0);
      } else {
        const payload = data?.data ?? data ?? {};
        const list = resolveList(payload);

        const minPriceValue = toNumberOrNull(heroMinPrice);
        const maxPriceValue = toNumberOrNull(heroMaxPrice);
        const minBedsValue = toNumberOrNull(heroBeds);
        const minBathsValue = toNumberOrNull(heroBathrooms);

        const secondFilterAppliedList = hasHeroSecondFilters
          ? list.filter((item) => {
              const askingPrice = toNumberOrNull(item?.askingPrice);
              const bedrooms = toNumberOrNull(item?.bedrooms);
              const bathrooms = toNumberOrNull(item?.bathrooms);

              if (
                minPriceValue !== null &&
                askingPrice !== null &&
                askingPrice < minPriceValue
              ) {
                return false;
              }

              if (
                maxPriceValue !== null &&
                askingPrice !== null &&
                askingPrice > maxPriceValue
              ) {
                return false;
              }

              if (
                minBedsValue !== null &&
                bedrooms !== null &&
                bedrooms < minBedsValue
              ) {
                return false;
              }

              if (
                minBathsValue !== null &&
                bathrooms !== null &&
                bathrooms < minBathsValue
              ) {
                return false;
              }

              return true;
            })
          : list;

        if (hasHeroSecondFilters) {
          const start = (currentPage - 1) * PAGE_SIZE;
          const end = start + PAGE_SIZE;
          const paginated = secondFilterAppliedList.slice(start, end);
          setProperties(paginated.map(mapToPropertyCard));
          setTotalItems(secondFilterAppliedList.length);
        } else {
          setProperties(secondFilterAppliedList.map(mapToPropertyCard));
          const totalFromApi =
            payload?.pagination?.total ?? payload?.total ?? secondFilterAppliedList.length;
          setTotalItems(totalFromApi);
        }
      }
      setLoading(false);
    };
    fetchProperties();
    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    selectedPriceRange,
    selectedPropertyType,
    locationSearch,
    heroMinPrice,
    heroMaxPrice,
    heroBeds,
    heroBathrooms,
    hasHeroSecondFilters,
  ]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const filterProps = {
    locationSearch,
    onLocationChange: handleLocationChange,
    selectedPriceRange,
    onPriceRangeChange: handlePriceRangeChange,
    selectedPropertyType,
    onPropertyTypeChange: handlePropertyTypeChange,
  };

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return (
    <>
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12">
          <h1 className="font-playfair text-slate-900 text-3xl lg:text-[40px] font-semibold leading-tight mb-10">
            Explore Properties That Match Your Lifestyle
          </h1>

          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={openDrawer}
              aria-label="Open filters"
              aria-expanded={drawerOpen}
              className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2.5 rounded-lg font-semibold text-sm font-inter cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-11.75">
            <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 scrollbar-light">
              <FilterPanel {...filterProps} />
            </aside>

            <div className="flex-1 min-w-0 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {loading ? (
                  <p className="col-span-full text-center text-slate-500 py-10">
                    Loading listings…
                  </p>
                ) : properties.length === 0 ? (
                  <p className="col-span-full text-center text-slate-500 py-10">
                    No properties match your filters.
                  </p>
                ) : (
                  properties.map((property) => (
                    <Link
                      key={property.id}
                      to={ROUTES.PROPERTY_DETAILS.replace(
                        ":id",
                        String(property.id),
                      )}
                      state={property}
                      className="block focus-visible:outline-2 focus-visible:outline-primary rounded-xl"
                    >
                      <PropertyCard {...property} />
                    </Link>
                  ))
                )}
              </div>

              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                startItem={startItem}
                endItem={endItem}
                total={totalItems}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            </div>
          </div>
        </div>
      </section>

      <PropertiesCTA />

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={closeDrawer}
      />
      <div
        role="dialog"
        aria-modal={drawerOpen}
        aria-label="Property filters"
        className={`fixed top-0 left-0 h-full w-80 max-w-full bg-white z-60 shadow-2xl flex flex-col lg:hidden overflow-hidden transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={18}
              className="text-blue-950"
              aria-hidden="true"
            />
            <span className="font-bold text-blue-950 text-base font-inter">
              Filters
            </span>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close filters"
            className="text-slate-600 hover:text-blue-950 transition-colors cursor-pointer p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <FilterPanel {...filterProps} />
        </div>
        <div className="shrink-0 px-5 py-4 border-t border-slate-200">
          <button
            type="button"
            onClick={closeDrawer}
            className="w-full bg-blue-950 text-white font-semibold text-sm py-3 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer font-inter"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
});

ListingsSection.displayName = "ListingsSection";

export default ListingsSection;
