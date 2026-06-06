import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { ROUTES } from "../../config";
import PropertyCard from "../shared/PropertyCard";
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
  beds: res.bedrooms,
  Bathrooms: res.bathrooms,
  area: res.area ?? "—",
  image: res.images?.[0]?.url ?? null,
});

const FeaturedSection = memo(() => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.PROPERTIES.LIST,
        { params: { listingType: "REGULAR", limit: 6 } },
      );
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load featured properties.");
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

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.offsetWidth ?? 0;
      const gap = 16;
      scrollRef.current.scrollBy({
        left: direction === "prev" ? -(cardWidth + gap) : cardWidth + gap,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <section className="overflow-hidden bg-white pb-14 lg:pb-20">
      <div className="mx-auto max-w-384 px-4 sm:px-8 lg:px-12">
        <div className="mb-5 space-y-2 xl:hidden">
          <h2 className="font-playfair text-3xl text-brand-black">
            Featured Properties
          </h2>
          <p className="text-sm text-black sm:text-base">
            Hand-picked premium listings that define modern living at its
            finest.
          </p>
          <Link
            to={ROUTES.BUY}
            className="block text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            View All Listing
          </Link>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="hidden shrink-0 space-y-2 xl:block xl:w-52">
            <h2 className="font-playfair text-3xl leading-tight text-brand-black xl:text-[40px]">
              Featured Properties
            </h2>
            <p className="text-sm text-text-dim sm:text-base">
              Hand-picked premium listings that define modern living at its
              finest.
            </p>
            <Link
              to={ROUTES.BUY}
              className="block text-sm font-semibold text-orange-500 hover:text-orange-600 pt-2"
            >
              View All Listing
            </Link>
          </div>

          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="Previous property"
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50 xl:flex"
          >
            <ChevronLeft
              className="h-5 w-5 text-orange-500"
              aria-hidden="true"
            />
          </button>

          <div className="relative w-full xl:flex-1">
            <div className="pointer-events-none absolute left-2 right-2 top-45 z-10 flex -translate-y-1/2 justify-between xl:hidden">
              <button
                type="button"
                onClick={() => scroll("prev")}
                aria-label="Previous property"
                className="pointer-events-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              >
                <ChevronLeft
                  className="h-5 w-5 text-orange-500"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => scroll("next")}
                aria-label="Next property"
                className="pointer-events-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-orange-500/90 shadow-md backdrop-blur-sm transition-colors hover:bg-orange-600"
              >
                <ChevronRight
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="w-full overflow-hidden py-2">
              {loading ? (
                <p className="text-center text-slate-500 py-10">
                  Loading featured properties…
                </p>
              ) : properties.length === 0 ? (
                <p className="text-center text-slate-500 py-10">
                  No featured properties available.
                </p>
              ) : (
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-scroll snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="shrink-0 snap-start w-full md:w-[calc(50%-8px)] xl:w-[calc(33.333%-10.667px)]"
                    >
                      <Link
                        to={ROUTES.PROPERTY_DETAILS.replace(
                          ":id",
                          String(property.id),
                        )}
                        state={property}
                        className="block h-full"
                      >
                        <PropertyCard {...property} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Next property"
            className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-orange-500 shadow-sm transition-colors hover:bg-orange-600 xl:flex"
          >
            <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
});

FeaturedSection.displayName = "FeaturedSection";

export default FeaturedSection;
