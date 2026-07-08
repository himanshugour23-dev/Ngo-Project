"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type NavItem = { href: string; title: string; sub: string };

const SIGNIN_ITEMS: NavItem[] = [
  { href: "/login", title: "As volunteer", sub: "Find & join community needs" },
  { href: "/ngo/login", title: "As NGO", sub: "Manage needs & volunteers" },
];

const GETSTARTED_ITEMS: NavItem[] = [
  { href: "/signup", title: "As volunteer", sub: "Browse causes near you" },
  { href: "/ngo-signup", title: "Register your NGO", sub: "Post needs, find helpers" },
];

const SECTION_LINKS: NavItem[] = [
  { href: "#how", title: "How it works", sub: "Three steps to getting involved" },
  { href: "#needs", title: "Active needs", sub: "Browse live community requests" },
  { href: "#impact", title: "Impact", sub: "Real stories from the ground" },
  { href: "#join", title: "Join", sub: "Sign up as volunteer or NGO" },
];

function Dropdown({
  label,
  solid,
  items,
}: {
  label: string;
  solid?: boolean;
  items: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={
          solid
            ? "rounded-[10px] px-4 sm:px-[22px] py-2 sm:py-[9px] text-sm font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] transition-colors whitespace-nowrap"
            : "rounded-[10px] px-3 sm:px-[18px] py-2 text-sm font-bold text-[#2d6a4f] border-[1.5px] border-[#c8d5ca] hover:bg-[#e8f5ee] transition-colors whitespace-nowrap"
        }
      >
        {label} <span className="inline-block ml-0.5">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+10px)] right-0 bg-white border border-[#e8e4dc] rounded-[14px] p-1.5 min-w-[220px] z-[200] shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          {items.map(({ href, title, sub }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-[9px] px-3.5 py-2.5 no-underline hover:bg-[#f5f2ed] transition-colors"
            >
              <span className="block text-sm font-semibold text-[#1c2b1e]">{title}</span>
              <span className="block text-xs text-[#8a9e8c] mt-0.5">{sub}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] bg-[#faf8f4]/95 backdrop-blur-md border-b border-[#ece8e0] px-5 sm:px-10 h-[68px] flex items-center gap-4 sm:gap-10 font-['Nunito',sans-serif] transition-shadow ${
        scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
        <div className="w-[34px] h-[34px] bg-[#d4890a] rounded-[9px] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.6C6.4 16.1 1 11.3 1 7.2 1 3.4 4.1 2 6.3 2c1.3 0 4.2.5 5.7 4.5C13.6 2.5 16.5 2 17.7 2 20.2 2 23 3.6 23 7.2c0 4.1-5.1 8.6-11 14.4z" />
          </svg>
        </div>
        <span className="font-['Playfair_Display',serif] text-lg font-bold text-[#2d6a4f]">
          ngoSupport
        </span>
      </Link>

      {/* desktop: dropdowns hold everything — section links live inside Get started's sibling menu trigger */}
      <div className="hidden md:flex items-center gap-2.5 ml-auto">
        <Dropdown label="Menu" items={SECTION_LINKS} />
        <Dropdown label="Sign in" items={SIGNIN_ITEMS} />
        <Dropdown label="Get started" solid items={GETSTARTED_ITEMS} />
      </div>


      {/* mobile: backdrop + slide-in drawer from the right */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-[300] bg-black/40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`md:hidden fixed top-0 right-0 z-[301] h-full w-[82vw] max-w-[340px] bg-[#faf8f4] shadow-[-8px_0_40px_rgba(0,0,0,0.18)] flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-[#ece8e0] shrink-0">
          <span className="font-['Playfair_Display',serif] text-lg font-bold text-[#2d6a4f]">
            ngoSupport
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-[10px] border-[1.5px] border-[#c8d5ca] text-[#2d6a4f]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8">
          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#8a9e8c] mb-3">
              Explore
            </div>
            <div className="flex flex-col gap-1">
              {SECTION_LINKS.map(({ href, title, sub }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[10px] px-3 py-3 no-underline hover:bg-[#f0ece3] transition-colors"
                >
                  <span className="block text-[0.95rem] font-semibold text-[#1c2b1e]">{title}</span>
                  <span className="block text-xs text-[#8a9e8c] mt-0.5">{sub}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#8a9e8c] mb-3">
              Sign in
            </div>
            <div className="flex flex-col gap-1">
              {SIGNIN_ITEMS.map(({ href, title, sub }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[10px] px-3 py-3 no-underline hover:bg-[#f0ece3] transition-colors"
                >
                  <span className="block text-[0.95rem] font-semibold text-[#1c2b1e]">{title}</span>
                  <span className="block text-xs text-[#8a9e8c] mt-0.5">{sub}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#8a9e8c] mb-3">
              Get started
            </div>
            <div className="flex flex-col gap-2">
              {GETSTARTED_ITEMS.map(({ href, title, sub }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[12px] px-4 py-3.5 no-underline bg-[#2d6a4f] hover:bg-[#1b4332] transition-colors"
                >
                  <span className="block text-[0.95rem] font-bold text-white">{title}</span>
                  <span className="block text-xs text-white/70 mt-0.5">{sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}