"use client";

import { ExternalLink, MapPin, Phone, Navigation2 } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const MAP_SRC = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28873.720116697456!2d55.286505!3d25.229682!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69fd2f821037%3A0x4ff9010ee823d73a!2sAvyanco%20Business%20Setup%20Consultancy!5e0!3m2!1sen!2sus!4v1779423978665!5m2!1sen!2sus";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/70 bg-[linear-gradient(180deg,#15234f_0%,#101b3f_100%)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10">
          <div className="grid gap-6">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-[#a5b4fc]">
                <img
                src="/logo-white.webp"
                alt="Avyanco Logo"
                className="w-50 h-auto inline-block -mt-1 "
              />
              </span>

            </div>

            <p className="max-w-xl text-white/68 text-sm leading-relaxed">
            <span className="text-xs font-bold tracking-widest uppercase mr-2 px-1.5 py-0.5 rounded border border-[#e05c4b] text-[#ff978b]">
                IDEAPROOF
              </span>
              AI-powered UAE business idea validation, designed for founders who want fast
              market clarity, better positioning, and practical launch guidance from Avyanco.
            </p>

            <div className="grid sm:grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/971588288968?text=Hi%20Avyanco!%20I%20would%20like%20to%20discuss%20my%20business%20idea."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-50 transition-colors hover:bg-emerald-400/18"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp Support
              </a>
              <a
                href="https://avyanco.com/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/6 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              >
                <Phone size={16} />
                Book Consultation
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm text-white/72">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <MapPin size={15} className="text-[#ff978b]" />
                  Visit us
                </div>
                <p className="leading-relaxed">
                  Level 36, Burj Al Salam Tower, Trade Center First, Sheikh Zayed Road, Dubai, UAE
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <Navigation2 size={15} className="text-[#ff978b]" />
                  Contact
                </div>
                <ul className="grid gap-2">
                  <li>
                    <a href="tel:+971588288968" className="hover:text-white transition-colors">
                      +971 58 828 8968
                    </a>
                  </li>
                  <li>
                    <a href="mailto:info@avyanco.com" className="hover:text-white transition-colors">
                      info@avyanco.com
                    </a>
                  </li>
                  <li>
                    <a href="https://avyanco.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      avyanco.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/10">
              <iframe
                title="Avyanco location map"
                src={MAP_SRC}
                className="h-[320px] w-full rounded-[1.15rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5 text-[13px] text-white/70">
              <a href="https://avyanco.com/uae-offshore-company-formation/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 hover:bg-white/10 transition-colors">
                <span>UAE Offshore Company</span>
                <ExternalLink size={13} />
              </a>
              <a href="https://avyanco.com/free-zone/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 hover:bg-white/10 transition-colors">
                <span>Free Zone Company</span>
                <ExternalLink size={13} />
              </a>
              <a href="https://avyanco.com/mainland-company-formation-dubai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 hover:bg-white/10 transition-colors">
                <span>Mainland Company</span>
                <ExternalLink size={13} />
              </a>
              <a href="https://avyanco.com/pro-services-in-dubai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 hover:bg-white/10 transition-colors">
                <span>PRO Services</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-white/40">
          <p>© 2026 Avyanco Business Setup Consultancy. All rights reserved.</p>
          <p className="max-w-2xl sm:text-right leading-relaxed">
            Disclaimer: IdeaProof reports are AI-generated estimates and do not constitute legal or financial advice. Always consult a licensed professional before making business decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
