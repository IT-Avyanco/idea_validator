"use client";

import { useState } from "react";
import { FileDown, Phone, Loader2 } from "lucide-react";
import type { ValidationResult, FormData } from "@/lib/gemini";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface Props {
  results: ValidationResult;
  formData: FormData;
}

export default function ActionButtons({ results, formData }: Props) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      const { generatePDF } = await import("@/lib/pdfExport");
      await generatePDF(results, formData);
    } catch (e) {
      console.error("PDF error:", e);
      alert("PDF generation failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Avyanco! I just validated my business idea "${results.ideaTitle}" on IdeaProof and got a score of ${results.overallScore}/100. I'd love to learn more about setting up in the UAE.`
  );
  const whatsappUrl = `https://wa.me/971588288968?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* PDF Download */}
      <button
        id="pdf-download-btn"
        onClick={handlePDF}
        disabled={pdfLoading}
        className="flex-1 cta-muted justify-center disabled:opacity-60"
      >
        {pdfLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileDown size={16} />
        )}
        {pdfLoading ? "Generating..." : "Download PDF Report"}
      </button>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-share-btn"
        className="flex-1 cta-emerald"
      >
        <WhatsAppIcon className="w-4 h-4" />
        Share on WhatsApp
      </a>

      {/* Book Consultation */}
      <a
        href="https://avyanco.com/contact/"
        target="_blank"
        rel="noopener noreferrer"
        id="book-consultation-btn"
        className="flex-1 cta-hot animate-pulse-ring"
      >
        <Phone size={16} />
        Book Free Consultation
      </a>
    </div>
  );
}
