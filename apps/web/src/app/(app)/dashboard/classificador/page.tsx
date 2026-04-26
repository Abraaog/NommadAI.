'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui'
import { UploadZone } from '@/components/dashboard/classificador/upload-zone'
import { ClassificationCard } from '@/components/dashboard/classificador/classification-card'
import { Search, Filter, Layers } from 'lucide-react'

export default function ClassificadorPage() {
  const [classifications, setClassifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchClassifications()
  }, [])

  const fetchClassifications = async () => {
    try {
      const response = await fetch('/api/classifications')
      const data = await response.json()
      setClassifications(data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleClassify = async (source: string, type: 'link' | 'file') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/classifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, type }),
      })
      
      const newClassification = await response.json()
      setClassifications([newClassification, ...classifications])
      
      // Simulate processing
      setTimeout(async () => {
        await fetchClassifications()
      }, 3000)
      
    } catch (error) {
      console.error('Classification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/classifications?id=${id}`, {
        method: 'DELETE',
      })
      setClassifications(classifications.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-500">
          <Layers size={16} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">IA de Análise</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
          Classificador <span className="text-blue-500">Universal</span>
        </h1>
        <p className="text-neutral-500 max-w-xl text-sm leading-relaxed">
          Nossa IA analisa automaticamente documentos, links de redes sociais e mídias para extrair insights, 
          detectar padrões e sugerir as melhores ações para sua carreira.
        </p>
      </section>

      <UploadZone onClassify={handleClassify} isLoading={isLoading} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Recentes</h2>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-[10px] font-bold text-neutral-500">
              <span className="text-white">{classifications.length}</span> ANÁLISES
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 text-neutral-500 hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-neutral-500 hover:text-white transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : classifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classifications.map((c) => (
              <ClassificationCard 
                key={c.id} 
                classification={c} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-20 flex flex-col items-center justify-center text-center gap-4 border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-neutral-700">
              <Layers size={32} />
            </div>
            <div className="max-w-xs">
              <p className="text-white font-bold">Nenhuma classificação ainda</p>
              <p className="text-neutral-500 text-xs mt-1">Cole um link ou faça upload de um arquivo para começar a análise inteligente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
