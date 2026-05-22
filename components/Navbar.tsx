"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface Props {
  hasHistory: boolean;
}

export default function Navbar({ hasHistory }: Props) {
  const [scrolled, setScrolled] = useState(false);

  const whatsappUrl = `https://wa.me/971588288968?text=${encodeURIComponent("Hi Avyanco! I would like help validating my business idea.")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1 select-none">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#2c3e7d" }}
            >
              <img
                src="/logo-blue.webp"
                alt="Avyanco Logo"
                className="w-50 h-auto inline-block -mt-1 "
              />
            </span>
            {/* <span
              className="text-xs font-bold tracking-widest uppercase ml-1 px-1.5 py-0.5 rounded"
              style={{
                color: "#e05c4b",
                border: "1.5px solid #e05c4b",
                letterSpacing: "0.15em",
              }}
            >
              IDEAPROOF
            </span> */}
          </Link>

          {/* Right-side actions — desktop: text + icon; mobile: icon only */}
          <div className="flex items-center gap-6">
            {hasHistory && (
              <a
                href="#history"
                className="hidden md:block text-sm font-semibold text-slate-600 hover:text-avyanco-navy transition-colors"
              >
                History
              </a>
            )}
            {/* Desktop: label + icon */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="navbar-cta"
              className="hidden md:inline-flex cta-emerald header-whatsapp"
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              WhatsApp Us
            </a>
            {/* Mobile: icon only */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Avyanco"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

    </nav>
  );
}
