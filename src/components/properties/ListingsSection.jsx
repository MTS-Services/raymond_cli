import React, { memo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PropertyCard from "../shared/PropertyCard";
import PropertiesCTA from "../shared/PropertiesCTA";
import FilterSidebar from "./FilterSidebar";
import { ROUTES } from "../../config";
import { httpMethods } from "../../services/httpMethods";
import API_ENDPOINTS from "../../services/httpEndpoint";

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

const ListingsSection = memo(() => {
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredProperties = properties.filter((p) => {
    if (
      locationSearch &&
      !p.address.toLowerCase().includes(locationSearch.toLowerCase())
    )
      return false;
    if (minPrice !== "" && p.rawPrice != null && p.rawPrice < Number(minPrice))
      return false;
    if (maxPrice !== "" && p.rawPrice != null && p.rawPrice > Number(maxPrice))
      return false;
    if (
      selectedPropertyType &&
      !p.propertyType.toLowerCase().includes(selectedPropertyType.toLowerCase())
    )
      return false;
    return true;
  });

  useEffect(() => {
    let cancelled = false;
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.PROPERTIES.LIST,
        { params: { listingType: "REGULAR", limit: 500 } },
      );
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load listings.");
      } else {
        const list = resolveList(data?.data ?? data);
        setProperties(list.map(mapToPropertyCard));
      }
      setLoading(false);
    };
    fetchProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLocationChange = useCallback((v) => setLocationSearch(v), []);
  const handlePriceRangeChange = useCallback(
    (v) => setSelectedPriceRange(v),
    [],
  );
  const handlePropertyTypeChange = useCallback(
    (v) => setSelectedPropertyType(v),
    [],
  );
  const handleMinPriceChange = useCallback((v) => setMinPrice(v), []);
  const handleMaxPriceChange = useCallback((v) => setMaxPrice(v), []);

  return (
    <>
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12">
          <h1 className="font-playfair text-slate-900 text-3xl lg:text-[40px] font-semibold leading-tight mb-10">
            Explore Properties That Match Your Lifestyle
          </h1>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-11.75">
            <FilterSidebar
              locationSearch={locationSearch}
              onLocationChange={handleLocationChange}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedPropertyType={selectedPropertyType}
              onPropertyTypeChange={handlePropertyTypeChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={handleMinPriceChange}
              onMaxPriceChange={handleMaxPriceChange}
            />

            <div className="flex-1 min-w-0 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {loading ? (
                  <p className="col-span-full text-center text-slate-500 py-10">
                    Loading listings…
                  </p>
                ) : filteredProperties.length === 0 ? (
                  <p className="col-span-full text-center text-slate-500 py-10">
                    No properties match your filters.
                  </p>
                ) : (
                  filteredProperties.map((property) => (
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
            </div>
          </div>
        </div>
      </section>

      <PropertiesCTA />
    </>
  );
});

ListingsSection.displayName = "ListingsSection";

export default ListingsSection;
