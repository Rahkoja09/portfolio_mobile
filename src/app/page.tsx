"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion, useScroll, useInView, useTransform, AnimatePresence,
  useMotionValue, useSpring,
} from "framer-motion";
import {
  ArrowUpRight, Github, Linkedin, Mail, MapPin, Smartphone,
  Layers, Code2, Database, Figma, Send, ExternalLink, Shield,
  Gauge, Menu, X, Server, Wrench, PenTool,
} from "lucide-react";

/* ═══ DATA ═══ */

const NAV_LINKS = [
  { label: "Profil", href: "#profil" },
  { label: "Stack", href: "#stack" },
  { label: "Ouvrages", href: "#ouvrages" },
  { label: "Parcours", href: "#parcours" },
  { label: "Contact", href: "#contact" },
];

const SKILL_GROUPS = [
  { category: "Gestion d'état", icon: Layers, items: [
    { name: "Riverpod", level: 95 }, { name: "GetX", level: 90 }, { name: "Provider", level: 85 },
  ]},
  { category: "Framework & Langage", icon: Code2, items: [
    { name: "Flutter / Dart", level: 97 }, { name: "Dart (avancé)", level: 93 },
  ]},
  { category: "Backend & APIs", icon: Server, items: [
    { name: "Firebase", level: 92 }, { name: "Supabase", level: 88 }, { name: "REST API", level: 93 },
    { name: "GraphQL", level: 82 }, { name: "WebSocket", level: 85 },
  ]},
  { category: "Outils & DevOps", icon: Wrench, items: [
    { name: "Git / CI-CD", level: 90 }, { name: "Docker", level: 80 }, { name: "Figma", level: 87 },
  ]},
];

const PROJECTS = [
  { title: "MadaTrade", subtitle: "APP E-COMMERCE — MARKETPLACE LOCAL",
    description: "Marketplace de produits locaux malgaches avec paiement mobile intégré, géolocalisation des vendeurs, et système de notation. Architecture Riverpod + Clean Architecture, Firebase Auth, Stripe, notifications push temps réel.",
    tech: ["Flutter", "Riverpod", "Firebase", "Stripe", "Maps", "Push Notif"], link: "https://github.com/Rahkoja09" },
  { title: "HealthConnect", subtitle: "APP SANTÉ — TÉLÉMÉDECINE",
    description: "Application de télémédecine avec consultations vidéo, prise de RDV, suivi de traitements et dossiers patients sécurisés. Intégration WebRTC, Supabase backend, notifications intelligentes.",
    tech: ["Flutter", "GetX", "Supabase", "WebRTC", "Local Auth"], link: "https://github.com/Rahkoja09" },
  { title: "TaskFlow", subtitle: "APP PRODUCTIVITÉ — GESTION DE PROJETS",
    description: "Outil de gestion de projets collaboratif avec tableaux Kanban, diagrammes de Gantt, chat en temps réel via WebSocket. Synchronisation offline-first avec SQLite.",
    tech: ["Flutter", "Riverpod", "WebSocket", "SQLite", "GraphQL"], link: "https://github.com/Rahkoja09" },
  { title: "GeoTracker", subtitle: "APP UTILITAIRE — TRACKING GPS",
    description: "Application de tracking GPS en temps réel avec traçage de parcours, zones de géorepérage, historique détaillé et export de données. Optimisé pour la batterie.",
    tech: ["Flutter", "Dart", "Firebase", "SQLite", "Background Service"], link: "https://github.com/Rahkoja09" },
];

const EXPERIENCE = [
  { period: "2023 — Présent", role: "Développeur Flutter", company: "Freelance", location: "Antananarivo, MG",
    description: "Développement d'applications mobiles Flutter pour des clients internationaux et locaux. Gestion de projets de A à Z, de la conception UI/UX sur Figma jusqu'au déploiement sur les stores. Spécialisation en architectures propres et performantes.",
    tags: ["Flutter", "Riverpod", "Firebase", "Docker", "CI/CD"] },
  { period: "2022 — 2023", role: "Développeur Mobile Junior", company: "Startup", location: "Antananarivo, MG",
    description: "Premières expériences professionnelles en développement Flutter. Participation active à la création de plusieurs applications mobiles, montée en compétences rapide sur l'écosystème Dart.",
    tags: ["Flutter", "GetX", "REST API", "Git"] },
];

const EXTRA_SKILLS = [
  { icon: Code2, label: "Dart" }, { icon: PenTool, label: "UI/UX" },
  { icon: Database, label: "SQLite" }, { icon: Shield, label: "Sécurité" },
  { icon: Gauge, label: "Perf." }, { icon: Smartphone, label: "Mobile" },
];

