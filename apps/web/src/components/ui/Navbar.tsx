"use client";

import { Button } from "./Button";
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 backdrop-blur-md bg-black/20 border-b border-white/[0.06]"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 md:w-8 h-7 md:h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
          <span className="text-black font-black text-lg md:text-xl">N</span>
        </div>
        <span className="text-white font-bold tracking-tighter text-lg md:text-xl">NOMMAD AI<span className="text-yellow-500">.</span></span>
      </div>
      
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link href="#recursos" className="text-sm text-neutral-400 hover:text-white transition-colors">Recursos</Link>
        <Link href="#precos" className="text-sm text-neutral-400 hover:text-white transition-colors">Preços</Link>
        <Link href="#depoimentos" className="text-sm text-neutral-400 hover:text-white transition-colors">Depoimentos</Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/login" className="hidden sm:block">
          <Button variant="ghost" size="sm">Login</Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm" glow>Começar</Button>
        </Link>
      </div>
    </motion.nav>
  );
};
