"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Palette, Sparkles, Download, Layers, Loader2, ArrowRight, ChevronRight, AlertCircle, Wand2, Image as ImageIcon } from "lucide-react";

export default function DesignPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedType, setSelectedType] = useState("carrossel");

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage("");
    setGeneratedImage("");

    try {
      const res = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Erro desconhecido ao gerar imagem.");
        return;
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch {
      setErrorMessage("Falha de conexão com o servidor. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (item: number) => {
    console.log("Template selecionado:", item);
  };

  const handleExplore = () => {
    console.log("Explorar mais templates");
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
          Design Studio
        </h1>
        <p className="text-white/60 text-lg">
          Identidade visual instantânea baseada no seu DNA Artístico.
        </p>
      </motion.div>

      {/* Área Principal (Divisão 1/3 e 2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-12">
        {/* Painel de Controles (1/3) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#FFD700]" />
            </div>
            <h2 className="font-bold text-white">Configuração</h2>
          </div>

          <div className="space-y-6 flex-1">
            {/* Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                Tipo de Peça
              </label>
              <div className="relative">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 text-white text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                >
                  <option value="carrossel">Carrossel (Instagram)</option>
                  <option value="capa">Capa de Track (Spotify)</option>
                  <option value="reel">Reel Cover</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">
                Conteúdo / Roteiro
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 bg-[#0A0A0C] border border-white/10 text-white text-sm rounded-xl p-4 focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none placeholder:text-white/20"
                placeholder="Descreva a peça visual que deseja gerar..."
              />
            </div>
          </div>

          {/* Error Feedback */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-start gap-3 bg-[#FF3333]/10 border border-[#FF3333]/30 rounded-xl p-4"
              >
                <AlertCircle className="w-4 h-4 text-[#FF3333] shrink-0 mt-0.5" />
                <p className="text-xs text-[#FF3333] leading-relaxed">
                  {errorMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={!isGenerating ? { scale: 1.02 } : {}}
            whileTap={!isGenerating ? { scale: 0.98 } : {}}
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full mt-6 py-4 rounded-xl bg-[#FFD700] text-black font-black text-sm flex items-center justify-center gap-2 hover:bg-[#FFD700]/90 transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Gerar Visual
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Preview do Canvas (2/3) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 lg:col-span-2 bg-[#050505] border border-white/5 rounded-2xl p-8 relative flex flex-col items-center justify-center overflow-hidden min-h-[500px]"
        >
          {/* Fundo da prancheta (Grid sutil) */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.02] pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-r border-b border-white" />
            ))}
          </div>

          {/* Download button */}
          {generatedImage && (
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <a
                href={generatedImage}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white p-2 rounded-lg transition-colors border border-white/5"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Brilho de fundo */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FFD700] blur-[120px] pointer-events-none transition-opacity duration-700 ${
              isGenerating ? "opacity-20 animate-pulse" : "opacity-10"
            }`}
          />

          <AnimatePresence mode="wait">
            {/* Skeleton Loader */}
            {isGenerating && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-[400px] aspect-square rounded-xl overflow-hidden"
              >
                <div className="w-full h-full bg-[#141416]/80 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-5 relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0">
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent skew-x-[-20deg]"
                    />
                  </div>

                  <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest">
                      Gerando visual
                    </p>
                    <p className="text-[10px] text-white/30 mt-1 font-mono">
                      FREEPIK AI
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Generated Image */}
            {!isGenerating && generatedImage && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="relative z-10 w-full max-w-[400px] aspect-square"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 relative group"
                >
                  <Image
                    src={generatedImage}
                    alt="Visual gerado pelo Design Studio"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Overlay sutil no hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </motion.div>
            )}

            {/* Default Mockup (idle state) */}
            {!isGenerating && !generatedImage && (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 w-full max-w-[340px] aspect-square bg-[#141416]/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
                >
                  {/* Tag amarela */}
                  <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)]" />

                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <h3 className="text-4xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                      O Segredo
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                        Oculto
                      </span>
                      <br />
                      Do Seu Kick
                    </h3>
                  </div>

                  <div className="p-6 pt-0 flex justify-between items-end">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                      <div className="font-black text-[#FFD700] text-xs">
                        N.
                      </div>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                      Arrastar{" "}
                      <ChevronRight className="inline w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Galeria de Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-4">
          Seus Templates
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {/* Template Item */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              onClick={() => handleSelectTemplate(item)}
              className="w-32 h-32 shrink-0 bg-[#0A0A0C] border border-white/10 rounded-xl hover:border-white/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
            >
              <ImageIcon className="w-6 h-6 text-white/20 group-hover:text-white/50 transition-colors" />
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                Post {item}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          <div onClick={handleExplore} className="w-32 h-32 shrink-0 bg-transparent border border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60">
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Explorar +
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
