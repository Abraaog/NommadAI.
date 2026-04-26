"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle, Sword, Zap, Plus, MoreVertical, Trash2, Mail, Phone, ExternalLink } from "lucide-react";
import { getContacts, createContact, updateContactStatus, deleteContact } from "@/lib/actions/contacts";
import { analyzeNegotiation } from "@/lib/actions/analysis";
// Removed missing sonner import

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  category: string | null;
  status: string;
  notes: string | null;
  avatarUrl: string | null;
  updatedAt: string | Date | null;
};

export default function AtivosPage() {
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [proofText, setProofText] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "analyzing" | "success" | "partial" | "failure">("idle");
  const [analysisResult, setAnalysisResult] = useState<{ title: string; feedback: string; xp: number } | null>(null);

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    category: "artist",
    status: "lead" as "lead" | "negotiation",
  });

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      // Filter only active ones for this page
      const active = data.filter((c: any) => c.status !== 'closed') as Contact[];
      setContactsList(active);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContact(newContact);
      setIsAdding(false);
      setNewContact({ name: "", email: "", category: "artist", status: "lead" });
      fetchContacts();
    } catch (err) {
      console.error("Error creating contact", err);
    }
  };

  const handleUpdateStatus = async (id: string, status: "lead" | "negotiation" | "closed") => {
    try {
      await updateContactStatus(id, status);
      fetchContacts();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este contato?")) return;
    try {
      await deleteContact(id);
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact", err);
    }
  };

  const handleAnalyze = async () => {
    if (!proofText.trim()) return;
    setFeedbackState("analyzing");
    
    try {
      const result = await analyzeNegotiation(proofText);
      if (result.status === "error") {
        alert(result.message);
        setFeedbackState("idle");
        return;
      }
      
      setAnalysisResult({
        title: result.title || "",
        feedback: result.feedback || "",
        xp: result.xp || 0
      });
      setFeedbackState(result.status as any);
    } catch (err) {
      console.error("Analysis failed", err);
      setFeedbackState("idle");
    }
  };

  const closeModal = () => {
    setSelectedContact(null);
    setTimeout(() => {
      setProofText("");
      setFeedbackState("idle");
      setAnalysisResult(null);
    }, 300);
  };

  const columns = [
    { id: "lead", name: "LEADS / CONTATOS", color: "border-blue-500/50" },
    { id: "negotiation", name: "EM NEGOCIAÇÃO", color: "border-purple-500/50" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="text-white/40 text-xs font-bold tracking-widest uppercase">
          {contactsList.length} CASOS ATIVOS ENCONTRADOS
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="shrink-0 bg-[#FFD700] text-black px-8 py-3.5 rounded-full font-black text-sm tracking-widest shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> ABRIR CASO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-4 bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.id === 'lead' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                {col.name}
              </h3>
              <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-white/40">
                {contactsList.filter(c => c.status === col.id).length}
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
              {contactsList.filter(c => c.status === col.id).map((contact) => (
                <motion.div
                  key={contact.id}
                  layoutId={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#0F0F13] border border-white/10 rounded-2xl p-5 group cursor-pointer hover:border-[#FFD700]/50 transition-all relative overflow-hidden"
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-black text-white/40 border border-white/10">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-base font-black text-white group-hover:text-[#FFD700] transition-colors uppercase">
                          {contact.name}
                        </div>
                        <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">
                          {contact.category || 'ARTISTA'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                        className="p-1.5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <Mail className="w-3 h-3" /> {contact.email}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                       <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleUpdateStatus(contact.id, col.id === 'lead' ? 'negotiation' : 'closed'); 
                        }}
                        className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all ${
                          col.id === 'lead' 
                            ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' 
                            : 'border-[#00FF66]/30 text-[#00FF66] hover:bg-[#00FF66]/10'
                        }`}
                       >
                         {col.id === 'lead' ? 'Mover p/ Negociação' : 'Finalizar Caso'}
                       </button>
                       <div className="text-[9px] font-bold text-white/20">
                         {new Date(contact.updatedAt || "").toLocaleDateString()}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {contactsList.filter(c => c.status === col.id).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl opacity-20">
                  <div className="text-xs font-bold tracking-widest uppercase">Vazio</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0F0F13] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white tracking-tight">ABRIR NOVO CASO</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-full text-white/50"><X /></button>
              </div>
              <form onSubmit={handleCreateContact} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nome do Contato</label>
                  <input 
                    required
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none"
                    placeholder="Ex: Gabriel Souza"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email (Opcional)</label>
                  <input 
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none"
                    placeholder="gabriel@exemplo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Categoria</label>
                    <select 
                      value={newContact.category}
                      onChange={(e) => setNewContact({...newContact, category: e.target.value})}
                      className="bg-[#1A1A20] border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none appearance-none"
                    >
                      <option value="artist">Artista</option>
                      <option value="agent">Agente / Booker</option>
                      <option value="producer">Produtor</option>
                      <option value="press">Prensa / PR</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Status Inicial</label>
                    <select 
                      value={newContact.status}
                      onChange={(e) => setNewContact({...newContact, status: e.target.value as any})}
                      className="bg-[#1A1A20] border border-white/10 rounded-xl p-4 text-white focus:border-[#FFD700] outline-none appearance-none"
                    >
                      <option value="lead">Lead / Contato</option>
                      <option value="negotiation">Em Negociação</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="mt-4 bg-[#FFD700] text-black py-4 rounded-xl font-black text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                  CADASTRAR E INICIAR
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Analysis / Boss Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0F0F13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center font-black text-[#FFD700] border border-[#FFD700]/20">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-0.5 flex items-center gap-2 uppercase tracking-tight">
                      {selectedContact.name}
                    </h3>
                    <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
                      Dossiê de Combate &bull; {selectedContact.category}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 bg-black/20 flex-1">
                <AnimatePresence mode="wait">
                  {feedbackState === "idle" && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Input de Negociação (Cérebro AI)</label>
                        <textarea 
                          rows={8}
                          value={proofText}
                          onChange={(e) => setProofText(e.target.value)}
                          placeholder="Cole aqui a transcrição do WhatsApp ou e-mail com o contratante/artista para análise de posicionamento..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-5 text-white placeholder-white/30 focus:outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 transition-all resize-none text-sm leading-relaxed"
                        />
                      </div>
                      <button 
                        onClick={handleAnalyze}
                        disabled={!proofText.trim()}
                        className="w-full py-4 rounded-xl bg-[#FFD700] text-black font-black text-base hover:bg-[#FFD700]/90 transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_10px_30px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <Zap className="w-5 h-5" /> Analisar Movimento
                      </button>
                    </motion.div>
                  )}

                  {feedbackState === "analyzing" && (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-48 flex flex-col items-center justify-center gap-4"
                    >
                      <div className="w-10 h-10 border-4 border-white/10 border-t-[#FFD700] rounded-full animate-spin" />
                      <p className="text-white/60 text-sm font-bold tracking-widest uppercase animate-pulse">
                        Cérebro AI Processando Análise...
                      </p>
                    </motion.div>
                  )}

                  {(feedbackState === "success" || feedbackState === "partial" || feedbackState === "failure") && analysisResult && (
                    <motion.div 
                      key={feedbackState}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex flex-col items-center text-center p-8 rounded-2xl border ${
                        feedbackState === 'success' ? 'bg-[#00FF66]/5 border-[#00FF66]/30' :
                        feedbackState === 'partial' ? 'bg-[#FF9900]/5 border-[#FF9900]/30' :
                        'bg-[#FF3333]/5 border-[#FF3333]/30'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        feedbackState === 'success' ? 'bg-[#00FF66]/10' :
                        feedbackState === 'partial' ? 'bg-[#FF9900]/10' :
                        'bg-[#FF3333]/10'
                      }`}>
                        {feedbackState === 'success' ? <CheckCircle className="w-8 h-8 text-[#00FF66]" /> :
                         feedbackState === 'partial' ? <AlertTriangle className="w-8 h-8 text-[#FF9900]" /> :
                         <XCircle className="w-8 h-8 text-[#FF3333]" />}
                      </div>
                      <h4 className={`font-black text-2xl mb-2 uppercase tracking-tight ${
                        feedbackState === 'success' ? 'text-[#00FF66]' :
                        feedbackState === 'partial' ? 'text-[#FF9900]' :
                        'text-[#FF3333]'
                      }`}>
                        {analysisResult.title}
                      </h4>
                      <p className="text-white/80 text-sm mb-8 max-w-md leading-relaxed">
                        {analysisResult.feedback}
                      </p>
                      <button 
                        onClick={closeModal}
                        className={`w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all ${
                          feedbackState === 'success' ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/50' :
                          feedbackState === 'partial' ? 'bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/50' :
                          'bg-[#FF3333]/20 text-[#FF3333] border border-[#FF3333]/50'
                        }`}
                      >
                        {analysisResult.xp > 0 ? `COLETAR ${analysisResult.xp} XP` : 'FECHAR E ESTUDAR'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
