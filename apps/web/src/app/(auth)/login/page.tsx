"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseClient();
    
    // 1. Sign In
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Erro ao obter dados do usuário.");
      setLoading(false);
      return;
    }

    // 2. Check Profile Stage
    // We can use a simple fetch here since we are on the client
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stage')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[LOGIN_PROFILE_ERROR]", profileError);
      // If a real error occurs, default to onboarding to be safe
      window.location.href = "/onboarding";
      return;
    }

    // 3. Redirect based on stage
    if (!profile || profile.stage === 'pendente') {
      window.location.href = "/onboarding";
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-bg relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm anim-fade-up relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center glow-accent shrink-0">
            <span className="text-neutral-950 font-black text-3xl leading-none">N</span>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">NOMMAD AI<span className="text-yellow-500">.</span></span>
            <span className="block text-[10px] text-yellow-500/80 tracking-[0.3em] uppercase font-bold">Artist OS</span>
          </div>
        </div>

        <div className="glass-card p-10 border-white/5 bg-black/40 backdrop-blur-2xl">
          <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">BEM-VINDO</h2>
          <p className="text-neutral-500 text-sm text-center mb-10">
            Entre com suas credenciais de artista.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-black block mb-2.5 ml-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-yellow-500/50 focus:bg-black/50 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5 ml-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-black block">
                  Senha
                </label>
                <button type="button" className="text-[10px] text-yellow-500/50 hover:text-yellow-500 uppercase tracking-tighter transition-colors font-bold">
                  Esqueceu?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-yellow-500/50 focus:bg-black/50 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-yellow-500 text-neutral-950 rounded-2xl text-sm font-black hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 glow-accent mt-4 uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Autenticando...
                </>
              ) : (
                "ENTRAR NO SISTEMA"
              )}
            </button>
          </form>

          <Link href="/" className="flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-yellow-500 transition-colors mt-6">
            <ArrowLeft size={16} /> Voltar para a Landing
          </Link>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-neutral-500">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-yellow-500 hover:text-yellow-400 font-black transition-colors uppercase tracking-widest">
                Criar Agora
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-neutral-700 mt-10 uppercase tracking-[0.4em] font-bold">
          Método Diogo O&apos;Band · Precision OS
        </p>
      </div>
    </div>
  );
}
