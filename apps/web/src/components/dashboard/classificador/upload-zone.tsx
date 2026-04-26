'use client'

import { useState } from 'react'
import { Link, Upload, Loader2, Plus } from 'lucide-react'

interface UploadZoneProps {
  onClassify: (source: string, type: 'link' | 'file') => void
  isLoading: boolean
}

export function UploadZone({ onClassify, isLoading }: UploadZoneProps) {
  const [source, setSource] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!source.trim()) return
    onClassify(source, source.startsWith('http') ? 'link' : 'file')
    setSource('')
  }

  return (
    <div className="glass-card p-6 border-dashed border-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
            Nova Classificação
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-yellow-500 transition-colors">
              <Link size={18} />
            </div>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Cole um link ou descreva o arquivo..."
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-32 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
            />
            <div className="absolute inset-y-2 right-2">
              <button
                type="submit"
                disabled={isLoading || !source.trim()}
                className="h-full px-6 bg-yellow-500 hover:bg-yellow-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold rounded-xl transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Classificar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">OU</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Upload de Arquivo</p>
              <p className="text-[10px] text-neutral-500">PDF, JPG, MP3 ou WAV</p>
            </div>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Link size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Detectar do Spotify/IG</p>
              <p className="text-[10px] text-neutral-500">Links de plataformas</p>
            </div>
          </button>
        </div>
      </form>
    </div>
  )
}
