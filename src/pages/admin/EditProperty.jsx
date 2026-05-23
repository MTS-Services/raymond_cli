import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  DollarSign,
} from "lucide-react";
import { ROUTES } from "../../config";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";
import Breadcrumb from "../../components/shared/Breadcrumb";

const INITIAL = {
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
};

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

const Textarea = (props) => (
  <textarea
    {...props}
    className={`border border-gray-200 rounded-md px-3.5 py-2.5 text-base text-gray-700 placeholder:text-gray-400 focus:outline-hidden focus:border-orange-400 transition-colors min-h-24 ${
      props.className ?? ""
    }`}
  />
);

const UploadBox = ({
  title = "Drag and drop photos here",
  buttonLabel = "Upload Photos",
  accept = "image/*",
  onFileSelect,
}) => {
  const inputRef = React.useRef(null);
  return (
    <div className="border border-dashed border-gray-300 rounded-lg py-10 flex flex-col items-center gap-2 bg-gray-50/40">
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

const Gallery = ({ images, onRemove, deletingId }) =>
  images.length === 0 ? null : (
    <div>
      <p className="text-sm font-medium text-gray-800 mb-2">
        Uploaded Gallery ({images.length})
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((item, i) => (
          <div
            key={item.id || item.url || i}
            className="relative aspect-video rounded-md overflow-hidden border border-gray-200"
          >
            <img src={item.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onRemove(i)}
              disabled={!!deletingId && deletingId === item.id}
              className="absolute top-1 right-1 w-5 h-5 rounded-sm bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deletingId === item.id ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
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

const EditProperty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: propertyId } = useParams();
  const [form, setForm] = useState({ ...INITIAL });
  const [gallery, setGallery] = useState([]);
  const [videoGallery, setVideoGallery] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  useEffect(() => {
    if (!propertyId || propertyId === "new") {
      setLoadingProperty(false);
      return;
    }
    let cancelled = false;
    const fetchProperty = async () => {
      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.PROPERTIES.BY_ID(propertyId),
      );
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load property data.");
        setLoadingProperty(false);
        return;
      }
      const res = data?.data ?? data;
      setForm({
        title: res.title ?? "",
        type: res.propertyType ?? "",
        bedrooms: res.bedrooms != null ? String(res.bedrooms) : "",
        bathrooms: res.bathrooms != null ? String(res.bathrooms) : "",
        area: res.area ?? "",
        description: res.description ?? "",
        street: res.streetAddress ?? "",
        city: res.city ?? "",
        state: res.state ?? "",
        zip: res.zipCode ?? "",
        saleType: res.listingType === "REGULAR" ? "regular" : "wholesale",
        listingPrice: res.askingPrice != null ? String(res.askingPrice) : "",
        purchase: res.purchasePrice != null ? String(res.purchasePrice) : "",
        renovation:
          res.estimatedRenovationCost != null
            ? String(res.estimatedRenovationCost)
            : "",
        arv: res.arv != null ? String(res.arv) : "",
        discount: res.discount != null ? String(res.discount) : "",
        name: res.contactName ?? "",
        phone: res.contactNumber ?? "",
        email: res.contactEmail ?? "",
      });
      const imageObjects = Array.isArray(res.images)
        ? res.images
            .map((img) =>
              typeof img === "string"
                ? { id: null, url: img }
                : { id: img?.id ?? null, url: img?.url ?? "" },
            )
            .filter((item) => item.url)
        : [];
      setGallery(imageObjects);
      const videoUrls = res.video
        ? [res.video]
        : Array.isArray(res.videos)
          ? res.videos
              .map((v) => (typeof v === "string" ? v : v?.url))
              .filter(Boolean)
          : [];
      setVideoGallery(videoUrls);
      setLoadingProperty(false);
    };
    fetchProperty();
    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  const handleSave = async () => {
    if (!propertyId || propertyId === "new") {
      toast.error("Property ID not found. Cannot save changes.");
      return;
    }
    setSubmitting(true);
    const isWholesale = form.saleType !== "regular";

    const body = {
      title: form.title || undefined,
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
    if (isWholesale && form.arv !== "") body.arv = Number(form.arv);
    if (isWholesale && form.discount !== "")
      body.discount = Number(form.discount);

    let payload = body;
    let requestConfig = {};

    if (galleryFiles.length > 0 || videoFiles.length > 0) {
      const fd = new FormData();
      Object.entries(body).forEach(
        ([k, v]) => v !== undefined && fd.append(k, v),
      );
      galleryFiles.forEach((f) => fd.append("images", f));
      if (videoFiles.length > 0) fd.append("video", videoFiles[0]);
      payload = fd;
      requestConfig = { headers: { "Content-Type": undefined } };
    }

    const { error } = await httpMethods.put(
      API_ENDPOINTS.PROPERTIES.BY_ID(propertyId),
      payload,
      requestConfig,
    );
    setSubmitting(false);

    if (error) {
      const backendMsg = Array.isArray(error?.data?.message)
        ? error.data.message.join(" | ")
        : error?.data?.message;
      toast.error(
        backendMsg ||
          error?.message ||
          "Failed to save changes. Please try again.",
      );
      return;
    }
    toast.success("Property saved successfully!");
    navigate(ROUTES.ADMIN_LISTING_PROPERTY);
  };

  const handlePhotoUpload = (files) => {
    const fileArr = Array.from(files);
    const newItems = fileArr.map((f) => ({
      id: null,
      url: URL.createObjectURL(f),
    }));
    setGallery((prev) => [...prev, ...newItems]);
    setGalleryFiles((prev) => [...prev, ...fileArr]);
  };

  const handleRemovePhoto = async (index) => {
    const item = gallery[index];
    if (item.id) {
      setDeletingImageId(item.id);
      const { error } = await httpMethods.delete(
        API_ENDPOINTS.PROPERTIES.DELETE_IMAGE(propertyId, item.id),
      );
      setDeletingImageId(null);
      if (error) {
        toast.error("Failed to delete image.");
        return;
      }
    } else {
      // Local upload — remove the matching File from galleryFiles
      const nullIdsBefore = gallery.slice(0, index).filter((g) => !g.id).length;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== nullIdsBefore));
    }
    setGallery((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Listing Property", to: ROUTES.ADMIN_LISTING_PROPERTY },
          { label: "Edit Property" },
        ]}
      />
      {loadingProperty ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Edit Property
              </h1>
              <p className="text-gray-500 text-base mt-1">
                View, edit, and track the performance of all your listed
                properties.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Property Title">
              <Input value={form.title} onChange={onChange("title")} />
            </Field>
            <Field label="Property Type">
              <select
                value={form.type}
                onChange={onChange("type")}
                className="border border-gray-200 rounded-md px-3.5 py-2.5 text-base text-gray-700 bg-white focus:outline-hidden focus:border-orange-400 transition-colors cursor-pointer"
              >
                <option value="">-- Select Property Type --</option>
                <option value="DETACHED">Detached</option>
                <option value="SEMI_DETACHED">Semi-Detached</option>
                <option value="TERRACE">Terraced</option>
                <option value="END_OF_TERRACE">End of Terrace</option>
                <option value="FLAT">Apartment / Flat</option>
                <option value="BUNGALOW">Bungalow</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="LAND">Land</option>
                <option value="OFFICE_SPACE">Office Space</option>
              </select>
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
            <Textarea
              value={form.description}
              onChange={onChange("description")}
            />
          </Field>

          <Field label="Street Address">
            <Input value={form.street} onChange={onChange("street")} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="City">
              <Input value={form.city} onChange={onChange("city")} />
            </Field>
            <Field label="State">
              <Input value={form.state} onChange={onChange("state")} />
            </Field>
            <Field label="Zip Code">
              <Input value={form.zip} onChange={onChange("zip")} />
            </Field>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 mt-2">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
              Upload Photos
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              High-quality photos increase your chances of selling by 40%.
            </p>
            <UploadBox onFileSelect={handlePhotoUpload} />
          </div>

          <Gallery
            images={gallery}
            onRemove={handleRemovePhoto}
            deletingId={deletingImageId}
          />

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-3">
              Upload video
            </h2>
            <UploadBox
              title="Drag and drop video here"
              buttonLabel="Upload Video"
              accept="video/*"
              onFileSelect={handleVideoUpload}
            />
          </div>

          <VideoGallery videos={videoGallery} onRemove={handleRemoveVideo} />

          {/* Pricing section */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-5">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
              Pricing &amp; Visibility
            </h2>
            <div className="flex gap-2 border border-gray-200 rounded-md w-full sm:w-fit p-1">
              {["wholesale", "regular"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    onChange("saleType")({ target: { value: type } })
                  }
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap text-center ${
                    form.saleType === type
                      ? "bg-navy text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type === "wholesale" ? "Whole Sale" : "Regular"}
                </button>
              ))}
            </div>

            {form.saleType === "wholesale" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Purchase Price
                    </label>
                    <Input
                      placeholder="$850.00"
                      value={form.purchase}
                      onChange={onChange("purchase")}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Estimated Renovation Cost
                    </label>
                    <Input
                      placeholder="$50.00"
                      value={form.renovation}
                      onChange={onChange("renovation")}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      ARV (After Repair Value)
                    </label>
                    <Input
                      placeholder="$1.1m"
                      value={form.arv}
                      onChange={onChange("arv")}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-sm font-medium text-gray-700">
                    Discount %
                  </label>
                  <Input
                    placeholder="%"
                    value={form.discount}
                    onChange={onChange("discount")}
                  />
                </div>
              </>
            )}

            {form.saleType === "regular" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Listing Price / Sale Price
                  </label>
                  <Input
                    placeholder="$2,095.00"
                    value={form.listingPrice}
                    onChange={onChange("listingPrice")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Purchase Price
                  </label>
                  <Input
                    placeholder="$850.00"
                    value={form.purchase}
                    onChange={onChange("purchase")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 space-y-5">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
              Contact Information
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                placeholder="Name"
                value={form.name}
                onChange={onChange("name")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <Input
                  placeholder="Contact Number"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange("email")}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_LISTING_PROPERTY)}
              className="bg-navy text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-full hover:bg-navy-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="bg-orange-500 text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-full hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving\u2026" : "Save Change"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditProperty;
