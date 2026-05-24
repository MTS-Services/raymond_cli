import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, BedDouble, Bath, Maximize2 } from "lucide-react";
import { ROUTES } from "../../config";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";
import Pagination from "../../components/shared/Pagination";

const PAGE_SIZE = 8;

const formatPrice = (val) => {
  if (val == null || val === "—" || val === "") return "—";
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return "—";
  if (n >= 1000000) return `$${+(n / 1000000).toFixed(1)}m`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
};

const formatArea = (val) => {
  if (val == null || val === "—" || val === "") return "—";
  const s = String(val).trim();
  if (s.toLowerCase().includes("sqft") || s.toLowerCase().includes("sq ft"))
    return s;
  return `${s} sqft`;
};

const mapToWholesaleCard = (res) => ({
  id: res.id,
  name: res.title,
  address: [res.streetAddress, res.city, res.state].filter(Boolean).join(", "),
  beds: res.bedrooms ?? "—",
  Bathrooms: res.bathrooms ?? "—",
  area: res.area ?? "—",
  purchase: res.purchasePrice ?? "—",
  renovation: res.estimatedRenovationCost ?? "—",
  arv: res.arv ?? "—",
  badge: "Save",
  discount: res.discount ? `${res.discount}%` : "",
  image: res.images?.[0]?.url ?? null,
  propertyType: res.propertyType,
  description: res.description,
  streetAddress: res.streetAddress,
  city: res.city,
  state: res.state,
  zip: res.zipCode,
  contactName: res.contactName,
  contactPhone: res.contactNumber,
  contactEmail: res.contactEmail,
});

const mapToRegularCard = (res) => ({
  id: res.id,
  name: res.title,
  address: [res.streetAddress, res.city, res.state].filter(Boolean).join(", "),
  price: res.askingPrice != null ? `$${res.askingPrice}` : "—",
  image: res.images?.[0]?.url ?? null,
  propertyType: res.propertyType,
  description: res.description,
  bedrooms: res.bedrooms,
  bathrooms: res.bathrooms,
  area: res.area ?? "—",
  streetAddress: res.streetAddress,
  city: res.city,
  state: res.state,
  zip: res.zipCode,
  purchase: res.purchasePrice ?? "—",
  renovation: res.estimatedRenovationCost ?? "—",
  arv: res.arv ?? "—",
  discount: res.discount ? `${res.discount}%` : "",
  contactName: res.contactName,
  contactPhone: res.contactNumber,
  contactEmail: res.contactEmail,
});

const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
      active
        ? "bg-navy text-white"
        : "bg-transparent text-gray-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const WholesaleCard = ({ item, onDelete, tab }) => (
  <article className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
    <div className="relative h-44 overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
      {item.discount && item.discount !== "\u2014" && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-12 h-12 flex flex-col items-center justify-center leading-tight">
          <span>{item.badge}</span>
          <span>{item.discount}</span>
        </span>
      )}
    </div>
    <div className="p-4 flex flex-col gap-2 flex-1">
      <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 leading-snug">
        {item.name}
      </h3>
      <p className="text-sm text-gray-400 truncate">{item.address}</p>
      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">
          {item.beds} Beds
        </span>
        <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-xs font-medium px-2 py-1 rounded-md">
          {item.Bathrooms} Bathrooms
        </span>
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
          {formatArea(item.area)}
        </span>
      </div>
      <div className="mt-1 rounded-lg bg-gray-50 border border-gray-100 divide-y divide-gray-100">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-sm text-gray-900">Purchase price</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(item.purchase)}
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-sm text-gray-900">Est. renovation</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(item.renovation)}
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-sm text-gray-900">ARV</span>
          <span className="text-sm font-semibold text-orange-600">
            {formatPrice(item.arv)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Link
          to={`/admin/listing-property/edit/${item.id}`}
          state={{
            listTab: tab,
            property: {
              title: item.name,
              type: item.propertyType || "",
              bedrooms: item.beds === "—" ? "" : String(item.beds),
              bathrooms: item.Bathrooms === "—" ? "" : String(item.Bathrooms),
              area: item.area === "—" ? "" : item.area,
              description: item.description || "",
              street: item.streetAddress || "",
              city: item.city || "",
              state: item.state || "",
              zip: item.zip || "",
              purchase: item.purchase === "—" ? "" : item.purchase,
              renovation: item.renovation === "—" ? "" : item.renovation,
              arv: item.arv === "—" ? "" : item.arv,
              discount:
                item.discount === "—"
                  ? ""
                  : String(item.discount).replace("%", ""),
              saleType: "wholesale",
              name: item.contactName || "",
              phone: item.contactPhone || "",
              email: item.contactEmail || "",
            },
          }}
          className="flex-1 bg-navy text-white text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 hover:bg-navy-hover transition-colors cursor-pointer"
        >
          <Pencil size={14} /> Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="flex-1 bg-red-50 text-red-600 text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </article>
);

