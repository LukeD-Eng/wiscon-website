"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-semibold text-xl tracking-tight" style={{ color: "var(--color-black)" }}>
            WIS<span style={{ color: "var(--color-green)" }}>C</span>ON
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--color-black)" }}>
          <a href="#services" className="hover:opacity-60 transition-opacity">Platform</a>
          <a href="#why-whatsapp" className="hover:opacity-60 transition-opacity">Why WhatsApp</a>
          <a href="#waitlist" className="hover:opacity-60 transition-opacity">Waitlist</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className="hidden sm:inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-green)" }}
          >
            Join Waitlist
          </a>
          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 mb-1" style={{ backgroundColor: "var(--color-black)" }} />
            <span className="block w-5 h-0.5 mb-1" style={{ backgroundColor: "var(--color-black)" }} />
            <span className="block w-5 h-0.5" style={{ backgroundColor: "var(--color-black)" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 px-5 py-4 flex flex-col gap-4 bg-white">
          <a href="#services" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Platform</a>
          <a href="#why-whatsapp" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Why WhatsApp</a>
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-green)" }}
            onClick={() => setMenuOpen(false)}
          >
            Join Waitlist
          </a>
        </div>
      )}
    </header>
  );
}
