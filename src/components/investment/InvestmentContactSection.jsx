import React, { memo, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { Phone, Mail } from "lucide-react";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+1 206-948-6426" },
  { icon: Mail, label: "Email", value: "Support@skyridgegroup.com" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
};

const InvestmentContactSection = memo(({ prefilledInterest }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledInterest) {
      setForm((prev) => ({ ...prev, interest: prefilledInterest }));
    }
  }, [prefilledInterest]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      const { data, error } = await httpMethods.post(
        API_ENDPOINTS.INVESTMENTS.APPLICATIONS.CREATE,
        {
          fullName: form.name,
          email: form.email,
          phoneNumber: form.phone,
          investmentInterest: form.interest,
          message: form.message,
        },
      );
      setSubmitting(false);
      if (error || !data?.data) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.",
        );
        return;
      }
      toast.success("Your consultation request has been submitted!");
      setForm(INITIAL_FORM);
    },
    [form],
  );

  const inputClass =
    "h-11 w-full border border-gray-200 rounded-lg px-4 text-sm text-ink-soft placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all";

  return (
    <section
      id="invest-contact-section"
      className="py-14 lg:py-20 bg-surface-dark mb-14 lg:mb-20"
      aria-labelledby="contact-invest-heading"
    >
      <div className="max-w-384 mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            id="contact-invest-heading"
            className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-white font-bold"
          >
            Ready to <span className="text-orange-500">Invest With Us?</span>
          </h2>
          <p className="text-base text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
            Join our network of successful investors and start building wealth
            through premium real estate opportunities. Schedule a consultation
            to discuss your investment goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info panel */}
          <div className="bg-panel-dark border border-panel-border rounded-2xl p-5 sm:p-8 flex flex-col gap-6 self-start">
            <h3 className="text-white text-xl font-bold">
              Contact Information
            </h3>
            <div className="flex flex-col gap-5">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500 flex items-center justify-center rounded-lg shrink-0">
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-gray-400 text-sm font-medium">
                      {label}
                    </span>
                    <span className="text-gray-200 text-sm whitespace-pre-line">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule form */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-lg">
            <h3 className="text-ink-soft text-xl font-semibold mb-6">
              Schedule a Consultation
            </h3>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="inv-name"
                  className="text-sm font-medium text-label"
                >
                  Full Name
                </label>
                <input
                  id="inv-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="inv-email"
                  className="text-sm font-medium text-label"
                >
                  Email Address
                </label>
                <input
                  id="inv-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="inv-phone"
                  className="text-sm font-medium text-label"
                >
                  Phone Number
                </label>
                <input
                  id="inv-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="inv-interest"
                  className="text-sm font-medium text-label"
                >
                  Investment Interest
                </label>
                <input
                  id="inv-interest"
                  name="interest"
                  type="text"
                  value={form.interest}
                  onChange={handleChange}
                  placeholder="e.g. Residential Development, New Construction"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="inv-message"
                  className="text-sm font-medium text-label"
                >
                  Message
                </label>
                <textarea
                  id="inv-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Share your investment goals and financial objectives..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-ink-soft placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 h-12 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? "Submitting..." : "Submit Request →"}
              </button>
              <p className="text-xs text-gray-400 text-center">
                We&apos;ll respond within 24 hours to schedule your
                consultation.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

InvestmentContactSection.displayName = "InvestmentContactSection";

export default InvestmentContactSection;