const RegularCard = ({ item, onDelete, tab }) => (
  <article className="bg-white border-[1.5px] border-primary-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
    <div className="h-52 overflow-hidden shrink-0">
      {item.image ? (
        <img
          src={item.image}
          alt={`${item.name} -- property listing`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
    </div>
    <div className="p-4 sm:p-5 flex flex-col flex-1">
      <p className="text-primary text-xl font-extrabold tracking-[-0.6px] font-[Plus_Jakarta_Sans,sans-serif] mb-2">
        {item.price}
      </p>
      <h3 className="text-slate-900 text-xl font-bold leading-tight mb-1">
        {item.name}
      </h3>
      <p className="text-gray-800 text-sm font-medium opacity-50 mb-4">
        {item.address}
      </p>
      <hr className="border-primary-200 mb-3 mt-auto" />
      <div className="flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-3 items-center mb-4">
        <div className="flex items-center gap-1.5">
          <BedDouble
            className="w-4 h-4 shrink-0 text-slate-500"
            aria-hidden="true"
          />
          <span className="text-slate-900 text-xs font-medium opacity-70 whitespace-nowrap">
            {item.bedrooms} Beds
          </span>
        </div>
        <span
          className="w-px h-3.5 bg-primary-200 shrink-0"
          aria-hidden="true"
        />
        <div className="flex items-center gap-1.5">
          <Bath
            className="w-4 h-4 shrink-0 text-slate-500"
            aria-hidden="true"
          />
          <span className="text-slate-900 text-xs font-medium opacity-70 whitespace-nowrap">
            {item.bathrooms} Baths
          </span>
        </div>
        <span
          className="w-px h-3.5 bg-primary-200 shrink-0"
          aria-hidden="true"
        />
        <div className="flex items-center gap-1.5">
          <Maximize2
            className="w-4 h-4 shrink-0 text-slate-500"
            aria-hidden="true"
          />
          <span className="text-slate-900 text-xs font-medium opacity-70 whitespace-nowrap">
            {formatArea(item.area)}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/admin/listing-property/edit/${item.id}`}
          state={{
            listTab: tab,
            property: {
              id: item.id,
              title: item.name,
              type: item.propertyType || "",
              bedrooms: item.bedrooms ? String(item.bedrooms) : "",
              bathrooms: item.bathrooms ? String(item.bathrooms) : "",
              area: item.area !== "—" ? item.area : "",
              description: item.description || "",
              street: item.streetAddress || "",
              city: item.city || "",
              state: item.state || "",
              zip: item.zip || "",
              saleType: "regular",
              listingPrice:
                item.price !== "—" ? String(item.price).replace("$", "") : "",
              purchase: item.purchase !== "—" ? item.purchase : "",
              renovation: item.renovation !== "—" ? item.renovation : "",
              arv: item.arv !== "—" ? item.arv : "",
              discount: item.discount
                ? String(item.discount).replace("%", "")
                : "",
              name: item.contactName || "",
              phone: item.contactPhone || "",
              email: item.contactEmail || "",
            },
          }}
          className="flex-1 bg-navy text-white text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 hover:bg-navy-hover transition-colors cursor-pointer"
        >
          <Pencil size={14} /> Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="flex-1 bg-red-50 text-red-600 text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </article>
);

const ListingProperty = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "regular" ? "regular" : "wholesale";
  const setTab = (value) => setSearchParams({ tab: value }, { replace: true });
  const [page, setPage] = useState(1);
  const [wholesale, setWholesale] = useState([]);
  const [regular, setRegular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveList = (responseData) => {
      const d = responseData?.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.items)) return d.items;
      if (Array.isArray(d?.properties)) return d.properties;
      return [];
    };

    const fetchListings = async () => {
      setLoading(true);
      const [wsRes, regRes] = await Promise.all([
        httpMethods.get(API_ENDPOINTS.PROPERTIES.LIST, {
          params: { listingType: "WHOLESALE", limit: 500 },
        }),
        httpMethods.get(API_ENDPOINTS.PROPERTIES.LIST, {
          params: { listingType: "REGULAR", limit: 500 },
        }),
      ]);
      if (wsRes.error) {
        toast.error(
          wsRes.error?.response?.data?.message ||
            "Failed to load wholesale listings.",
        );
      } else {
        setWholesale(resolveList(wsRes.data).map(mapToWholesaleCard));
      }
      if (regRes.error) {
        toast.error(
          regRes.error?.response?.data?.message ||
            "Failed to load regular listings.",
        );
      } else {
        setRegular(resolveList(regRes.data).map(mapToRegularCard));
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await httpMethods.delete(
      API_ENDPOINTS.PROPERTIES.BY_ID(id),
    );
    if (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete property.",
      );
      return;
    }
    if (tab === "wholesale") {
      setWholesale((prev) => prev.filter((item) => item.id !== id));
    } else {
      setRegular((prev) => prev.filter((item) => item.id !== id));
    }
    setPage(1);
    toast.success("Property deleted successfully!");
  };

  const items = tab === "wholesale" ? wholesale : regular;

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manage Your Property Listings
          </h1>
          <p className="text-gray-500 text-base mt-1">
            View, edit, and track the performance of all your listed properties
            in one place.
          </p>
        </div>
        <Link
          to={`${ROUTES.ADMIN_ADD_PROPERTY}/1`}
          className="bg-orange-500 text-white text-sm sm:text-base font-semibold px-5 py-2.5 rounded-md hover:bg-orange-600 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <Plus size={16} /> Add New Property
        </Link>
      </div>

      <div className="flex gap-2 border border-gray-200 rounded-md w-full sm:w-fit p-1 overflow-x-auto">
        <TabButton
          active={tab === "wholesale"}
          onClick={() => {
            setTab("wholesale");
            setPage(1);
          }}
        >
          Whole Sale
        </TabButton>
        <TabButton
          active={tab === "regular"}
          onClick={() => {
            setTab("regular");
            setPage(1);
          }}
        >
          Regular
        </TabButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {loading ? (
          <p className="col-span-full text-center text-gray-400 py-10">
            Loading listings…
          </p>
        ) : pageItems.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 py-10">
            No properties found.
          </p>
        ) : (
          pageItems.map((item) =>
            tab === "wholesale" ? (
              <WholesaleCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                tab={tab}
              />
            ) : (
              <RegularCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                tab={tab}
              />
            ),
          )
        )}
      </div>

      <div className="pt-2">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ListingProperty;
