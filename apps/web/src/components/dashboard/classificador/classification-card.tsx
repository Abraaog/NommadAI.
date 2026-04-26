import { useState } from 'react'
import { FileText, Globe, CheckCircle2, Clock, AlertCircle, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ClassificationCardProps {
  classification: {
    id: string
    source: string
    type: 'link' | 'file'
    category: string | null
    status: 'pending' | 'processing' | 'completed' | 'failed'
    result: any
    justification: string | null
    createdAt: Date
  }
  onDelete?: (id: string) => void
}

export function ClassificationCard({ classification, onDelete }: ClassificationCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const Icon = classification.type === 'link' ? Globe : FileText
  const isUrl = classification.source.startsWith('http')

  const statusConfig = {
    pending: { color: 'text-neutral-500', icon: Clock, label: 'Aguardando' },
    processing: { color: 'text-yellow-500', icon: Clock, label: 'Analisando' },
    completed: { color: 'text-green-500', icon: CheckCircle2, label: 'Concluído' },
    failed: { color: 'text-red-500', icon: AlertCircle, label: 'Erro' },
  }

  const currentStatus = statusConfig[classification.status]
  const StatusIcon = currentStatus.icon

  // Normalizar confidence (pode vir 0.9 ou 90)
  const rawConfidence = classification.result?.confidence ?? 0
  const confidence = rawConfidence <= 1 ? Math.round(rawConfidence * 100) : Math.round(rawConfidence)

  return (
    <div className="glass-card p-4 group hover:bg-white/[0.08] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${currentStatus.color} group-hover:scale-105 transition-transform`}>
            <Icon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isUrl ? (
                <a 
                  href={classification.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-white truncate hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  {classification.source}
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              ) : (
                <h4 className="text-sm font-bold text-white truncate">
                  {classification.source}
                </h4>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className={currentStatus.color}>{classification.category || 'Não categorizado'}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-500">
                {formatDistanceToNow(new Date(classification.createdAt), { addSuffix: true, locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-neutral-600 hover:text-white transition-colors p-2"
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button 
            onClick={() => onDelete?.(classification.id)}
            className="text-neutral-600 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {classification.status === 'completed' && classification.justification && (
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[11px] text-white/60 leading-relaxed italic">
            "{classification.justification}"
          </p>
        </div>
      )}

      {showDetails && classification.result?.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {classification.result.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 ${currentStatus.color}`}>
          <StatusIcon size={14} className={classification.status === 'processing' ? 'animate-spin' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{currentStatus.label}</span>
        </div>
        
        {classification.status === 'completed' && (classification.result?.confidence !== undefined) && (
          <div className="text-[10px] font-black text-white/20">
            CONFIDENCE: <span className="text-white/60">{confidence}%</span>
          </div>
        )}
      </div>
    </div>
  )
}
