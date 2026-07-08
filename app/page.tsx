// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import HomeNav from "@/components/HomeNav";

const NEEDS = [
  {
    title: "Flood relief & rescue support",
    ngo: "Rahat Foundation · Ralamandal, Indore",
    urgency: "HIGH" as const,
    vol: 8,
    max: 20,
    img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&q=80",
  },
  {
    title: "After-school tutoring for 60 children",
    ngo: "Gyan Jyoti NGO · Shahpura, Bhopal",
    urgency: "MEDIUM" as const,
    vol: 14,
    max: 20,
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=500&q=80",
  },
  {
    title: "Weekly visits to elderly care home",
    ngo: "Vriddha Seva Trust · Vijay Nagar, Indore",
    urgency: "LOW" as const,
    vol: 18,
    max: 25,
    img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&q=80",
  },
];

const URGENCY = {
  HIGH: { label: "High urgency", bg: "bg-[#fde8e8]", text: "text-[#8b1c1c]", bar: "bg-[#c0392b]", dot: "bg-[#c0392b]" },
  MEDIUM: { label: "Medium urgency", bg: "bg-[#fff4e0]", text: "text-[#7a4800]", bar: "bg-[#d4890a]", dot: "bg-[#d4890a]" },
  LOW: { label: "Low urgency", bg: "bg-[#e6f4ec]", text: "text-[#1b5e38]", bar: "bg-[#2d6a4f]", dot: "bg-[#2d6a4f]" },
};

const STORIES = [
  {
    accent: "bg-[#e8f5ee]",
    textAccent: "text-[#1b5e38]",
    tag: "Education",
    title: "120 children received free coaching across 3 Indore slums",
    meta: "Gyan Jyoti NGO · 22 volunteers · 6 weeks",
  },
  {
    accent: "bg-[#fff4e0]",
    textAccent: "text-[#7a4800]",
    tag: "Shelter",
    title: "450 displaced families given emergency ration kits within 72 hours",
    meta: "Jan Seva Samiti · 38 volunteers · Rapid response",
  },
  {
    accent: "bg-[#fde8e8]",
    textAccent: "text-[#8b1c1c]",
    tag: "Healthcare",
    title: "Free health camp served 800 patients in a single day",
    meta: "Aarogya Trust · 41 volunteers · Indore camp",
  },
];

const STATS: [string, string][] = [
  ["48+", "Verified NGOs"],
  ["320+", "Active volunteers"],
  ["1,200+", "Lives impacted"],
  ["94%", "Tasks completed"],
];

const STEPS = [
  {
    n: "01",
    title: "Create your profile",
    desc: "Volunteers sign up with skills and availability. NGOs register with a certificate — verified by our team within 48 hours.",
    accent: "bg-[#e8f5ee]",
  },
  {
    n: "02",
    title: "Discover real needs",
    desc: "NGOs post verified community needs with photos, location and an urgency score based on people affected and time sensitivity.",
    accent: "bg-[#fff4e0]",
  },
  {
    n: "03",
    title: "Help & track impact",
    desc: "Apply, get NGO approval, complete your task and watch your personal impact grow — people helped, hours contributed, certificates earned.",
    accent: "bg-[#fde8e8]",
  },
];

const JOIN_CARDS = [
  {
    bg: "bg-[#e8f5ee]",
    border: "border-[#c8e6d8]",
    tagColor: "text-[#1b5e38]",
    title: "Give your time, change lives",
    desc: "Find verified NGO needs in your city, apply in seconds and build a verifiable track record of community impact.",
    perks: ["Free, no commitment required", "Matched by skill & location", "Earn a verifiable impact certificate"],
    perkColor: "text-[#1b5e38]",
    iconBg: "bg-[#c8e6d8]",
    ctaBg: "bg-[#2d6a4f] hover:bg-[#1b4332]",
    ctaLabel: "Sign up as volunteer",
    ctaHref: "/signup",
    secLabel: "Already have an account →",
    secHref: "/login",
    secColor: "text-[#2d6a4f]",
    tag: "For volunteers",
  },
  {
    bg: "bg-[#fff8ee]",
    border: "border-[#f0d8a8]",
    tagColor: "text-[#7a4800]",
    title: "Find the volunteers you actually need",
    desc: "Post needs with urgency levels, photos and volunteer requirements. Our smart matching finds verified, local volunteers fast.",
    perks: ["Admin-verified registration", "Smart urgency scoring system", "Accept or reject volunteer requests"],
    perkColor: "text-[#7a4800]",
    iconBg: "bg-[#f0d8a8]",
    ctaBg: "bg-[#d4890a] hover:bg-[#a06000]",
    ctaLabel: "Register your NGO",
    ctaHref: "/ngo-signup",
    secLabel: "Already registered →",
    secHref: "/ngo-login",
    secColor: "text-[#a06000]",
    tag: "For NGOs",
  },
];

