"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Users, Database, Globe, User, Mail, ShieldCheck } from "lucide-react";
import { getContacts } from "@/lib/actions/contacts";

export default function NetworkPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const stats = [
    { name: "Contratantes", count: contacts.filter(c => c.category === 'contratante').length, icon: Globe, color: "text-blue-400" },
    { name: "A&R / Labels", count: contacts.filter(c => c.category === 'parceiro').length, icon: Database, color: "text-purple-400" },
    { name: "Artistas", count: contacts.filter(c => c.category === 'artista').length, icon: Users, color: "text-[#FFD700]" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0F0F13] border border-white/5 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md hover:border-white/10 transition-colors"
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${cat.color} border border-white/5`}>
              <cat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-black text-white leading-none mb-1">{cat.count}</div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{cat.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Contact List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
             Ativos de Rede Detectados
          </h2>
          
          <div className="flex flex-col gap-3">
            {contacts.map((contact) => (
              <motion.div 
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#141416] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-[#FFD700]/30 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFD700]/20">
                    <User className="w-6 h-6 text-white/20 group-hover:text-[#FFD700] transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tight group-hover:text-[#FFD700] transition-colors">{contact.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">{contact.category || 'CONTATO'}</span>
                       {contact.email && <span className="text-[9px] text-white/20 flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">DATA DE EXTRAÇÃO</div>
                  <div className="text-[10px] font-black text-white/40">{new Date(contact.updatedAt).toLocaleDateString()}</div>
                </div>
              </motion.div>
            ))}

            {contacts.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/5 rounded-3xl">
                <Users className="w-10 h-10 text-white/10 mb-4" />
                <p className="text-white/30 font-bold tracking-widest uppercase">Nenhum contato extraído ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Influence Map (Aesthetic) */}
        <div className="hidden lg:flex flex-col gap-4">
           <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Mapa de Influência</h2>
           <div className="bg-[#141416] border border-white/5 rounded-[2.5rem] p-8 aspect-square relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="overflow-visible">
                   <circle cx="50%" cy="50%" r="60" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                   <circle cx="50%" cy="50%" r="120" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                   <circle cx="50%" cy="50%" r="180" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                </svg>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-black text-sm shadow-[0_0_50px_rgba(255,215,0,0.4)] relative z-10 uppercase tracking-tighter italic"
              >
                Você
              </motion.div>
              
              {contacts.slice(0, 8).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-[#FFD700]/40 border border-[#FFD700] blur-[1px]"
                  style={{
                    top: `${50 + 35 * Math.sin(i * (Math.PI / 4))}%`,
                    left: `${50 + 35 * Math.cos(i * (Math.PI / 4))}%`,
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
           </div>
           <div className="p-4 rounded-2xl bg-[#FFD700]/5 border border-[#FFD700]/20">
              <p className="text-[10px] text-white/50 leading-relaxed italic">
                "Sua rede é seu patrimônio. Cada interação no Boss System mapeia automaticamente novas pontes de influência."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
