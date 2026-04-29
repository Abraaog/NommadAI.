"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, CreditCard, Bell, PlugZap, PlayCircle, Send, Radio, Check, Mail, Lock, ShieldCheck, Globe, Trash2, BarChart3, Plus, Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSupabaseClient } from "@/lib/supabase/client";

const supabase = createSupabaseClient();

const AVATARS = [
  { id: 0, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=6244329a-d304-4b7d-a8e7-7c8bb33afd54" }, // Matheus (Padrão)
];

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("conta");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    artistName: "",
    email: "",
    avatarUrl: ""
  });

  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [togglePush, setTogglePush] = useState(true);
  const [toggleEmail, setToggleEmail] = useState(false);
  const [toggleTelegram, setToggleTelegram] = useState(true);

  useEffect(() => {
    async function getInitialData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = "/login";
          return;
        }
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        const finalName = prof?.name || user.user_metadata?.name || user.user_metadata?.full_name || "Artista";
        const finalArtist = prof?.artist_name || "Artista";
        const finalAvatar = prof?.avatar_url || AVATARS[0].url;

        setProfile(prof || { name: finalName, artist_name: finalArtist, avatar_url: finalAvatar });
        setFormData({
          name: finalName,
          artistName: finalArtist,
          email: user.email || "",
          avatarUrl: finalAvatar
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    getInitialData();
  }, []);

  const handleAvatarUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Sanitizar nome do arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes("bucket not found")) {
          throw new Error("Bucket 'avatars' não encontrado no Supabase.");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatarUrl: publicUrl });
      toast.success("Foto carregada com sucesso!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          artist_name: formData.artistName,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast.error("Erro ao salvar: " + error.message);
      } else {
        toast.success("Perfil atualizado! Recarregando...");
        // Pequeno delay para o usuário ver o toast antes do reload
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      alert("Erro crítico ao salvar.");
    }
  };

  const tabs = [
    { id: "integracoes", label: "Integrações", icon: PlugZap },
    { id: "usage", label: "Usage", icon: BarChart3 },
    { id: "conta", label: "Minha Conta", icon: User },
    { id: "assinatura", label: "Assinatura", icon: CreditCard },
    { id: "notificacoes", label: "Notificações", icon: Bell },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
        </div>
      );
    }

    switch (selectedTab) {
      case "integracoes":
        return (
          <motion.div 
            key="integracoes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-lg font-black text-white tracking-widest uppercase mb-2">
              Conexões de API
            </h2>

            {/* Bloco 1: Spotify */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors hover:bg-white/10">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-[#1DB954]/10 rounded-xl flex items-center justify-center shrink-0">
                  <PlayCircle className="w-6 h-6 text-[#1DB954]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">Spotify for Artists</h3>
                  <p className="text-white/40 text-sm">Importar métricas de reprodução e playlists.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  Desconectado
                </span>
                <button className="px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white/80 text-sm font-bold hover:bg-white/5 transition-colors">
                  Conectar Conta
                </button>
              </div>
            </div>

            {/* Bloco 2: Telegram Bot (CRÍTICO) */}
            <div className="bg-[#141416] border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.05)] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-4 w-full z-10">
                <div className="w-12 h-12 bg-[#229ED9]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Send className="w-6 h-6 text-[#229ED9]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">Bot de Áudio NOMMAD</h3>
                  <p className="text-white/50 text-sm max-w-sm">
                    Sincronize seu Telegram para mandar áudios direto para a Engine de Roteiros e Inteligência.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end z-10">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                    Conectado
                  </span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/5 text-white text-sm font-bold hover:bg-white/20 transition-colors">
                  Gerenciar
                </button>
              </div>
            </div>

            {/* Bloco 3: Ableton Live */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors hover:bg-white/10">
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">Sincronização de Projetos (.als)</h3>
                  <p className="text-white/40 text-sm">Leitura avançada do seu Workflow musical.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <span className="px-2 py-1 bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-black uppercase tracking-widest rounded">
                  Beta
                </span>
                <button className="px-4 py-2 rounded-lg bg-transparent border border-white/20 text-white/80 text-sm font-bold hover:bg-white/5 transition-colors">
                  Solicitar Acesso
                </button>
              </div>
            </div>

            <h2 className="text-lg font-black text-white tracking-widest uppercase mt-8 mb-2">
              Preferências da Engine
            </h2>

            {/* Toggles */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">Escuta Passiva Contínua</h4>
                  <p className="text-white/40 text-xs">A IA analisa o dashboard enquanto você navega para sugerir insights.</p>
                </div>
                <Toggle active={toggle1} onClick={() => setToggle1(!toggle1)} />
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">Notificações Push Gamificadas</h4>
                  <p className="text-white/40 text-xs">Alertas sonoros estilo "Level Up" quando metas de views são atingidas.</p>
                </div>
                <Toggle active={toggle2} onClick={() => setToggle2(!toggle2)} />
              </div>
            </div>
          </motion.div>
        );
      case "conta":
        return (
          <motion.div 
            key="conta"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/10 overflow-hidden flex items-center justify-center">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full" />
                  ) : (
                    <User className="w-10 h-10 text-white/20" />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{formData.name || "Matheus"}</h2>
                <div className="flex flex-col gap-0.5">
                  <p className="text-white/40 text-[10px] tracking-widest uppercase font-bold">{formData.artistName || "Artista"}</p>
                  <p className="text-[#FFD700]/60 text-[10px] font-medium">{formData.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">Identidade Visual</h3>
              <div className="flex flex-wrap gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                {/* Avatar Padrão */}
                <button
                  onClick={() => setFormData({ ...formData, avatarUrl: AVATARS[0].url })}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 bg-gradient-to-br from-gray-800 to-gray-900 ${
                    formData.avatarUrl === AVATARS[0].url 
                    ? "border-[#FFD700] ring-2 ring-[#FFD700]/20" 
                    : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={AVATARS[0].url} alt="Padrão" className="w-full h-full object-cover" />
                  {formData.avatarUrl === AVATARS[0].url && (
                    <div className="absolute inset-0 bg-[#FFD700]/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#FFD700]" />
                    </div>
                  )}
                </button>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 hover:border-[#FFD700]/50 transition-all group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-white/40 group-hover:text-[#FFD700] transition-colors" />
                        <span className="text-[10px] text-white/20 font-bold uppercase mt-1 group-hover:text-[#FFD700]/50">Upload</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview de Upload customizado (se houver e não for o padrão) */}
                {formData.avatarUrl && formData.avatarUrl !== AVATARS[0].url && (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#FFD700] ring-2 ring-[#FFD700]/20">
                    <img src={formData.avatarUrl} alt="Custom" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#FFD700]/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#FFD700]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nome Público</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-colors" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Principal</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <input 
                    type="email" 
                    value={formData.email} 
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white/40 text-sm focus:outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Segurança</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                     <Lock className="w-5 h-5 text-white/40" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">Senha de Acesso</p>
                     <p className="text-xs text-white/40">Alterada pela última vez há 3 meses.</p>
                   </div>
                </div>
                <button className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest hover:underline">Redefinir</button>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                     <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">Autenticação em Duas Etapas</p>
                     <p className="text-xs text-green-400">Ativado via Telegram Bot.</p>
                   </div>
                </div>
                <button className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Desativar</button>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
               <button className="px-6 py-3 rounded-xl border border-red-500/20 text-red-500/50 text-sm font-bold hover:bg-red-500/5 transition-colors flex items-center gap-2">
                 <Trash2 className="w-4 h-4" /> Deletar Conta
               </button>
                <button 
                  onClick={handleSave}
                  className="px-8 py-3 rounded-xl bg-[#FFD700] text-black text-sm font-bold hover:bg-[#FFD700]/90 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                >
                  Salvar Alterações
                </button>
            </div>
          </motion.div>
        );
      case "usage":
        return (
          <UsageTab />
        );
      case "assinatura":
        return (
          <motion.div 
            key="assinatura"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
             <div className="bg-gradient-to-br from-[#141416] to-[#0F0F13] border border-[#FFD700]/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 blur-[100px] rounded-full" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                   <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 mb-4">
                        <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
                        <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">Plano Ativo</span>
                      </div>
                      <h2 className="text-4xl font-black text-white mb-2">NOMMAD PRO</h2>
                      <p className="text-white/40 text-sm">Próximo faturamento em 12 de Maio, 2026.</p>
                   </div>
                   <div className="text-right">
                      <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Valor Mensal</div>
                      <div className="text-4xl font-black text-white tracking-tighter">R$ 97<span className="text-lg text-white/40 font-bold">,90</span></div>
                   </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                   <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm text-white/70">Acesso ao Cérebro (Obsidian Sync)</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm text-white/70">Gerador de Hooks Ilimitado</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm text-white/70">Pitch de E-mail Automático</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">Histórico de Cobrança</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-white/40 font-bold uppercase text-[10px] tracking-widest">
                         <tr>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Fatura</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                         </tr>
                      </thead>
                      <tbody className="text-white/70">
                         <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">12 Abr, 2026</td>
                            <td className="px-6 py-4">#NOMMAD-4921</td>
                            <td className="px-6 py-4">R$ 97,90</td>
                            <td className="px-6 py-4 text-right">
                               <button className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest hover:underline">Download PDF</button>
                            </td>
                         </tr>
                         <tr className="border-t border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">12 Mar, 2026</td>
                            <td className="px-6 py-4">#NOMMAD-4810</td>
                            <td className="px-6 py-4">R$ 97,90</td>
                            <td className="px-6 py-4 text-right">
                               <button className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest hover:underline">Download PDF</button>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <div>
                   <h4 className="text-red-500 font-bold text-sm">Cancelar Assinatura</h4>
                   <p className="text-white/30 text-xs">Você perderá o acesso às ferramentas premium no final do ciclo.</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-red-500/20 text-red-500/50 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors">Cancelar</button>
             </div>
          </motion.div>
        );
      case "notificacoes":
        return (
          <motion.div 
            key="notificacoes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
             <h2 className="text-lg font-black text-white tracking-widest uppercase mb-2">
               Central de Alertas
             </h2>

             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white/40" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Notificações no Navegador (Push)</p>
                        <p className="text-xs text-white/40">Alertas de insights enquanto você produz.</p>
                      </div>
                   </div>
                   <Toggle active={togglePush} onClick={() => setTogglePush(!togglePush)} />
                </div>

                <div className="w-full h-px bg-white/5" />

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white/40" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Relatórios por Email</p>
                        <p className="text-xs text-white/40">Resumo semanal de desempenho e networking.</p>
                      </div>
                   </div>
                   <Toggle active={toggleEmail} onClick={() => setToggleEmail(!toggleEmail)} />
                </div>

                <div className="w-full h-px bg-white/5" />

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#229ED9]/10 flex items-center justify-center">
                        <Send className="w-5 h-5 text-[#229ED9]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Alertas de Radar (Telegram)</p>
                        <p className="text-xs text-white/40">Notificações críticas sobre tendências da cena.</p>
                      </div>
                   </div>
                   <Toggle active={toggleTelegram} onClick={() => setToggleTelegram(!toggleTelegram)} />
                </div>
             </div>

             <div className="p-6 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-2xl flex items-center gap-4">
                <Bell className="w-5 h-5 text-[#FFD700]" />
                <p className="text-xs text-white/60 leading-relaxed">
                  <strong>Dica de Produtividade:</strong> Recomendamos deixar os alertas de Telegram ativos para receber insights de tendências em tempo real, mesmo fora do computador.
                </p>
             </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full p-8 md:p-12 pb-32 max-w-7xl mx-auto w-full flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          Configurações do Sistema
        </h1>
      </motion.div>

      {/* Main Layout Duplo */}
      <div className="flex flex-col md:flex-row gap-8 w-full">
        
        {/* Menu Lateral (Esquerda - 1/4) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full md:w-1/4 flex flex-col gap-2"
        >
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                selectedTab === tab.id 
                ? "bg-white/5 text-white border-l-2 border-[#FFD700]" 
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${selectedTab === tab.id ? "text-[#FFD700]" : ""}`} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Painel de Conteúdo (Direita - 3/4) */}
        <div className="w-full md:w-3/4 min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${active ? 'bg-[#FFD700]' : 'bg-white/20'}`}
    >
      <motion.div 
        layout
        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
        initial={false}
        animate={{ left: active ? 'calc(100% - 22px)' : '2px' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function UsageTab() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCost: 0, totalTokens: 0, calls: 0 });

  useEffect(() => {
    async function fetchUsage() {
      const { data: runs, error } = await supabase
        .from('agent_runs')
        .select('agent_name, model, tokens_in, tokens_out, estimated_cost, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error:', error);
        setLoading(false);
        return;
      }

      const grouped: Record<string, any> = {};
      
      if (runs) {
        runs.forEach((r: any) => {
          const name = r.agent_name;
          if (!grouped[name]) {
            grouped[name] = { 
              agent_name: name, 
              model: r.model || '-', 
              tokens_in: 0, 
              tokens_out: 0, 
              estimated_cost: 0, 
              calls: 0 
            };
          }
          grouped[name].tokens_in += r.tokens_in || 0;
          grouped[name].tokens_out += r.tokens_out || 0;
          grouped[name].estimated_cost += parseFloat(r.estimated_cost) || 0;
          grouped[name].calls += 1;
        });
      }

      const uniqueData = Object.values(grouped).sort((a: any, b: any) => b.calls - a.calls);
      setData(uniqueData);
      
      const cost = uniqueData.reduce((sum: number, r: any) => sum + r.estimated_cost, 0);
      const tokens = uniqueData.reduce((sum: number, r: any) => sum + r.tokens_in + r.tokens_out, 0);
      const calls = uniqueData.reduce((sum: number, r: any) => sum + r.calls, 0);
      setStats({ totalCost: cost, totalTokens: tokens, calls });
      setLoading(false);
    }
    fetchUsage();
  }, []);

  if (loading) return <div className="text-neutral-500">Carregando...</div>;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
      <h2 className="text-lg font-black text-white tracking-widest uppercase">Usage & Custos</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Total Calls</p>
          <p className="text-2xl font-bold text-white">{stats.calls}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Total Tokens</p>
          <p className="text-2xl font-bold text-white">{stats.totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Est. Cost</p>
          <p className="text-2xl font-bold text-[#FFD700]">${stats.totalCost.toFixed(6)}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-3 text-neutral-500 font-medium">Agent</th>
              <th className="text-left p-3 text-neutral-500 font-medium">Model</th>
              <th className="text-right p-3 text-neutral-500 font-medium">In</th>
              <th className="text-right p-3 text-neutral-500 font-medium">Out</th>
              <th className="text-right p-3 text-neutral-500 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={i} className="border-t border-white/5">
                <td className="p-3 text-white">{row.agent_name}</td>
                <td className="p-3 text-neutral-400 text-xs">{row.model}</td>
                <td className="p-3 text-right text-neutral-300">{row.tokens_in || 0}</td>
                <td className="p-3 text-right text-neutral-300">{row.tokens_out || 0}</td>
                <td className="p-3 text-right text-[#FFD700]">${row.estimated_cost || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