const FOOTER_COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Platform",
    links: [
      ["How it works", "#how"],
      ["Browse needs", "#needs"],
      ["Impact stories", "#impact"],
      ["Join us", "#join"],
    ],
  },
  {
    title: "Volunteers",
    links: [
      ["Create account", "/signup"],
      ["Sign in", "/login"],
      ["My profile", "/profilePage"],
    ],
  },
  {
    title: "NGOs",
    links: [
      ["Register NGO", "/ngo-signup"],
      ["NGO sign in", "/ngo-login"],
      ["Dashboard", "/ngo/dashboard"],
    ],
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#faf8f4] font-['Nunito',sans-serif] text-[#1c2b1e]">
      <HomeNav />

      {/* ── Hero ── */}
      <section className="max-w-[1160px] mx-auto px-5 sm:px-10 pt-[100px] sm:pt-[120px] lg:pt-[108px] pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-center">
        <div>
          <div className="inline-flex items-center gap-[7px] bg-[#e8f5ee] text-[#1b5e38] text-xs font-bold px-[13px] py-[5px] rounded-full mb-5 tracking-wide">
            <span className="w-1.5 h-1.5 bg-[#2d6a4f] rounded-full inline-block" />
            Active across Indore &amp; MP
          </div>
          <h1 className="font-['Playfair_Display',serif] text-[2.2rem] sm:text-[2.6rem] lg:text-[3rem] leading-[1.15] text-[#1c2b1e] mb-5 font-bold">
            Where communities find the help they{" "}
            <em className="italic text-[#2d6a4f]">deserve</em>
          </h1>
          <p className="text-base sm:text-[1.05rem] text-[#4e6352] leading-[1.72] mb-8 max-w-[440px]">
            ngoSupport connects verified NGOs posting real, urgent community needs with passionate volunteers ready to act — from flood relief to children&apos;s education.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold bg-[#2d6a4f] text-white border-none cursor-pointer font-['Nunito',sans-serif] hover:bg-[#1b4332] transition-colors">
                Browse active needs
              </button>
            </Link>
            <Link href="/ngo-signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold bg-transparent text-[#2d6a4f] border-2 border-[#2d6a4f] cursor-pointer font-['Nunito',sans-serif] hover:bg-[#2d6a4f] hover:text-white transition-colors">
                Register your NGO
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-4 mt-8">
            <div className="flex shrink-0">
              {["AK", "RS", "MP", "+"].map((a, i) => (
                <div
                  key={i}
                  style={{ marginLeft: i === 0 ? 0 : -9 }}
                  className="w-8 h-8 rounded-full border-[2.5px] border-[#faf8f4] bg-[#c8e6d8] flex items-center justify-center text-[0.65rem] font-bold text-[#1b5e38]"
                >
                  {a}
                </div>
              ))}
            </div>
            <div className="text-[0.83rem] text-[#6b7e6d] leading-[1.4]">
              <strong className="text-[#1c2b1e]">320+ volunteers</strong> already making impact
              <br className="hidden sm:block" /> across Indore and nearby cities
            </div>
          </div>
        </div>

        <div className="relative mt-4 sm:mt-0 max-w-[420px] sm:max-w-none mx-auto sm:mx-0 w-full">
          <div className="rounded-3xl overflow-hidden aspect-[4/5] relative">
            <Image
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=85"
              alt="Volunteers at work"
              fill
              className="object-cover"
            />
          </div>

          {/* Float card top-left */}
          <div className="absolute -top-4 -left-3 sm:-top-[18px] sm:-left-6 bg-white rounded-2xl border border-[#ece8e0] px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.07)] min-w-[150px] sm:min-w-[180px]">
            <div className="text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-wide text-[#8a9e8c] mb-2">
              Matched volunteers
            </div>
            <div className="flex mb-1.5">
              {["S", "A", "R", "+9"].map((a, i) => (
                <div
                  key={i}
                  style={{ marginLeft: i === 0 ? 0 : -7 }}
                  className="w-6 h-6 rounded-full border-2 border-white bg-[#c8e6d8] flex items-center justify-center text-[0.6rem] font-bold text-[#1b5e38]"
                >
                  {a}
                </div>
              ))}
            </div>
            <div className="text-[0.8rem] sm:text-[0.83rem] font-bold text-[#1c2b1e]">12 volunteers joined</div>
            <div className="text-xs text-[#8a9e8c] mt-0.5">Flood relief · Ralamandal</div>
          </div>

          {/* Float card bottom-right */}
          <div className="absolute bottom-4 -right-3 sm:bottom-6 sm:-right-[22px] bg-white rounded-2xl border border-[#ece8e0] px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.07)] min-w-[160px] sm:min-w-[190px]">
            <div className="inline-flex items-center gap-[5px] bg-[#fff3e0] text-[#7a4800] text-[0.68rem] font-bold px-2.5 py-[3px] rounded-xl mb-[7px]">
              <span className="w-1.5 h-1.5 bg-[#e07b00] rounded-full inline-block" />
              High urgency
            </div>
            <div className="text-[0.8rem] sm:text-[0.83rem] font-bold text-[#1c2b1e]">Children&apos;s nutrition drive</div>
            <div className="text-xs text-[#8a9e8c] mt-0.5">Seeks 6 more volunteers · Indore</div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-[#1b4332] px-5 sm:px-10 py-8 sm:py-10">
        <div className="max-w-[1160px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-2">
          {STATS.map(([val, lbl], i) => (
            <div
              key={i}
              className={`text-center px-2 sm:px-5 ${i < 3 ? "sm:border-r sm:border-white/[0.12]" : ""}`}
            >
              <div className="font-['Playfair_Display',serif] text-[1.9rem] sm:text-[2.5rem] font-bold text-white mb-1">
                {val}
              </div>
              <div className="text-[0.78rem] sm:text-[0.83rem] text-white/60 font-medium">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div id="how" className="bg-white px-5 sm:px-10 py-16 sm:py-20">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-2.5">
            How it works
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.6rem] sm:text-[2rem] font-bold text-[#1c2b1e] mb-9 sm:mb-12 max-w-[560px]">
            From sign-up to real impact in three simple steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-7">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-[#faf8f4] border border-[#ece8e0] rounded-2xl p-6 sm:p-7">
                <div className="font-['Playfair_Display',serif] text-[2.2rem] sm:text-[2.6rem] font-bold text-[#dde8de] leading-none mb-3">
                  {s.n}
                </div>
                <div className={`w-[42px] h-[42px] rounded-[11px] ${s.accent} mb-3.5`} />
                <div className="text-[0.95rem] font-bold text-[#1c2b1e] mb-1.5">{s.title}</div>
                <div className="text-[0.85rem] text-[#6b7e6d] leading-[1.65]">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active needs ── */}
      <div id="needs" className="bg-[#faf8f4] px-5 sm:px-10 py-16 sm:py-20">
        <div className="max-w-[1160px] mx-auto">
          <div className="flex justify-between items-end mb-7 sm:mb-9 flex-wrap gap-4">
            <div>
              <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-2">
                Live on the platform
              </div>
              <h2 className="font-['Playfair_Display',serif] text-[1.6rem] sm:text-[2rem] font-bold text-[#1c2b1e]">
                Active community needs
              </h2>
            </div>
            <Link href="/login" className="text-sm font-bold text-[#2d6a4f] no-underline hover:underline">
              View all needs →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-[18px]">
            {NEEDS.map((n) => {
              const u = URGENCY[n.urgency];
              const pct = Math.round((n.vol / n.max) * 100);
              return (
                <Link href="/login" key={n.title} className="no-underline">
                  <div className="bg-white border border-[#ece8e0] rounded-2xl overflow-hidden cursor-pointer h-full hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-shadow">
                    <div className="h-[158px] overflow-hidden relative">
                      <Image src={n.img} alt={n.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <div className={`inline-flex items-center gap-[5px] text-[0.68rem] font-bold px-2.5 py-1 rounded-xl mb-2.5 ${u.bg} ${u.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${u.dot}`} />
                        {u.label}
                      </div>
                      <div className="text-[0.9rem] font-bold text-[#1c2b1e] mb-1.5 leading-[1.35]">{n.title}</div>
                      <div className="text-xs text-[#8a9e8c] mb-3">{n.ngo}</div>
                      <div className="flex justify-between text-[0.72rem] text-[#8a9e8c] mb-1.5">
                        <span>
                          {n.vol} / {n.max} volunteers
                        </span>
                        <span>{n.max - n.vol} spots left</span>
                      </div>
                      <div className="h-1 bg-[#eae6e0] rounded-full">
                        <div className={`h-full rounded-full ${u.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Impact ── */}
      <div id="impact" className="bg-white px-5 sm:px-10 py-16 sm:py-20">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-2.5">
            Real impact
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.6rem] sm:text-[2rem] font-bold text-[#1c2b1e] mb-9 sm:mb-11">
            Stories from the ground
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="rounded-[20px] overflow-hidden aspect-[16/10] relative">
                <Image
                  src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700&q=80"
                  alt="Community impact"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 bg-[#faf8f4] rounded-r-2xl p-6 sm:p-7 border-l-4 border-[#2d6a4f]">
                <p className="font-['Playfair_Display',serif] text-[0.98rem] sm:text-[1.05rem] text-[#1c2b1e] leading-[1.6] mb-3.5 italic">
                  &quot;We posted a need on Monday morning. By Wednesday, all 15 volunteer slots were filled — every single one showed up.&quot;
                </p>
                <p className="text-[0.8rem] text-[#8a9e8c]">
                  — Priya Sharma, Coordinator · Rahat Foundation, Indore
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {STORIES.map((s) => (
                <div
                  key={s.title}
                  className="bg-[#faf8f4] border border-[#ece8e0] rounded-xl px-[18px] py-4 flex gap-3 items-start"
                >
                  <div className={`w-[38px] h-[38px] rounded-[9px] shrink-0 ${s.accent}`} />
                  <div>
                    <div className={`text-[0.68rem] font-bold uppercase tracking-wide mb-[3px] ${s.textAccent}`}>
                      {s.tag}
                    </div>
                    <div className="text-[0.875rem] font-bold text-[#1c2b1e] mb-[3px] leading-[1.35]">
                      {s.title}
                    </div>
                    <div className="text-xs text-[#8a9e8c]">{s.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Join ── */}
      <div id="join" className="bg-[#faf8f4] px-5 sm:px-10 py-16 sm:py-20">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-xs font-bold tracking-[0.1em] text-[#d4890a] uppercase mb-2.5">
            Get started
          </div>
          <h2 className="font-['Playfair_Display',serif] text-[1.6rem] sm:text-[2rem] font-bold text-[#1c2b1e] mb-2">
            Ready to make a real difference?
          </h2>
          <p className="text-[0.95rem] text-[#6b7e6d] leading-[1.7] max-w-[480px] mx-auto mb-10 sm:mb-11">
            Choose your role and join thousands of people building stronger communities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {JOIN_CARDS.map((c) => (
              <div key={c.tag} className={`rounded-[22px] p-7 sm:p-9 ${c.bg} border ${c.border}`}>
                <div className={`w-12 h-12 rounded-[13px] ${c.iconBg} mb-4.5`} />
                <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${c.tagColor}`}>{c.tag}</div>
                <h3 className="font-['Playfair_Display',serif] text-[1.25rem] sm:text-[1.4rem] font-bold text-[#1c2b1e] mb-2.5">
                  {c.title}
                </h3>
                <p className={`text-[0.875rem] leading-[1.65] mb-5 ${c.perkColor}`}>{c.desc}</p>
                <div className="mb-5">
                  {c.perks.map((p) => (
                    <div key={p} className={`flex items-center gap-2 text-[0.83rem] mb-1.5 ${c.perkColor}`}>
                      <span className="font-bold">✓</span> {p}
                    </div>
                  ))}
                </div>
                <Link href={c.ctaHref} className="block sm:inline-block w-full sm:w-auto">
                  <button
                    className={`w-full sm:w-auto px-6 py-3 rounded-[11px] text-[0.9rem] font-bold text-white border-none cursor-pointer font-['Nunito',sans-serif] transition-colors ${c.ctaBg}`}
                  >
                    {c.ctaLabel}
                  </button>
                </Link>
                <Link
                  href={c.secHref}
                  className={`block mt-3 text-[0.83rem] font-semibold no-underline hover:underline ${c.secColor}`}
                >
                  {c.secLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#1a2c1e] px-5 sm:px-10 pt-12 sm:pt-[52px] pb-7">
        <div className="max-w-[1160px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 sm:gap-10 mb-10">
            <div>
              <div className="font-['Playfair_Display',serif] text-[1.1rem] font-bold text-white mb-2.5">
                ngoSupport
              </div>
              <p className="text-[0.82rem] text-white/45 leading-[1.65] max-w-[320px]">
                Connecting passionate volunteers with verified NGOs working on real community needs across India. Built in Indore, scaling everywhere.
              </p>
            </div>
            {FOOTER_COLS.map(({ title, links }) => (
              <div key={title}>
                <div className="text-xs font-bold uppercase tracking-wide text-white/35 mb-3.5">
                  {title}
                </div>
                {links.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="block text-[0.85rem] text-white/55 mb-2 no-underline hover:text-white/80 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.08] pt-5 flex flex-col sm:flex-row justify-between gap-2 text-[0.78rem] text-white/35">
            <span>© 2025 ngoSupport — built with care for community</span>
            <span>NIT Bhopal · Seva Connect Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}