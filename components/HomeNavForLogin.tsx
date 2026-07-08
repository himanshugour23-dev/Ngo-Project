// "use client";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";

// function Dropdown({ label, solid, items }: {
//   label: string;
//   solid?: boolean;
//   items: { href: string; title: string; sub: string }[];
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handler(e: MouseEvent) {
//       if (!ref.current?.contains(e.target as Node)) setOpen(false);
//     }
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, []);

//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       <button
//         onClick={() => setOpen((v) => !v)}
//         style={{
//           padding: solid ? "9px 22px" : "8px 18px",
//           borderRadius: 10,
//           border: solid ? "none" : "1.5px solid #c8d5ca",
//           background: solid ? "#2d6a4f" : "transparent",
//           color: solid ? "#fff" : "#2d6a4f",
//           fontFamily: "'Nunito', sans-serif",
//           fontSize: "0.875rem",
//           fontWeight: 700,
//           cursor: "pointer",
//         }}
//       >
//         {label} {open ? "▴" : "▾"}
//       </button>
//       {open && (
//         <div style={{
//           position: "absolute", top: "calc(100% + 10px)", right: 0,
//           background: "#fff", border: "1px solid #e8e4dc", borderRadius: 14,
//           padding: 6, minWidth: 200, zIndex: 200,
//           boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
//         }}>
//           {items.map(({ href, title, sub }) => (
//             <Link key={href} href={href} onClick={() => setOpen(false)}
//               style={{ display: "block", padding: "10px 14px", borderRadius: 9, textDecoration: "none" }}
//               className="dd-nav-item"
//             >
//               <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1c2b1e" }}>{title}</span>
//               <span style={{ display: "block", fontSize: "0.75rem", color: "#8a9e8c", marginTop: 2 }}>{sub}</span>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function HomeNav() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 30);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   return (
//     <>
//       <style>{`.dd-nav-item:hover { background: #f5f2ed; }`}</style>
//       <nav style={{
//         position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
//         background: "rgba(250,248,244,0.96)", backdropFilter: "blur(12px)",
//         borderBottom: "1px solid #ece8e0", padding: "0 40px", height: 68,
//         display: "flex", alignItems: "center", gap: 40,
//         boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
//         transition: "box-shadow 0.3s", fontFamily: "'Nunito', sans-serif",
//       }}>
     
//         <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
//           <Dropdown label="Sign in" items={[
//             { href: "/login", title: "As volunteer", sub: "Find & join community needs" },
//             { href: "/ngo/login", title: "As NGO", sub: "Manage needs & volunteers" },
//           ]} />
//           <Dropdown label="Get started" solid items={[
//             { href: "/signup", title: "As volunteer", sub: "Browse causes near you" },
//             { href: "/ngo-signup", title: "Register your NGO", sub: "Post needs, find helpers" },
//           ]} />
//         </div>
//       </nav>
//     </>
//   );
// }