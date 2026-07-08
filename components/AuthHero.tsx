"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=1600&fit=crop&auto=format";

const QUOTE = {
  text: "Together we can uplift communities and change lives one act of support at a time.",
  author: "ngoSupport Mission",
};

export default function AuthHero() {
  return (
    <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
      <img
        src={HERO_IMAGE}
        alt="volunteers"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(20,55,35,0.85) 0%, rgba(45,106,79,0.62) 55%, rgba(212,137,10,0.32) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-12 py-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(212,137,10,0.92)" }}
          >
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>

          <span
            className="text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >   
          <Link href="/">
              ngoSupport
          </Link>
          </span>
        </div>

        <div className="flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="mb-6"
              style={{
                width: 48,
                height: 4,
                background: "#d4890a",
              }}
            />

            <h2
              className="text-white"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                lineHeight: 1.4,
              }}
            >
              "{QUOTE.text}"
            </h2>

            <p className="text-white/60 mt-3">
              — {QUOTE.author}
            </p>
          </motion.div>
        </div>

        <div className="flex gap-10">
          <div>
            <p className="text-white text-2xl font-bold">3,200+</p>
            <p className="text-white/60 text-sm">NGOs supported</p>
          </div>

          <div>
            <p className="text-white text-2xl font-bold">48</p>
            <p className="text-white/60 text-sm">Countries reached</p>
          </div>

          <div>
            <p className="text-white text-2xl font-bold">1.2M</p>
            <p className="text-white/60 text-sm">Lives impacted</p>
          </div>
        </div>
      </div>
    </div>
  );
}