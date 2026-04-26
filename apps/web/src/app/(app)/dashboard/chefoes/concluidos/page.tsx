"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Mail, Trash2 } from "lucide-react";
import { getContacts, deleteContact } from "@/lib/actions/contacts";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  category: string | null;
  status: string;
  updatedAt: string | Date | null;
};

export default function ConcluidosPage() {
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      const closed = data.filter((c: any) => c.status === 'closed') as Contact[];
      setContactsList(closed);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar permanentemente este registro histórico?")) return;
    try {
      await deleteContact(id);
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00FF66] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-white/40 text-xs font-bold tracking-widest uppercase">
        {contactsList.length} CASOS CONCLUÍDOS NO ARQUIVO
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactsList.map((contact, idx) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#0F0F13]/40 border border-[#00FF66]/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleDelete(contact.id)}
                className="text-white/20 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#00FF66]/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#00FF66]" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white uppercase leading-tight">
                  {contact.name}
                </h4>
                <p className="text-[10px] font-bold text-[#00FF66] tracking-widest uppercase">
                  Caso Concluído
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Mail className="w-3.5 h-3.5" /> {contact.email || "Sem email"}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar className="w-3.5 h-3.5" /> {new Date(contact.updatedAt || "").toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6">
              <div className="px-3 py-1 bg-[#00FF66]/10 border border-[#00FF66]/20 rounded text-[9px] font-bold text-[#00FF66] tracking-widest uppercase w-max">
                {contact.category || "Artista"}
              </div>
            </div>
          </motion.div>
        ))}

        {contactsList.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 opacity-30">
            <CheckCircle className="w-12 h-12 text-white/20" />
            <div className="text-sm font-bold tracking-widest uppercase">Nenhum caso concluído ainda</div>
          </div>
        )}
      </div>
    </div>
  );
}
