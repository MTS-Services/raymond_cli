import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { ROUTES } from "../../config";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";
import Breadcrumb from "../../components/shared/Breadcrumb";

const TOTAL_STEPS = 4;

const stepLabel = (n) => `Step 0${n} of 0${TOTAL_STEPS}`;

const stepTitle = {
  1: "Basic Information",
  2: "Location Details",
  3: "Images",
  4: "Price & Contact Information",
};

const ProgressBar = ({ current }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm flex-wrap gap-2">
      <span className="text-orange-600 font-medium">{stepLabel(current)}</span>
      <span className="text-gray-500">{stepTitle[current]}</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
        const n = i + 1;
        const active = n <= current;
        return (
          <span
            key={n}
            className={`h-1.5 rounded-full ${
              active ? "bg-orange-500" : "bg-orange-100"
            }`}
          />
        );
      })}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={`border border-gray-200 rounded-md px-3.5 py-2.5 text-base text-gray-700 placeholder:text-gray-400 focus:outline-hidden focus:border-orange-400 transition-colors ${
      props.className ?? ""
    }`}
  />
);

const MoneyInput = ({ placeholder = "0.00", ...props }) => (
  <div className="flex items-center border border-gray-200 rounded-md focus-within:border-orange-400 transition-colors bg-white">
    <span className="pl-3.5 text-gray-500 text-base select-none">$</span>
    <input
      type="number"
      min="0"
      step="any"
      placeholder={placeholder}
      {...props}
      className="flex-1 py-2.5 px-2 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
    />
  </div>
);

const MoneyMillionInput = ({ placeholder = "0.0", ...props }) => (
  <div className="flex items-center border border-gray-200 rounded-md focus-within:border-orange-400 transition-colors bg-white">
    <span className="pl-3.5 text-gray-500 text-base select-none">$</span>
    <input
      type="number"
      min="0"
      step="any"
      placeholder={placeholder}
      {...props}
      className="flex-1 py-2.5 px-2 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
    />
    <span className="pr-3.5 text-gray-500 text-base select-none">m</span>
  </div>
);

const PercentInput = (props) => (
  <div className="flex items-center border border-gray-200 rounded-md focus-within:border-orange-400 transition-colors bg-white">
    <input
      type="number"
      min="0"
      max="100"
      step="any"
      placeholder="0"
      {...props}
      className="flex-1 py-2.5 pl-3.5 pr-2 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
    />
    <span className="pr-3.5 text-gray-500 text-base select-none">%</span>
  </div>
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="border border-gray-200 rounded-md px-3.5 py-2.5 text-base text-gray-700 bg-white focus:outline-hidden focus:border-orange-400 transition-colors cursor-pointer"
  >
    {children}
  </select>
);

const StepBasic = ({ form, onChange }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-5">
    <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
      Basic Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Property Title">
        <Input
          placeholder="Property Tittle"
          value={form.title}
          onChange={onChange("title")}
        />
      </Field>
      <Field label="Property Type">
        <Select value={form.type} onChange={onChange("type")}>
          <option value="">-- Select Property Type --</option>
          <option value="SINGLE_FAMILY_HOME">SINGLE FAMILY HOME</option>
          <option value="TOWNHOMES">TOWNHOMES</option>
          <option value="LAND">LAND</option>
          <option value="COMMERCIAL">COMMERCIAL</option>
        </Select>
      </Field>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="Bedrooms">
        <Input
          placeholder="Bedroom"
          value={form.bedrooms}
          onChange={onChange("bedrooms")}
        />
      </Field>
      <Field label="Bathrooms">
        <Input
          placeholder="Bathroom"
          value={form.bathrooms}
          onChange={onChange("bathrooms")}
        />
      </Field>
      <Field label="Area">
        <Input
          placeholder="Area"
          value={form.area}
          onChange={onChange("area")}
        />
      </Field>
    </div>
    <Field label="Description">
      <textarea
        placeholder="Property Tittle"
        value={form.description}
        onChange={onChange("description")}
        className="border border-gray-200 rounded-md px-3.5 py-2.5 text-base text-gray-700 placeholder:text-gray-400 focus:outline-hidden focus:border-orange-400 transition-colors min-h-24"
      />
    </Field>
  </div>
);

