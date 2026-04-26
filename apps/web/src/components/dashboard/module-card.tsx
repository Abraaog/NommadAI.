'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface ModuleCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  status?: string
  isPremium?: boolean
  color?: string
}

const colorMap: Record<string, { 
  border: string, 
  bg: string, 
  icon: string,
  glow: string 
}> = {
  yellow: { border: 'hover:border-yellow-500/30', bg: 'bg-yellow-500/10', icon: 'text-yellow-500', glow: 'group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]' },
  blue: { border: 'hover:border-blue-500/30', bg: 'bg-blue-500/10', icon: 'text-blue-500', glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' },
  purple: { border: 'hover:border-purple-500/30', bg: 'bg-purple-500/10', icon: 'text-purple-500', glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]' },
  emerald: { border: 'hover:border-emerald-500/30', bg: 'bg-emerald-500/10', icon: 'text-emerald-500', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]' },
  amber: { border: 'hover:border-amber-500/30', bg: 'bg-amber-500/10', icon: 'text-amber-500', glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
  rose: { border: 'hover:border-rose-500/30', bg: 'bg-rose-500/10', icon: 'text-rose-500', glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]' },
  indigo: { border: 'hover:border-indigo-500/30', bg: 'bg-indigo-500/10', icon: 'text-indigo-500', glow: 'group-hover:shadow-[0_0_20px_rgba(79,70,229,0.2)]' },
  green: { border: 'hover:border-green-500/30', bg: 'bg-green-500/10', icon: 'text-green-500', glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]' },
  sky: { border: 'hover:border-sky-500/30', bg: 'bg-sky-500/10', icon: 'text-sky-500', glow: 'group-hover:shadow-[0_0_20px_rgba(14,165,233,0.2)]' },
}

export function ModuleCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  status, 
  isPremium,
  color = 'yellow'
}: ModuleCardProps) {
  const colors = colorMap[color] || colorMap.yellow

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-full"
    >
      <Link href={href} className="block h-full">
        <div className={`glass-floating h-full flex flex-col p-6 border-white/5 ${colors.border} transition-all duration-300`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center border border-white/10 ${colors.glow} transition-all duration-300`}>
              <Icon size={24} className={colors.icon} />
            </div>
            {isPremium && (
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[9px] text-yellow-500 font-black uppercase tracking-widest">
                Premium
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-6">
            {description}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            {status && (
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {status}
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all">
              <span className="text-lg font-bold">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
