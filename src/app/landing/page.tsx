"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Navbar from "@/components/ui/Navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-amber-500/30">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="eyebrow text-amber-500">Próxima Geração de Carreira</span>
            <h1 className="display-title max-w-4xl">
              O Sistema Operacional para o <br />
              <span className="display-title-accent italic">Novo Artista Digital</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle"
          >
            A NOMMAD AI centraliza sua estratégia, produção e negócios em uma interface unificada 
            impulsionada por inteligência artificial. Transforme sua visão em império.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 pt-8"
          >
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)]"
            >
              Acessar Dashboard
            </Link>
            <Link 
              href="/onboarding"
              className="px-8 py-4 glass-pill border border-white/10 hover:border-white/20 transition-all"
            >
              Criar Conta Grátis
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
