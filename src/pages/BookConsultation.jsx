import React, { memo } from "react";
import { useSEO } from "../hooks/useSEO";
import BookConsultationSection from "../components/consultation/BookConsultationSection";

const BookConsultation = memo(() => {
  useSEO({
    title: "Book a Consultation | Skyridge Group",
    description:
      "Schedule a personalized investment consultation with the Skyridge Group team. Discuss your real estate investment goals with our expert advisors.",
  });

  return (
    <div className="min-h-screen bg-white pt-20">
      <BookConsultationSection />
    </div>
  );
});

BookConsultation.displayName = "BookConsultation";

export default BookConsultation;
