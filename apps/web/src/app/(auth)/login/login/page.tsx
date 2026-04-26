"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AtSign, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Simulação de login para teste de fluxo
    setTimeout(() => {
      router.push("/onboarding");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#111111] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background gradients based on the image */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#2a2a1a] to-transparent opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-[#1a1a2a] to-transparent opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-[#141416] rounded-xl border border-white/5 shadow-2xl p-8 sm:p-10">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight mb-4 flex items-center justify-center">
              NOMMAD AI<span className="text-[#FFD700]">.</span>
            </h1>
            <p className="text-white font-bold text-lg">Acesse sua Engine.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                E-mail do Produtor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="w-4 h-4 text-white/40" />
                </div>
                <input
                  type="email"
                  placeholder="studio@domain.com"
                  className="w-full bg-[#222224] border-none rounded-md py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-white/40" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#222224] border-none rounded-md py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-sm py-3.5 rounded-md flex items-center justify-center transition-colors"
            >
              <span className="uppercase tracking-wider mr-2">Entrar na Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#141416] px-4 text-white/40">ou</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full bg-[#1A1A1C] hover:bg-[#222224] border border-white/5 rounded-md py-3 flex items-center justify-center gap-3 transition-colors"
            >
              {/* SVG do Spotify realçando o ícone verde */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1DB954]" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="text-sm text-white/80">Continuar com o Spotify</span>
            </button>

            <button
              type="button"
              className="w-full bg-[#1A1A1C] hover:bg-[#222224] border border-white/5 rounded-md py-3 flex items-center justify-center gap-3 transition-colors"
            >
              {/* SVG do Google com cores originais */}
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm text-white/80">Continuar com o Google</span>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-white/50">
            Ainda não é membro?{" "}
            <Link href="#" className="text-[#FFD700] hover:underline">
              Solicite seu acesso VIP
            </Link>
          </div>

        </div>
      </motion.div>
    </main>
  );
}
