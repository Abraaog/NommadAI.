'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGamification } from '@/lib/gamification/store'
import type { LucideIcon } from 'lucide-react'
import {
  Home, Brain, Briefcase, Zap, Calendar, Palette, Kanban,
  Network, Headphones, Rocket, BarChart2, BookOpen, Settings, Swords, X, Menu,
  Layers, CheckCircle2
} from 'lucide-react'

type NavItem = { label: string; href: string; icon: LucideIcon; badge?: string }

const NAV_CORE: NavItem[] = [
  { label: 'Check-in',      href: '/dashboard/checkin',     icon: CheckCircle2 },
  { label: 'Estratégia',    href: '/dashboard/estrategia',  icon: Home },
  { label: 'Minha Marca',   href: '/dashboard/minha-marca', icon: Brain },
  { label: 'Meu Negócio',   href: '/dashboard/meu-negocio', icon: Briefcase },
  { label: 'Gerador',       href: '/dashboard/gerador',     icon: Zap },
  { label: 'Calendário',    href: '/dashboard/calendario',  icon: Calendar },
  { label: 'Design',        href: '/dashboard/design',      icon: Palette },
  { label: 'Kanban',        href: '/dashboard/kanban',      icon: Kanban },
  { label: 'Cérebro',       href: '/dashboard/cerebro',     icon: Network },
  { label: 'Analytics',     href: '/dashboard/analytics',   icon: BarChart2 },
]

const NAV_PREMIUM: NavItem[] = [
  { label: 'Chefões',       href: '/dashboard/chefoes',     icon: Swords,     badge: '★' },
  { label: 'Sound Design',  href: '/dashboard/sound-design', icon: Headphones, badge: '★' },
  { label: 'Release System',href: '/dashboard/release-system', icon: Rocket,     badge: '★' },
  { label: 'Classificador AI', href: '/dashboard/classificador', icon: Layers,  badge: '★' },
]

const NAV_SYSTEM: NavItem[] = [
  { label: 'Guia de Uso',   href: '/dashboard/guia',        icon: BookOpen },
  { label: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
]

const ALL_NAV = [...NAV_CORE, ...NAV_PREMIUM, ...NAV_SYSTEM]

function NavBox({ items, path, label, onClose }: { items: NavItem[]; path: string; label?: string; onClose?: () => void }) {
  return (
    <div className="glass-card rounded-2xl p-2 flex flex-col gap-0.5">
      {label && (
        <p className="text-[9px] text-yellow-500/60 uppercase tracking-[0.2em] font-bold px-3 pt-2 pb-1">
          {label}
        </p>
      )}
      {items.map(({ label: itemLabel, href, icon: Icon, badge }) => {
        const active = path === href || (href !== '/' && path.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300
              ${active
                ? 'text-yellow-500 bg-yellow-500/10 shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]'
                : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.03]'
              }`}
          >
            <Icon size={18} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-yellow-500' : ''}`} />
            <span className={`truncate font-medium ${active ? 'font-bold' : ''}`}>{itemLabel}</span>
            {badge && (
              <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500/20 text-[10px] text-yellow-500 font-bold border border-yellow-500/30">
                {badge}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}

// ── Mobile Bottom Tab Bar ──────────────────────────────────────────────────────
// Shows only 5 primary tabs on mobile
const MOBILE_TABS: NavItem[] = [
  { label: 'Início',    href: '/dashboard/estrategia', icon: Home },
  { label: 'Gerador',  href: '/dashboard/gerador',     icon: Zap },
  { label: 'Kanban',   href: '/dashboard/kanban',      icon: Kanban },
  { label: 'Chefões',  href: '/dashboard/chefoes',     icon: Swords },
  { label: 'Menu',     href: '#',            icon: Menu },   // opens drawer
]

export function Sidebar() {
  const path = usePathname()
  const { stats, hydrated } = useGamification()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* ── DESKTOP sidebar (unchanged) ─────────────────────────────────── */}
      <aside className="hidden lg:flex fixed top-4 left-4 bottom-4 w-[var(--sidebar-width)] flex-col gap-3 z-50 overflow-y-auto no-scrollbar">
        {/* Brand */}
        <div className="glass-card rounded-2xl px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center glow-amber shrink-0">
            <span className="text-neutral-950 font-black text-xl">N</span>
          </div>
          <div>
            <span className="text-lg font-black tracking-tighter text-white">NOMMAD</span>
            <span className="block text-[9px] text-yellow-500/80 tracking-[0.2em] uppercase font-bold">Artist OS</span>
          </div>
        </div>

        <NavBox items={NAV_CORE}    path={path} />
        <NavBox items={NAV_PREMIUM} path={path} label="Premium" />
        <NavBox items={NAV_SYSTEM}  path={path} />

        <Link
          href="/config"
          className="glass-card rounded-2xl p-3 mt-auto flex items-center gap-3 hover:bg-white/[0.06] transition-all duration-200 press-scale group"
        >
          <div className="w-7 h-7 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center transition-colors shrink-0">
            <Settings size={13} className="text-neutral-400 group-hover:text-yellow-500 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white font-bold truncate">Configurações</p>
            <p className="text-[9px] text-neutral-600 truncate">v2.4.0-stable</p>
          </div>
        </Link>
      </aside>

      {/* ── MOBILE top mini-header ──────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 glass-topbar border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center glow-amber shrink-0">
            <span className="text-neutral-950 font-black text-base leading-none">N</span>
          </div>
          <div>
            <span className="text-sm font-black tracking-tighter text-white">NOMMAD</span>
            <span className="block text-[8px] text-yellow-500/70 tracking-[0.15em] uppercase font-bold leading-none">Artist OS</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hydrated && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter">LVL</span>
              <span className="text-xs font-black text-white leading-none">{stats.level}</span>
            </div>
          )}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center"
            aria-label="Abrir menu"
          >
            <Menu size={18} className="text-neutral-300" />
          </button>
        </div>
      </div>

      {/* ── MOBILE bottom tab bar ────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-topbar border-t border-white/[0.06] flex items-center h-16 px-2 safe-area-pb">
        {MOBILE_TABS.map(({ label, href, icon: Icon }) => {
          if (href === '#') {
            return (
              <button
                key="menu"
                onClick={() => setDrawerOpen(true)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-neutral-500 hover:text-yellow-500 transition-colors"
              >
                <Menu size={20} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Menu</span>
              </button>
            )
          }
          const active = path === href || path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${active ? 'text-yellow-500' : 'text-neutral-500 hover:text-neutral-200'}`}
            >
              <Icon size={20} className={active ? 'glow-amber' : ''} />
              <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── MOBILE full drawer ───────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#050507] border-l border-white/[0.07] flex flex-col gap-3 p-4 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center glow-amber shrink-0">
                  <span className="text-neutral-950 font-black text-base leading-none">N</span>
                </div>
                <span className="text-sm font-black tracking-tighter text-white">NOMMAD</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <NavBox items={NAV_CORE}    path={path} onClose={() => setDrawerOpen(false)} />
            <NavBox items={NAV_PREMIUM} path={path} label="Premium" onClose={() => setDrawerOpen(false)} />
            <NavBox items={NAV_SYSTEM}  path={path} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
