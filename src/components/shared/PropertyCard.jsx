import React, { memo } from "react";
import { BedDouble, Bath, Maximize2 } from "lucide-react";

const formatArea = (value) => {
  if (value == null || value === "" || value === "—") return "—";
  const text = String(value).trim();
  if (
    text.toLowerCase().includes("sqft") ||
    text.toLowerCase().includes("sq ft") ||
    text.toLowerCase().includes("m²") ||
    text.toLowerCase().includes("m2") ||
    text.toLowerCase().includes("sqm")
  ) {
    return text;
  }
  return `${text} sqft`;
};

const PropertyFacility = memo(({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="w-4 h-4 shrink-0 text-slate-500" aria-hidden="true" />
    <span className='text-slate-900 text-xs font-medium font-["Plus_Jakarta_Sans",sans-serif] opacity-70 whitespace-nowrap'>
      {label}
    </span>
  </div>
));
PropertyFacility.displayName = "PropertyFacility";

const PropertyCard = memo(
  ({ name, address, price, beds, Bathrooms, area, image }) => (
    <article className="bg-white border-[1.5px] border-primary-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="h-52 overflow-hidden shrink-0 bg-slate-200">
        {image ? (
          <img
            src={image}
            alt={`${name} -- property listing`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.parentElement.classList.add(
                "flex",
                "items-center",
                "justify-center",
              );
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-200" />
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <p className='text-primary text-xl font-extrabold tracking-[-0.6px] font-["Plus_Jakarta_Sans",sans-serif] mb-2'>
          {price}
        </p>
        <h3 className='font-["Plus_Jakarta_Sans",sans-serif] text-slate-900 text-xl font-bold leading-tight tracking-[-0.16px] mb-1'>
          {name}
        </h3>
        <p className='text-gray-800 text-sm font-medium font-["Plus_Jakarta_Sans",sans-serif] opacity-50 mb-4'>
          {address}
        </p>
        <hr className="border-primary-200 mb-3 mt-auto" />

        {/* Adjusted footer layout with flex-wrap and responsive gaps */}
        <div className="flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-3 items-center">
          <PropertyFacility icon={BedDouble} label={`${beds} Beds`} />
          <span
            className="w-px h-3.5 bg-primary-200 shrink-0"
            aria-hidden="true"
          />
          <PropertyFacility icon={Bath} label={`${Bathrooms} Baths`} />
          <span
            className="w-px h-3.5 bg-primary-200 shrink-0 hidden xs:block"
            aria-hidden="true"
          />
          <PropertyFacility icon={Maximize2} label={formatArea(area)} />
        </div>
      </div>
    </article>
  ),
);
PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