const StepLocation = ({ form, onChange }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-5">
    <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
      Location Details
    </h2>
    <Field label="Street Address">
      <Input
        placeholder="123 main st"
        value={form.street}
        onChange={onChange("street")}
      />
    </Field>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Field label="City">
        <Input
          placeholder="City"
          value={form.city}
          onChange={onChange("city")}
        />
      </Field>
      <Field label="State">
        <Input
          placeholder="State"
          value={form.state}
          onChange={onChange("state")}
        />
      </Field>
      <Field label="Zip Code">
        <Input
          placeholder="Zip code"
          value={form.zip}
          onChange={onChange("zip")}
        />
      </Field>
    </div>
  </div>
);

const UploadBox = ({
  title = "Drag and drop photos here",
  buttonLabel = "Upload Photos",
  accept = "image/*",
  onFileSelect,
}) => {
  const inputRef = React.useRef(null);
  return (
    <div className="border border-dashed border-gray-300 rounded-lg py-10 flex flex-col items-center gap-2 bg-gray-50/40 text-center px-4">
      <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center">
        <UploadCloud size={20} className="text-gray-500" aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">
        Or click to browse from your computer
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => onFileSelect && onFileSelect(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-2 bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
      >
        {buttonLabel}
      </button>
      <p className="text-xs text-gray-400 mt-1">
        JPEG, PNG • Max 20 photos • 1920×1080px recommended
      </p>
    </div>
  );
};

const Gallery = ({ images, onRemove }) =>
  images.length === 0 ? null : (
    <div>
      <p className="text-sm font-medium text-gray-800 mb-2">
        Uploaded Gallery ({images.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-video rounded-md overflow-hidden border border-gray-200"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-sm bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-navy text-white text-xs font-semibold text-center py-0.5">
                MAIN IMAGE
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

const VideoGallery = ({ videos, onRemove }) =>
  videos.length === 0 ? null : (
    <div>
      <p className="text-sm font-medium text-gray-800 mb-2">
        Uploaded Videos ({videos.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {videos.map((src, i) => (
          <div
            key={src}
            className="relative aspect-video rounded-md overflow-hidden border border-gray-200 bg-black"
          >
            <video
              src={src}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            <button
              type="button"
              aria-label="Remove video"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-sm bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

const StepImages = ({
  gallery,
  onPhotoUpload,
  onRemovePhoto,
  videoGallery,
  onVideoUpload,
  onRemoveVideo,
}) => (
  <div className="space-y-5">
    <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
      <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
        Upload Photos
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        High-quality photos increase your chances of selling by 40%.
      </p>
      <UploadBox onFileSelect={onPhotoUpload} />
    </div>
    <Gallery images={gallery} onRemove={onRemovePhoto} />
    <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
      <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-3">
        Upload Video
      </h2>
      <UploadBox
        title="Drag and drop video here"
        buttonLabel="Upload Video"
        accept="video/*"
        onFileSelect={onVideoUpload}
      />
    </div>
    <VideoGallery videos={videoGallery} onRemove={onRemoveVideo} />
  </div>
);

const StepPricing = ({ form, onChange }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-6">
    <div>
      <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-3">
        Pricing & Visibility
      </h2>
      <div className="flex gap-2 border border-gray-200 rounded-md w-full sm:w-fit p-1 mb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() =>
            onChange("saleType")({ target: { value: "wholesale" } })
          }
          className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
            form.saleType === "wholesale"
              ? "bg-navy text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Whole Sale
        </button>
        <button
          type="button"
          onClick={() => onChange("saleType")({ target: { value: "regular" } })}
          className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
            form.saleType === "regular"
              ? "bg-navy text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Regular
        </button>
      </div>
      {/* ── Wholesale fields ── */}
      {form.saleType === "wholesale" && (
        <>
          <p className="text-xs text-gray-400 -mt-2 mb-1">
            Enter full dollar amounts — e.g. <strong>850000</strong> for $850k,{" "}
            <strong>1500000</strong> for $1.5m
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Purchase Price">
              <MoneyInput
                placeholder="850000"
                value={form.purchase}
                onChange={onChange("purchase")}
              />
            </Field>
            <Field label="Estimated Renovation Cost">
              <MoneyInput
                placeholder="50000"
                value={form.renovation}
                onChange={onChange("renovation")}
              />
            </Field>
            <Field label="ARV (After Repair Value)">
              <MoneyMillionInput
                placeholder="1.1"
                value={form.arv}
                onChange={onChange("arv")}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Discount %">
              <PercentInput
                value={form.discount}
                onChange={onChange("discount")}
              />
            </Field>
          </div>
        </>
      )}

      {/* ── Regular fields ── */}
      {form.saleType === "regular" && (
        <>
          <p className="text-xs text-gray-400 -mt-2 mb-1">
            Enter full dollar amounts — e.g. <strong>850000</strong> for $850k,{" "}
            <strong>1500000</strong> for $1.5m
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Listing Price / Sale Price">
              <MoneyInput
                placeholder="500000"
                value={form.listingPrice}
                onChange={onChange("listingPrice")}
              />
            </Field>
            <Field label="Purchase Price">
              <MoneyInput
                placeholder="850000"
                value={form.purchase}
                onChange={onChange("purchase")}
              />
            </Field>
          </div>
        </>
      )}
    </div>

    <div>
      <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-3">
        Contact Information
      </h2>
      <Field label="Name">
        <Input
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          value={form.name}
          onChange={onChange("name")}
        />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <Field label="Contact Number">
          <Input
            type="tel"
            placeholder="Contact Number"
            autoComplete="tel"
            value={form.phone}
            onChange={onChange("phone")}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            value={form.email}
            onChange={onChange("email")}
          />
        </Field>
      </div>
    </div>
  </div>
);

const StepConfirm = ({ form, createdPropertyId }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="h-1 bg-orange-500 rounded-t-lg" />
      <div className="flex flex-col items-center py-10 sm:py-12 px-5 sm:px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/90 flex items-center justify-center mb-5">
          <Check size={28} className="text-white" strokeWidth={3} />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Your Listing is Confirmed
        </h2>
        <p className="text-base text-gray-500 mb-6">
          Excellent! Your Property has been listed on our website.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={() => {
              if (createdPropertyId) {
                navigate(ROUTES.PROPERTY_DETAILS.replace(":id", String(createdPropertyId)));
              } else {
                navigate(ROUTES.ADMIN_LISTING_PROPERTY, {
                  state: { tab: form?.saleType || "wholesale" },
                });
              }
            }}
            className="bg-orange-500 text-white text-sm sm:text-base font-semibold px-5 py-2.5 rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
          >
            View My Property Details →
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(ROUTES.ADMIN_LISTING_PROPERTY, {
                state: { tab: form?.saleType || "wholesale" },
              })
            }
            className="bg-white border border-gray-200 text-gray-800 text-sm sm:text-base font-semibold px-5 py-2.5 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const AddProperty = () => {
  const navigate = useNavigate();
  const { step } = useParams();
  const current = Math.min(Math.max(parseInt(step || "1", 10) || 1, 1), 5);

  const [form, setForm] = useState({
    title: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    saleType: "wholesale",
    listingPrice: "",
    purchase: "",
    renovation: "",
    arv: "",
    discount: "",
    name: "",
    phone: "",
    email: "",
  });
  const [gallery, setGallery] = useState([]);
  const [videoGallery, setVideoGallery] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [createdProperty, setCreatedProperty] = useState(null);
  const onChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handlePhotoUpload = (files) => {
    const fileArr = Array.from(files);
    const urls = fileArr.map((f) => URL.createObjectURL(f));
    setGallery((prev) => [...prev, ...urls]);
    setGalleryFiles((prev) => [...prev, ...fileArr]);
  };

  const handleRemovePhoto = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (files) => {
    const fileArr = Array.from(files);
    const urls = fileArr.map((f) => URL.createObjectURL(f));
    setVideoGallery((prev) => [...prev, ...urls]);
    setVideoFiles((prev) => [...prev, ...fileArr]);
  };

  const handleRemoveVideo = (index) => {
    setVideoGallery((prev) => prev.filter((_, i) => i !== index));
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const goStep = async (n) => {
    if (n < 1) return;
    if (n > 5) return;

    // Step 1 validation — title and propertyType are required before proceeding
    if (n === 2 && current === 1) {
      if (!form.title.trim()) {
        toast.error("Property title is required.");
        return;
      }
      if (!form.type) {
        toast.error("Please select a Property Type.");
        return;
      }
    }

    if (n === TOTAL_STEPS + 1) {
      // Guard: ensure Step 1 data is present (lost if page was refreshed on step 4)
      if (!form.title?.trim() || !form.type) {
        toast.error(
          "Please complete Step 1 first — property title and type are required.",
        );
        navigate(`${ROUTES.ADMIN_ADD_PROPERTY}/1`);
        return;
      }

      setSubmitting(true);
      const isWholesale = form.saleType !== "regular";

      // Build the JSON body — backend requires integers for bedrooms/bathrooms
      const body = {
        title: form.title,
        propertyType: form.type ? form.type.toUpperCase() : undefined,
        bedrooms: form.bedrooms !== "" ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms !== "" ? Number(form.bathrooms) : undefined,
        area: form.area || undefined,
        description: form.description || undefined,
        streetAddress: form.street || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zipCode: form.zip || undefined,
        listingType: isWholesale ? "WHOLESALE" : "REGULAR",
        contactName: form.name || undefined,
        contactNumber: form.phone || undefined,
        contactEmail: form.email || undefined,
      };

      if (!isWholesale && form.listingPrice !== "")
        body.askingPrice = Number(form.listingPrice);
      if (form.purchase !== "") body.purchasePrice = Number(form.purchase);
      if (isWholesale && form.renovation !== "")
        body.estimatedRenovationCost = Number(form.renovation);
      if (isWholesale && form.arv !== "")
        body.arv = Math.round(parseFloat(form.arv) * 1000000);
      if (isWholesale && form.discount !== "")
        body.discount = Number(form.discount);

      let payload = body;
      let requestConfig = {};

      // Only use FormData when files are attached
      if (galleryFiles.length > 0 || videoFiles.length > 0) {
        const fd = new FormData();
        Object.entries(body).forEach(
          ([k, v]) => v !== undefined && fd.append(k, v),
        );
        galleryFiles.forEach((f) => fd.append("images", f));
        if (videoFiles.length > 0) fd.append("video", videoFiles[0]);
        payload = fd;
        // Clear Content-Type so browser sets correct multipart boundary
        requestConfig = { headers: { "Content-Type": undefined } };
      }

      const { data, error } = await httpMethods.post(
        API_ENDPOINTS.PROPERTIES.CREATE,
        payload,
        requestConfig,
      );
      setSubmitting(false);

      if (error || !data?.data) {
        const backendMsg = Array.isArray(error?.data?.message)
          ? error.data.message.join(" | ")
          : error?.data?.message;
        toast.error(
          backendMsg ||
            error?.message ||
            "Failed to create property. Please try again.",
        );
        return;
      }

      setCreatedProperty(data.data);
    }

    navigate(`${ROUTES.ADMIN_ADD_PROPERTY}/${n}`);
  };

  const trail = useMemo(() => {
    const base = [
      { label: "Listing Property", to: ROUTES.ADMIN_LISTING_PROPERTY },
      { label: "Add New Property", to: ROUTES.ADMIN_ADD_PROPERTY },
    ];
    if (current <= TOTAL_STEPS) {
      base.push({ label: stepLabel(current) });
    } else {
      base.push({ label: "Confirmation" });
    }
    return base;
  }, [current]);

  const showProgress = current <= TOTAL_STEPS;

  return (
    <div className="space-y-5">
      <Breadcrumb items={trail} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          List Your Property
        </h1>
        <p className="text-gray-500 text-base mt-1">
          Follow our simple 4-step process to get your home in front of
          thousands of buyers.
        </p>
      </div>

      {showProgress && <ProgressBar current={current} />}

      {current === 1 && <StepBasic form={form} onChange={onChange} />}
      {current === 2 && <StepLocation form={form} onChange={onChange} />}
      {current === 3 && (
        <StepImages
          gallery={gallery}
          onPhotoUpload={handlePhotoUpload}
          onRemovePhoto={handleRemovePhoto}
          videoGallery={videoGallery}
          onVideoUpload={handleVideoUpload}
          onRemoveVideo={handleRemoveVideo}
        />
      )}
      {current === 4 && <StepPricing form={form} onChange={onChange} />}
      {current === 5 && (
        <StepConfirm form={form} createdPropertyId={createdProperty?.id} />
      )}

      {showProgress && (
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          {current > 1 ? (
            <button
              type="button"
              onClick={() => goStep(current - 1)}
              className="bg-navy text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-full hover:bg-navy-hover transition-colors cursor-pointer w-full sm:w-auto"
            >
              Back
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}
          <button
            type="button"
            onClick={() => goStep(current + 1)}
            disabled={submitting}
            className="bg-orange-500 text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-full hover:bg-orange-600 transition-colors cursor-pointer w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Submitting…"
              : current === TOTAL_STEPS
                ? "Submit"
                : "Next"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