const SOCIAL_LINKS = [
  { icon: Github, label: "GitHub", href: "https://github.com/Rahkoja09" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/f-koja-nekena-ramanamahefa-b67b4a247" },
  { icon: Mail, label: "Email", href: "mailto:kojanekenaramanamahefa@gmail.com" },
];

/* ═══ ANIMATIONS ═══ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};
const slideL = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const slideR = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══ COMPONENTS ═══ */

function SectionReveal({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-60px" });
  return <motion.section ref={ref} id={id} initial="hidden" animate={v ? "visible" : "hidden"} variants={stagger} className={className}>{children}</motion.section>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 md:mb-10 section-title">
      <motion.h2 variants={fadeUp} className="text-[1.75rem] md:text-[2.5rem] font-black tracking-[-0.03em] text-white leading-none">{title}</motion.h2>
      {subtitle && <motion.p variants={fadeUp} className="mono-body mt-3 max-w-lg">{subtitle}</motion.p>}
      <motion.div variants={fadeUp} className="mt-4 h-px w-16 md:w-24 bg-white/20" />
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        let c = 0;
        const step = target / 90;
        const t = setInterval(() => { c += step; if (c >= target) { setN(target); clearInterval(t); } else setN(Math.floor(c)); }, 1000 / 60);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className="counter-num font-mono text-2xl md:text-3xl font-black text-white">{n}{suffix}</span>;
}

function GaugeBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-20px" });
  return (
    <div ref={ref} className="space-y-2.5">
      <div className="flex justify-between items-baseline">
        <span className="font-mono text-[0.6875rem] tracking-wide text-white/80">{name}</span>
        <span className="font-mono text-[0.5625rem] tracking-[0.15em] text-white/55">{level}<span className="text-white/35 ml-0.5">%</span></span>
      </div>
      <div className="gauge-track">
        <motion.div className="gauge-fill" initial={{ width: 0 }} animate={v ? { width: `${level}%` } : { width: 0 }} transition={{ duration: 1.4, delay: delay * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }} />
      </div>
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return <span className="font-mono text-[0.5625rem] tracking-[0.08em] text-white/65 border border-white/[0.18] px-2 py-0.5 uppercase">{children}</span>;
}

function MagBtn({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 }), sy = useSpring(my, { stiffness: 200, damping: 20 });
  return (
    <motion.button ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={(e) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; mx.set((e.clientX - r.left - r.width / 2) * 0.15); my.set((e.clientY - r.top - r.height / 2) * 0.15); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      onClick={onClick} className={className}>{children}</motion.button>
  );
}

function Parallax({ children, speed = 0.3 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -100]);
  return <div ref={ref}><motion.div style={{ y }}>{children}</motion.div></div>;
}

/* ═══ PHONES ═══ */

function Phone({ children, size = "sm", label }: { children: React.ReactNode; size?: "xs" | "sm" | "md"; label?: string }) {
  const s = { xs: "w-[90px] h-[180px]", sm: "w-[110px] h-[220px] md:w-[140px] md:h-[280px]", md: "w-[130px] h-[260px] md:w-[170px] md:h-[340px]" };
  return (
    <div className={`${s[size]} shrink-0 relative float-phone`}>
      <div className="phone-wireframe w-full h-full relative flex flex-col overflow-hidden">
        <div className="phone-wireframe-inner w-full h-full relative flex flex-col overflow-hidden">
          <div className="flex justify-between items-center px-1.5 pt-1.5 pb-1 shrink-0">
            <div className="w-3 h-px bg-white/15" /><div className="w-1 h-1 border border-white/35 rounded-full" />
            <div className="flex gap-px items-center"><div className="w-0.5 h-0.5 bg-white/15" /><div className="w-0.5 h-0.5 bg-white/15" /><div className="w-1 h-px bg-white/15" /></div>
          </div>
          <div className="flex-1 px-1.5 pb-1 flex flex-col min-h-0">{children}</div>
          <div className="flex justify-around items-center px-1 py-1.5 border-t border-white/25 shrink-0">
            {[1, 2, 3, 4].map((n) => <div key={n} className={`w-1.5 h-1.5 ${n === 1 ? "bg-[#4ade80]/60 rounded-[1px]" : "border border-white/30"}`} />)}
          </div>
        </div>
        {label && <div className="absolute -bottom-5 left-0 right-0 flex items-center justify-center"><span className="spec-annotation">{label}</span></div>}
      </div>
    </div>
  );
}

function ScreenProfile() {
  return (
    <Phone size="md" label="PROFIL">
      <div className="flex flex-col items-center pt-3 pb-3"><div className="w-8 h-8 border border-white/30 rounded-full mb-2 relative"><div className="absolute -bottom-px -right-px w-2 h-2 rounded-full bg-[#4ade80]/80 border border-black" /></div><div className="h-1 w-10 border-b border-white/35 mb-0.5" /><div className="h-px w-6 bg-white/18" /></div>
      <div className="flex-1 space-y-0">
        {[{ label: "Compte", toggle: true, on: true }, { label: "Notif.", toggle: true, on: false }, { label: "Sécurité", toggle: false, checked: true }, { label: "Langue", toggle: false }, { label: "Thème", toggle: false }, { label: "Aide", toggle: false }].map((row, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/18">
            <div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-[1px] ${i === 2 ? "bg-[#60a5fa]/60" : "border border-white/30"}`} /><div className="h-px w-8 bg-white/20" /></div>
            {row.toggle ? (
              <div className={`w-3 h-1.5 rounded-full ${row.on ? "bg-[#4ade80]/40 border border-[#4ade80]/50" : "border border-white/30"} relative`}><div className={`absolute top-0.5 w-1 h-0.5 rounded-full ${row.on ? "right-0.5 bg-[#4ade80]/90" : "left-0.5 bg-white/30"}`} /></div>
            ) : row.checked ? (
              <div className="w-1.5 h-1.5 rounded-[1px] bg-[#4ade80]/70 border border-[#4ade80]/40" />
            ) : (
              <div className="w-1.5 h-1.5 border border-white/15 rotate-45" />
            )}
          </div>
        ))}
      </div>
    </Phone>
  );
}

function ScreenMenu() {
  const items = [
    { icon: true, active: true, color: "" },
    { icon: true, active: false, color: "" },
    { icon: true, active: false, badge: true, color: "" },
    { icon: true, active: false, color: "" },
    { icon: true, active: false, color: "" },
  ];
  return (
    <Phone size="sm" label="MENU">
      <div className="flex justify-between items-center pb-2 mb-1 border-b border-white/25"><div className="w-6 h-1 bg-white/20" /><div className="w-2 h-2 border border-white/30 rotate-45" /></div>
      <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-white/18">
        <div className="w-4 h-4 border border-white/30 rounded-full relative"><div className="absolute -top-px -right-px w-1.5 h-1.5 rounded-full bg-[#4ade80]/70 border border-black" /></div>
        <div className="space-y-0.5"><div className="h-1 w-8 bg-white/20" /><div className="h-px w-5 bg-white/12" /></div>
      </div>
      <div className="flex-1 space-y-0">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center gap-1.5 py-1.5 ${item.active ? "border-l-2 border-[#4ade80]/60 bg-[#4ade80]/[0.06]" : ""}`}>
            <div className={`w-2.5 h-2.5 rounded-[1px] ${item.active ? "bg-[#4ade80]/50" : "border border-white/15"} relative`}>
              {item.badge && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#f87171]/70 border border-black" />}
            </div>
            <div className={`h-px flex-1 ${item.active ? "bg-white/30" : "bg-white/18"}`} />
          </div>
        ))}
      </div>
    </Phone>
  );
}

function ScreenIcons() {
  const icons = [
    { bg: "bg-[#4ade80]/20", border: "border-[#4ade80]/35", shape: "rounded-lg" },
    { bg: "bg-[#60a5fa]/20", border: "border-[#60a5fa]/35", shape: "rounded-sm" },
    { bg: "bg-[#fbbf24]/20", border: "border-[#fbbf24]/35", shape: "rounded-full" },
    { bg: "bg-[#f87171]/15", border: "border-[#f87171]/30", shape: "rounded-lg" },
    { bg: "", border: "border-white/25", shape: "rounded-lg" },
    { bg: "", border: "border-white/25", shape: "rounded-sm" },
    { bg: "bg-[#4ade80]/15", border: "border-[#4ade80]/25", shape: "" },
    { bg: "", border: "border-white/25", shape: "rounded-full" },
    { bg: "bg-[#60a5fa]/15", border: "border-[#60a5fa]/25", shape: "rounded-lg" },
    { bg: "", border: "border-white/25", shape: "" },
    { bg: "bg-[#fbbf24]/15", border: "border-[#fbbf24]/25", shape: "rounded-sm" },
    { bg: "", border: "border-white/25", shape: "rounded-lg" },
    { bg: "", border: "border-white/25", shape: "rounded-full" },
    { bg: "bg-[#4ade80]/15", border: "border-[#4ade80]/25", shape: "" },
    { bg: "", border: "border-white/25", shape: "rounded-sm" },
    { bg: "bg-[#60a5fa]/15", border: "border-[#60a5fa]/25", shape: "rounded-lg" },
  ];
  return (
    <Phone size="sm" label="ICONS">
      <div className="mb-2"><div className="h-1 w-8 bg-white/20 mb-0.5" /><div className="h-px w-12 bg-white/12" /></div>
      <div className="grid grid-cols-4 gap-1.5 flex-1 content-start">
        {icons.map((ic, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 border ${ic.border} ${ic.shape} ${ic.bg} relative`}>
              {i === 2 && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#f87171]/70 border border-black" />}
              {i % 3 === 0 && <div className="h-px w-2 bg-white/25 m-[3px_0]" />}
              {i % 3 === 1 && <div className="w-px h-2 bg-white/25 mx-[3px]" />}
              {i % 3 === 2 && <div className="w-1.5 h-1.5 border border-white/15 m-[2px_auto]" />}
            </div>
            <div className="h-px w-2 bg-white/18" />
          </div>
        ))}
      </div>
    </Phone>
  );
}

function ScreenHome() {
  const stats = [
    { v: 85, color: "text-[#4ade80]/80", border: "border-l-[#4ade80]/40" },
    { v: 42, color: "text-[#60a5fa]/80", border: "border-l-[#60a5fa]/40" },
    { v: 67, color: "text-[#fbbf24]/80", border: "border-l-[#fbbf24]/40" },
    { v: 93, color: "text-white/80", border: "border-l-white/20" },
  ];
  const bars = [
    { h: 40, c: "bg-[#4ade80]/25" }, { h: 65, c: "bg-[#4ade80]/35" }, { h: 35, c: "bg-[#4ade80]/20" },
    { h: 80, c: "bg-[#4ade80]/40" }, { h: 55, c: "bg-[#4ade80]/30" }, { h: 70, c: "bg-[#4ade80]/35" },
    { h: 45, c: "bg-[#60a5fa]/25" }, { h: 90, c: "bg-[#4ade80]/50" }, { h: 60, c: "bg-[#60a5fa]/30" },
    { h: 75, c: "bg-[#4ade80]/40" }, { h: 50, c: "bg-[#60a5fa]/25" }, { h: 85, c: "bg-[#4ade80]/45" },
  ];
  return (
    <Phone size="md" label="HOME">
      <div className="mb-2"><div className="h-3 border border-white/25 flex items-center px-1.5"><div className="w-1.5 h-1.5 border border-white/15 rounded-full" /></div></div>
      <div className="grid grid-cols-2 gap-1 mb-2">
        {stats.map((s, i) => (<div key={i} className={`border border-white/20 border-l-2 ${s.border} p-1`}><div className="h-px w-3 bg-white/20 mb-1" /><div className={`text-[5px] font-mono ${s.color}`}>{s.v}</div></div>))}
      </div>
      <div className="border border-white/20 p-1 mb-2 flex-1">
        <div className="h-px w-4 bg-white/20 mb-1" />
        <div className="h-full flex items-end gap-px">
          {bars.map((b, i) => (<div key={i} className={`flex-1 ${b.c}`} style={{ height: `${b.h}%` }} />))}
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 py-1 border-t border-white/[0.08]">
          <div className="w-4 h-4 border border-white/25 rounded-[2px] bg-[#4ade80]/15 border-[#4ade80]/30" /><div className="flex-1 space-y-0.5"><div className="h-px w-3/4 bg-white/25" /><div className="h-px w-1/2 bg-white/12" /></div>
        </div>
        <div className="flex items-center gap-1.5 py-1 border-t border-white/[0.08]">
          <div className="w-4 h-4 border border-white/25" /><div className="flex-1 space-y-0.5"><div className="h-px w-3/4 bg-white/25" /><div className="h-px w-1/2 bg-white/12" /></div>
        </div>
      </div>
    </Phone>
  );
}

function ScreenFeed() {
  const tabs = [
    { active: true, color: "border-[#4ade80]/60" },
    { active: false, color: "" },
    { active: false, color: "" },
  ];
  const cards = [
    { liked: true, online: true },
    { liked: false, online: false },
    { liked: true, online: true },
    { liked: false, online: false },
  ];
  return (
    <Phone size="sm" label="FEED">
      <div className="flex gap-0 mb-2 border-b border-white/25">
        {tabs.map((t, i) => (
          <div key={i} className={`flex-1 text-center py-1 ${t.active ? `border-b-2 ${t.color}` : ""}`}>
            <div className={`h-px w-4 mx-auto ${t.active ? "bg-[#4ade80]/60" : "bg-white/15"}`} />
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        {cards.map((card, item) => (
          <div key={item} className="border border-white/20 p-1.5">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 border border-white/30 rounded-full relative">
                {card.online && <div className="absolute -bottom-px -right-px w-1 h-1 rounded-full bg-[#4ade80]/80 border border-black" />}
              </div>
              <div className="h-px w-6 bg-white/20" />
            </div>
            <div className="space-y-0.5 mb-1.5"><div className="h-px w-full bg-white/18" /><div className="h-px w-4/5 bg-white/12" /></div>
            <div className="flex gap-3">
              <div className="flex items-center gap-0.5"><div className={`w-1.5 h-1.5 rounded-[1px] ${card.liked ? "bg-[#f87171]/50" : "border border-white/15"}`} /><div className="h-px bg-white/18" style={{ width: "8px" }} /></div>
              <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 border border-white/15" /><div className="h-px bg-white/18" style={{ width: "6px" }} /></div>
              <div className="flex items-center gap-0.5"><div className="w-1.5 h-1.5 border border-white/15" /><div className="h-px bg-white/18" style={{ width: "10px" }} /></div>
            </div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function ScreenChat() {
  return (
    <Phone size="sm" label="CHAT">
      <div className="flex items-center gap-1.5 pb-2 mb-1 border-b border-white/25">
        <div className="w-1.5 h-1.5 border border-white/30 rotate-45" />
        <div className="w-3 h-3 border border-white/30 rounded-full relative"><div className="absolute -bottom-px -right-px w-1.5 h-1.5 rounded-full bg-[#4ade80]/70 border border-black" /></div>
        <div className="flex-1"><div className="h-px w-6 bg-white/20" /></div>
        <div className="w-2 h-2 border border-white/15" />
      </div>
      <div className="flex-1 space-y-1.5 flex flex-col justify-end">
        <div className="self-start max-w-[75%]"><div className="border border-white/25 rounded-tl-none rounded-tr rounded-b rounded-bl p-1.5"><div className="h-px w-full bg-white/18 mb-0.5" /><div className="h-px w-3/4 bg-white/12" /></div></div>
        <div className="self-end max-w-[75%]"><div className="bg-[#4ade80]/15 border border-[#4ade80]/20 rounded-tr-none rounded-tl rounded-b rounded-bl p-1.5"><div className="h-px w-full bg-[#4ade80]/30" /></div></div>
        <div className="self-start max-w-[75%]"><div className="border border-white/25 rounded-tl-none rounded-tr rounded-b rounded-bl p-1.5"><div className="h-px w-5/6 bg-white/18" /></div></div>
        <div className="self-end max-w-[75%]"><div className="bg-[#4ade80]/15 border border-[#4ade80]/20 rounded-tr-none rounded-tl rounded-b rounded-bl p-1.5"><div className="h-px w-full bg-[#4ade80]/30" /></div></div>
      </div>
      <div className="flex items-center gap-1.5 pt-2 border-t border-white/25 mt-1">
        <div className="flex-1 h-3 border border-white/12" />
        <div className="w-3 h-3 rounded-[2px] bg-[#4ade80]/40 border border-[#4ade80]/50" />
      </div>
    </Phone>
  );
}

function ScreenSplash() {
  return (
    <Phone size="xs" label="SPLASH">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border border-[#4ade80]/30 mb-3 relative"><div className="absolute inset-1 border border-[#4ade80]/25" /><div className="absolute top-1/2 left-0 right-0 h-px bg-[#4ade80]/30" /><div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#4ade80]/30" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#4ade80]/50" /></div>
        <div className="space-y-1 mb-4"><div className="h-1.5 w-10 bg-white/20" /><div className="h-px w-6 bg-white/15 mx-auto" /></div>
        <div className="w-6 h-px bg-white/10 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-[#4ade80]/40 rounded-full" /></div>
      </div>
    </Phone>
  );
}

/* ═══ SCROLL TOP BTN ═══ */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 600); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <AnimatePresence>
      {show && <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-5 right-5 z-50 w-10 h-10 border border-white/15 bg-black/80 flex items-center justify-center hover:border-white/30 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 12V2M2 6l5-4 5 4" /></svg></motion.button>}
    </AnimatePresence>
  );
}

/* ═══ MAIN ═══ */

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mob, setMob] = useState(true);
  const [navOp, setNavOp] = useState(0);
  const [active, setActive] = useState("");
  const [formSt, setFormSt] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => { const f = () => setNavOp(window.scrollY > 60 ? 1 : window.scrollY / 60); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { const c = () => setMob(window.innerWidth < 768); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const obs = new IntersectionObserver((e) => e.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }), { rootMargin: "-40% 0px -60% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const go = (href: string) => { document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const submit = (e: React.FormEvent) => { e.preventDefault(); setFormSt("sending"); setTimeout(() => setFormSt("sent"), 1500); setTimeout(() => setFormSt("idle"), 4000); };

  const W = (cls: string) => ({ maxWidth: "var(--mb-maxw)", margin: "0 auto", padding: "0 var(--mb-margin-mob)" });

  return (
    <div className="min-h-screen flex flex-col bg-black text-white blueprint-grid noise-overlay">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-black/90 transition-opacity duration-300" style={{ ...W(""), opacity: navOp }}>
        <div className="flex items-center justify-between h-12 md:h-14">
          <motion.span className="font-mono text-sm text-white font-bold cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>KN</motion.span>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <motion.button key={l.href} onClick={() => go(l.href)} className={`font-mono text-[0.5625rem] tracking-[0.18em] uppercase transition-colors relative ${active === l.href.replace("#", "") ? "text-white" : "text-white/50 hover:text-white/80"}`} whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                {l.label}
                {active === l.href.replace("#", "") && <motion.div layoutId="navInd" className="absolute -bottom-1 left-0 right-0 h-px bg-white" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              </motion.button>
            ))}
          </div>
          <motion.a href="#contact" onClick={(e) => { e.preventDefault(); go("#contact"); }} className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 border border-white/15 hover:border-white/30 text-white/70 hover:text-white transition-all text-[0.5625rem] font-mono tracking-[0.15em] uppercase" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Contact <ArrowUpRight className="w-2.5 h-2.5" /></motion.a>
          <button className="md:hidden p-2 text-white/60" onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu className="w-4 h-4" /></button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/95 md:hidden">
            <div className="flex flex-col items-start justify-center h-full gap-6 px-8">
              {NAV_LINKS.map((l, i) => (
                <motion.button key={l.href} onClick={() => go(l.href)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 25 }} className={`text-2xl font-black tracking-tight transition-colors ${active === l.href.replace("#", "") ? "text-white" : "text-white/60"}`}>{l.label}</motion.button>
              ))}
              <button className="absolute top-4 right-4 p-2" onClick={() => setMenuOpen(false)}><X className="w-5 h-5 text-white/60" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">

        {/* ═══ HERO ═══ */}
        <section className="min-h-[85vh] md:min-h-screen flex items-center">
          <div className="w-full" style={W("")}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <div className="flex flex-col items-start">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 green-blink rounded-full relative" />
                    <span className="font-mono text-[0.5625rem] tracking-[0.2em] text-white/50 uppercase">Disponible pour missions</span>
                  </motion.div>
                  <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="text-[2.8rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8rem] font-black tracking-[-0.04em] leading-[0.85]"><span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.7)" }}>FLUTTER</span><br /><span className="text-white/70">DEVELOPER</span></motion.h1>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3 mt-5 mb-1">
                    <div className="h-px w-8 bg-white/20" />
                    <span className="text-[1.1rem] sm:text-[1.4rem] md:text-[1.7rem] font-black tracking-[-0.02em] text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.6)" }}>KOJA</span>
                    <span className="text-[1.1rem] sm:text-[1.4rem] md:text-[1.7rem] font-black tracking-[-0.02em] text-white/90">NEKENA</span>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center gap-2 mt-1 mb-4">
                    <MapPin className="w-2.5 h-2.5 text-white/50" />
                    <span className="font-mono text-[0.5625rem] tracking-[0.15em] text-white/50 uppercase">Antananarivo, Madagascar</span>
                  </motion.div>
                  <motion.p variants={fadeUp} className="mono-body max-w-lg pt-4">{"Je conçois et développe des applications mobiles Flutter performantes. Chaque pixel, chaque transition, chaque ligne de code est pensée pour l'expérience utilisateur."}</motion.p>
                  <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-6">
                    <MagBtn onClick={() => go("#contact")} className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 bg-white text-black hover:bg-white/90 transition-all duration-300 cursor-pointer"><span className="font-mono text-[0.5625rem] tracking-[0.2em] font-bold uppercase">Me contacter</span><ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></MagBtn>
                    <motion.a href="#ouvrages" onClick={(e) => { e.preventDefault(); go("#ouvrages"); }} className="group inline-flex items-center gap-2.5 px-5 py-2.5 border border-white/10 hover:border-white/25 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><span className="font-mono text-[0.5625rem] tracking-[0.2em] text-white/75 uppercase">Voir les ouvrages</span></motion.a>
                  </motion.div>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="hidden md:flex md:col-span-4 justify-center items-center"><Parallax speed={0.15}><ScreenProfile /></Parallax></motion.div>
            </div>
          </div>
        </section>

        <hr className="struct-divider" />

        {/* ═══ PROFIL ═══ */}
        <SectionReveal id="profil">
          <div className="py-12 md:py-24">
            <div className="w-full" style={W("")}>
              <div className="md:hidden flex justify-center mb-8"><motion.div variants={scaleIn}><ScreenProfile /></motion.div></div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-5">
                  <SectionTitle title="Profil" subtitle="Développeur mobile Flutter basé à Antananarivo, Madagascar." />
                  <motion.p variants={fadeUp} className="mono-body">{"Développeur Flutter passionné, je me spécialise dans la création d'applications mobiles haute performance. Mon approche combine une architecture logicielle rigoureuse — Riverpod, Clean Architecture — avec un sens aigu du détail."}</motion.p>
                  <motion.p variants={fadeUp} className="mono-body">{"Chaque projet repousse les limites de Flutter : animations fluides, gestion d'état optimisée, intégrations natives avancées. La différence entre une bonne et une excellente application se trouve dans les micro-détails."}</motion.p>
                  <motion.p variants={fadeUp} className="mono-body">Je travaille avec Firebase, Supabase, Docker et CI/CD pour livrer des applications robustes. De la conception Figma au déploiement sur les stores, je gère chaque étape.</motion.p>
                  <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    <div className="text-center md:text-left"><Counter target={10} suffix="+" /><div className="font-mono text-[0.5rem] tracking-[0.15em] text-white/40 uppercase mt-1">Projets</div></div>
                    <div className="text-center md:text-left"><Counter target={3} suffix="+" /><div className="font-mono text-[0.5rem] tracking-[0.15em] text-white/40 uppercase mt-1">Années</div></div>
                    <div className="text-center md:text-left"><Counter target={100} suffix="%" /><div className="font-mono text-[0.5rem] tracking-[0.15em] text-white/40 uppercase mt-1">Flutter</div></div>
                  </motion.div>
                </div>
                <motion.div variants={scaleIn} className="hidden md:flex md:col-span-4 justify-center items-start pt-8"><ScreenProfile /></motion.div>
              </div>
            </div>
          </div>
        </SectionReveal>
        <hr className="struct-divider" />

        {/* ═══ STACK ═══ */}
        <SectionReveal id="stack">
          <div className="py-12 md:py-24">
            <div className="w-full" style={W("")}>
              <div className="md:hidden flex justify-center gap-4 mb-8"><motion.div variants={scaleIn}><ScreenMenu /></motion.div><motion.div variants={scaleIn}><ScreenIcons /></motion.div></div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-6">
                  <SectionTitle title="Stack Technique" subtitle="Les technologies que je maîtrise pour des applications mobiles robustes." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {SKILL_GROUPS.map((g, gi) => {
                      const Icon = g.icon;
                      return (
                        <motion.div key={g.category} variants={fadeUp} custom={gi} className="frame-corner border border-white/15 p-4 md:p-5 relative group hover:border-white/20 transition-colors duration-500">
                          <div className="flex items-center gap-2.5 mb-5"><motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}><Icon className="w-3.5 h-3.5 text-white/70" /></motion.div><span className="font-mono text-[0.625rem] tracking-[0.18em] text-white/75 uppercase">{g.category}</span></div>
                          <div className="h-px bg-white/10 mb-5" />
                          <div className="space-y-4">{g.items.map((sk, si) => <GaugeBar key={sk.name} name={sk.name} level={sk.level} delay={gi * 5 + si} />)}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <motion.div variants={fadeUp}>
                    <div className="flex items-center gap-2 mb-4"><span className="tech-label">Compétences transversales</span><div className="flex-1 h-px bg-white/08" /></div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-px">
                      {EXTRA_SKILLS.map((item, i) => { const Icon = item.icon; return (
                        <motion.div key={item.label} variants={fadeUp} custom={i} whileHover={{ y: -2 }} className="group flex flex-col items-center justify-center gap-2 py-4 md:py-5 border border-white/10 hover:bg-white/[0.015] transition-all duration-300 cursor-default">
                          <Icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
                          <span className="font-mono text-[0.5rem] tracking-[0.15em] text-white/70 group-hover:text-white/85 uppercase">{item.label}</span>
                        </motion.div>
                      ); })}
                    </div>
                  </motion.div>
                </div>
                <motion.div variants={fadeUp} className="hidden md:flex md:col-span-4 flex-col gap-6 items-center pt-8"><ScreenMenu /><ScreenIcons /></motion.div>
              </div>
            </div>
          </div>
        </SectionReveal>
        <hr className="struct-divider" />

        {/* ═══ OUVRAGES ═══ */}
        <SectionReveal id="ouvrages">
          <div className="py-12 md:py-24">
            <div className="w-full" style={W("")}>
              <div className="md:hidden flex justify-center mb-8"><motion.div variants={scaleIn}><ScreenHome /></motion.div></div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8"><SectionTitle title="Ouvrages" subtitle="Projets mobiles réalisés avec Flutter, du concept au déploiement." /></div>
                <motion.div variants={scaleIn} className="hidden md:flex md:col-span-4 justify-center items-start pt-8"><ScreenHome /></motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-8">
                {PROJECTS.map((p, pi) => (
                  <motion.div key={p.title} variants={fadeUp} custom={pi} className="group relative border border-white/15 hover:border-white/25 transition-all duration-500" whileHover={{ y: -2 }}>
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div><h3 className="text-base md:text-lg font-black tracking-tight text-white group-hover:text-white/80 transition-colors">{p.title}</h3><p className="font-mono text-[0.5rem] tracking-[0.15em] text-white/70 uppercase mt-0.5">{p.subtitle}</p></div>
                        <motion.a href={p.link} target="_blank" rel="noopener noreferrer" className="shrink-0 w-8 h-8 border border-white/15 flex items-center justify-center hover:border-white/30 hover:bg-white/05 transition-all" whileHover={{ scale: 1.1, rotate: 45 }} whileTap={{ scale: 0.9 }}><ExternalLink className="w-3 h-3 text-white/50" /></motion.a>
                      </div>
                      <p className="mono-body mb-4 text-sm leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5">{p.tech.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                    </div>
                    <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/0 group-hover:border-white/15 transition-all duration-500 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/0 group-hover:border-white/15 transition-all duration-500 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
              <motion.div variants={fadeUp} className="mt-8 text-center md:text-left">
                <motion.a href="https://github.com/Rahkoja09" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/25 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><Github className="w-3.5 h-3.5 text-white/70" /><span className="font-mono text-[0.5625rem] tracking-[0.2em] text-white/75 uppercase">Voir tous les projets sur GitHub</span><ArrowUpRight className="w-3 h-3 text-white/50" /></motion.a>
              </motion.div>
            </div>
          </div>
        </SectionReveal>
        <hr className="struct-divider" />

        {/* ═══ PARCOURS ═══ */}
        <SectionReveal id="parcours">
          <div className="py-12 md:py-24">
            <div className="w-full" style={W("")}>
              <div className="md:hidden flex justify-center mb-8"><motion.div variants={scaleIn}><ScreenFeed /></motion.div></div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8"><SectionTitle title="Parcours" subtitle="Mon évolution dans le développement mobile Flutter." /></div>
                <motion.div variants={fadeUp} className="hidden md:flex md:col-span-4 justify-center items-start pt-8"><ScreenFeed /></motion.div>
              </div>
              <div className="mt-8 relative">
                <div className="absolute left-[3px] md:left-[5px] top-0 bottom-0 w-px bg-white/12" />
                <div className="space-y-10 md:space-y-14">
                  {EXPERIENCE.map((exp, i) => (
                    <motion.div key={exp.period} variants={i % 2 === 0 ? slideL : slideR} custom={i} className="relative pl-8 md:pl-14">
                      <div className="absolute left-0 top-2 -translate-x-1/2 md:left-1"><div className="w-[7px] h-[7px] border border-white/25 bg-black" /></div>
                      <div className="mb-2.5"><span className="tech-label">{exp.period}</span></div>
                      <div className="mb-3">
                        <h3 className="text-sm md:text-base font-black tracking-tight text-white">{exp.role}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1"><span className="font-mono text-[0.6875rem] text-white/75">{exp.company}</span><span className="flex items-center gap-1 font-mono text-[0.5rem] text-white/70"><MapPin className="w-2 h-2" /> {exp.location}</span></div>
                      </div>
                      <p className="mono-body mb-3.5 max-w-xl">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5">{exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
        <hr className="struct-divider" />

        {/* ═══ CONTACT ═══ */}
        <SectionReveal id="contact">
          <div className="py-12 md:py-24">
            <div className="w-full" style={W("")}>
              <div className="md:hidden flex justify-center gap-3 mb-8"><motion.div variants={scaleIn}><ScreenChat /></motion.div><motion.div variants={scaleIn}><ScreenSplash /></motion.div></div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4 space-y-5 order-2 md:order-1">
                  <motion.p variants={fadeUp} className="mono-body">Projet mobile ambitieux ? Application à construire de zéro ? Je suis ouvert à toute discussion technique.</motion.p>
                  <motion.p variants={fadeUp} className="mono-body">Réponse généralement sous 24h.</motion.p>
                  <motion.div variants={fadeUp} className="pt-3">
                    <div className="flex items-center gap-2 mb-3"><span className="tech-label">Réseaux</span><div className="flex-1 h-px bg-white/08" /></div>
                    <div className="space-y-2">
                      {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                        <motion.a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" variants={fadeUp} className="group flex items-center justify-between gap-2 py-3 px-3 border border-white/15 hover:border-white/25 hover:bg-white/[0.015] transition-all duration-300" whileHover={{ x: 4 }}>
                          <Icon className="w-3.5 h-3.5 text-white/70 group-hover:text-white/80 transition-colors" />
                          <span className="font-mono text-[0.5625rem] tracking-[0.15em] text-white/60 group-hover:text-white/75 uppercase">{label}</span>
                          <ArrowUpRight className="w-2.5 h-2.5 text-white/30 group-hover:text-white/60 transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>
                <motion.div variants={fadeUp} className="md:col-span-8 order-1 md:order-2">
                  <div className="frame-corner border border-white/15 p-5 md:p-6 relative">
                    <SectionTitle title="Contact" subtitle="Un projet mobile en tête ? Discutons-en." />
                    <form onSubmit={submit} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5"><label className="tech-label">Nom</label><input type="text" placeholder="Votre nom" className="w-full bg-transparent border border-white/20 focus:border-white/40 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 outline-none transition-colors font-mono" /></div>
                        <div className="space-y-1.5"><label className="tech-label">Email</label><input type="email" placeholder="votre@email.com" className="w-full bg-transparent border border-white/20 focus:border-white/40 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 outline-none transition-colors font-mono" /></div>
                      </div>
                      <div className="space-y-1.5"><label className="tech-label">Sujet</label><input type="text" placeholder="Sujet de votre message" className="w-full bg-transparent border border-white/20 focus:border-white/40 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 outline-none transition-colors font-mono" /></div>
                      <div className="space-y-1.5"><label className="tech-label">Message</label><textarea rows={5} placeholder="Décrivez votre projet..." className="w-full bg-transparent border border-white/20 focus:border-white/40 px-3 py-2.5 text-sm text-white/80 placeholder:text-white/30 outline-none transition-colors resize-none font-mono" /></div>
                      <div className="flex items-center justify-between pt-2">
                        <AnimatePresence mode="wait">
                          {formSt === "idle" && <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="spec-annotation">* Réponse sous 24h</motion.span>}
                          {formSt === "sending" && <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-[0.5625rem] text-white/50 tracking-wider">Envoi en cours...</motion.span>}
                          {formSt === "sent" && <motion.span key="d" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-mono text-[0.5625rem] text-white/80 tracking-wider">Message envoyé !</motion.span>}
                        </AnimatePresence>
                        <motion.button type="submit" disabled={formSt !== "idle"} className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><span className="font-mono text-[0.5625rem] tracking-[0.2em] font-bold uppercase">Envoyer</span><Send className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-auto border-t border-white/10">
        <div className="w-full py-8 md:py-10" style={W("")}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="w-6 h-6 border border-white/15 flex items-center justify-center"><span className="font-mono text-[0.5rem] font-bold text-white/80">KN</span></div><span className="font-mono text-sm font-bold text-white">Koja Nekena</span></div>
              <p className="mono-body text-sm max-w-xs">Développeur Flutter — Antananarivo, Madagascar</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <motion.a key={label} href={href} target={label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" className="font-mono text-[0.5625rem] tracking-[0.12em] text-white/50 hover:text-white/80 transition-colors uppercase flex items-center gap-1.5" whileHover={{ y: -1 }}><Icon className="w-3 h-3" />{label}</motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <ScrollTop />
    </div>
  );
}
