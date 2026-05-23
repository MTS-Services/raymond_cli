import React, { memo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSEO } from "../hooks/useSEO";
import PhotoGallerySection from "../components/property/PhotoGallerySection";
import PropertyInfoSection from "../components/property/PropertyInfoSection";
import { httpMethods } from "../services/httpMethods";
import { API_ENDPOINTS } from "../services/httpEndpoint";

const PropertyDetails = memo(() => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: property
      ? `${property.title} -- Skyridge Group`
      : "Property Details -- Skyridge Group",
    description:
      property?.description?.slice?.(0, 160) ??
      "View full property details on Skyridge Group.",
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchProperty = async () => {
      setLoading(true);
      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.PROPERTIES.BY_ID(id),
      );
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load property details.");
      } else {
        setProperty(data?.data ?? data);
      }
      setLoading(false);
    };
    fetchProperty();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="py-20">
        <PhotoGallerySection images={property?.images} showBadge={false} />
        <PropertyInfoSection property={property} isOffer={false} />
      </div>
    </div>
  );
});

PropertyDetails.displayName = "PropertyDetails";

export default PropertyDetails;
