"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Music, Check, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptTerms) {
      setError("Você precisa aceitar os Termos de Uso para continuar.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createSupabaseClient();
    
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          artistName,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 mesh-bg relative overflow-hidden">
        <div className="w-full max-w-sm anim-fade-up relative z-10">
          <div className="glass-card p-10 border-white/5 bg-black/40 backdrop-blur-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/50">
              <Check className="text-green-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">CADASTRO REALIZADO!</h2>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
              Sua conta foi criada com sucesso. Agora você pode entrar no sistema para iniciar seu diagnóstico.
            </p>
            <Link 
              href="/login" 
              className="w-full py-5 bg-yellow-500 text-neutral-950 rounded-2xl text-sm font-black hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 glow-accent uppercase tracking-widest"
            >
              IR PARA O LOGIN <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
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
          <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">CRIAR CONTA</h2>
          <p className="text-neutral-500 text-sm text-center mb-10">
            Inicie seu legado artístico hoje mesmo.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-black block mb-2.5 ml-1">
                Seu Nome Real
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Seu Nome"
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-yellow-500/50 focus:bg-black/50 transition-all font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-black block mb-2.5 ml-1">
                Nome do Artista / Projeto
              </label>
              <div className="relative">
                <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                  placeholder="EX: NOMMAD"
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-yellow-500/50 focus:bg-black/50 transition-all font-bold uppercase tracking-wider"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-black block mb-2.5 ml-1">
                E-mail Profissional
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
              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-black block mb-2.5 ml-1">
                Senha de Acesso
              </label>
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

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (e.target.checked) setError(null);
                  }}
                  className="peer w-5 h-5 rounded border border-white/20 bg-black/20 appearance-none cursor-pointer checked:bg-yellow-500 checked:border-yellow-500 transition-all"
                />
                <Check className="absolute left-0.5 top-0.5 w-4 h-4 text-neutral-950 opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
                Eu li e aceito os{" "}
                <span className="text-yellow-500 underline underline-offset-2 hover:text-yellow-400 transition-colors">Termos de Uso</span> e a{" "}
                <span className="text-yellow-500 underline underline-offset-2 hover:text-yellow-300 transition-colors">Política de Privacidade</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-yellow-500 text-neutral-950 rounded-2xl text-sm font-black hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 glow-accent mt-4 uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  INICIAR ESCALA AGORA <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <Link href="/" className="flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-yellow-500 transition-colors mt-6">
            <ArrowLeft size={16} /> Voltar para a Landing
          </Link>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-neutral-500">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-black transition-colors uppercase tracking-widest">
                Entrar
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
