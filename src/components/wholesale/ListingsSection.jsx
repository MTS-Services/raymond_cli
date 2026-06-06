import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PropertiesCTA from "../shared/PropertiesCTA";
import WholesaleCard from "./WholesaleCard";
import { ROUTES } from "../../config";
import { httpMethods } from "../../services/httpMethods";
import API_ENDPOINTS from "../../services/httpEndpoint";

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

const formatPrice = (val) => {
  if (val == null || val === "" || val === "—") return "—";
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return "—";
  if (n >= 1000000) return `$${+(n / 1000000).toFixed(1)}m`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
};

const formatArea = (val) => {
  if (val == null || val === "" || val === "—") return "—";
  const s = String(val).trim();
  if (s.toLowerCase().includes("sqft") || s.toLowerCase().includes("sq ft"))
    return s;
  return `${s} sqft`;
};

const mapToWholesaleCard = (res) => ({
  id: res.id,
  name: res.title,
  address: [res.streetAddress, res.city, res.state].filter(Boolean).join(", "),
  beds: res.bedrooms,
  Bathrooms: res.bathrooms,
  area: formatArea(res.area),
  purchasePrice: formatPrice(res.purchasePrice),
  renovationCost: formatPrice(res.estimatedRenovationCost),
  arv: formatPrice(res.arv),
  savePct: res.discount ?? 0,
  showBadge: !!res.discount,
  image: res.images?.[0]?.url ?? null,
});

// ---------------------------------------------------------------------------
// ListingsSection
// ---------------------------------------------------------------------------
const ListingsSection = memo(() => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.PROPERTIES.LIST,
        {
          params: { listingType: "WHOLESALE", limit: 500 },
        },
      );
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load wholesale listings.");
      } else {
        const list = resolveList(data?.data ?? data);
        setProperties(list.map(mapToWholesaleCard));
      }
      setLoading(false);
    };
    fetchProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading ? (
              <p className="col-span-full text-center text-slate-500 py-10">
                Loading listings…
              </p>
            ) : properties.length === 0 ? (
              <p className="col-span-full text-center text-slate-500 py-10">
                No wholesale properties found.
              </p>
            ) : (
              properties.map((property) => (
                <Link
                  key={property.id}
                  to={
                    property.showBadge
                      ? ROUTES.PROPERTY_DETAILS_OFFER.replace(
                          ":id",
                          String(property.id),
                        )
                      : ROUTES.PROPERTY_DETAILS.replace(
                          ":id",
                          String(property.id),
                        )
                  }
                  className="block focus-visible:outline-2 focus-visible:outline-primary rounded-lg"
                >
                  <WholesaleCard {...property} />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
});

ListingsSection.displayName = "ListingsSection";

export default ListingsSection;
