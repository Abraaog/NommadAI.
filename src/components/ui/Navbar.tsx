"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-topbar px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-black">N</span>
        </div>
        NOMMAD <span className="text-amber-500 font-light">AI</span>
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
        <Link href="/dashboard" className="hover:text-amber-500 transition-colors">Produtos</Link>
        <Link href="/dashboard" className="hover:text-amber-500 transition-colors">Ecossistema</Link>
        <Link href="/dashboard" className="hover:text-amber-500 transition-colors">Comunidade</Link>
        <Link href="/dashboard" className="hover:text-amber-500 transition-colors">Preços</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link href="/login" className="text-sm font-medium hover:text-amber-500 transition-colors">Entrar</Link>
        <Link 
          href="/dashboard" 
          className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-amber-500 transition-all"
        >
          Começar Agora
        </Link>
      </div>
    </nav>
  )
}
