'use client'

import { 
  Target, Brain, Briefcase, Zap, Kanban, Swords, Headphones, Rocket, Layers, BarChart2
} from 'lucide-react'
import { ModuleCard } from './module-card'

type Stage = 'iniciante' | 'intermediario' | 'avancado'

interface ModuleGridProps {
  stage?: Stage
}

export function ModuleGrid({ stage = 'iniciante' }: ModuleGridProps) {
  const getModules = (currentStage: Stage) => {
    return [
      {
        title: 'Estratégia',
        description: 'Defina seus objetivos de carreira e acompanhe seu progresso artístico.',
        icon: Target,
        href: '/dashboard/estrategia',
        status: currentStage === 'iniciante' ? 'Prioridade Máxima' : 'Em progresso',
        color: currentStage === 'iniciante' ? 'yellow' : 'yellow',
        highlight: currentStage === 'iniciante'
      },
      {
        title: 'Minha Marca',
        description: 'Construa sua identidade visual e narrativa de marca.',
        icon: Brain,
        href: '/dashboard/minha-marca',
        status: currentStage === 'iniciante' ? 'Ajustes necessários' : 'Consolidado',
        color: 'purple'
      },
      {
        title: 'Meu Negócio',
        description: 'Gestão financeira e administrativa da sua carreira.',
        icon: Briefcase,
        href: '/dashboard/meu-negocio',
        status: 'Configurar',
        color: 'emerald'
      },
      {
        title: 'Gerador',
        description: 'Crie conteúdos e ideias rápidas com auxílio de IA.',
        icon: Zap,
        href: '/dashboard/gerador',
        status: 'Pronto para uso',
        color: 'amber'
      },
      {
        title: 'Kanban',
        description: 'Gerencie suas tarefas e projetos de forma visual.',
        icon: Kanban,
        href: '/dashboard/kanban',
        status: 'Ativo',
        color: 'blue'
      },
      {
        title: 'Chefões',
        description: 'CRM avançado para lidar com labels, managers e bookings.',
        icon: Swords,
        href: '/dashboard/chefoes',
        isPremium: true,
        status: currentStage === 'avancado' ? 'Prioridade de Escala' : 'Bloqueado',
        color: 'rose',
        highlight: currentStage === 'avancado'
      },
      {
        title: 'Sound Design',
        description: 'Análise técnica de timbres e tendências sonoras.',
        icon: Headphones,
        href: '/dashboard/sound-design',
        isPremium: true,
        status: 'Beta',
        color: 'indigo'
      },
      {
        title: 'Release System',
        description: 'Planejamento e execução de lançamentos de D-30 a D+7.',
        icon: Rocket,
        href: '/dashboard/release-system',
        isPremium: true,
        status: currentStage === 'avancado' ? 'Pronto para Lancamento' : 'Planejamento',
        color: 'green',
        highlight: currentStage === 'avancado'
      },
      {
        title: 'Classificador AI',
        description: 'Classifique links, documentos e mídias com inteligência artificial.',
        icon: Layers,
        href: '/dashboard/classificador',
        status: 'Análise inteligente',
        isPremium: true,
        color: 'sky'
      },
      {
        title: 'Analytics',
        description: 'Centralize estatísticas e insights estratégicos da sua carreira.',
        icon: BarChart2,
        href: '/dashboard/analytics',
        status: 'Visão Global',
        color: 'orange'
      },
    ]
  }

  const modules = getModules(stage)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {modules.map((module) => (
        <ModuleCard key={module.href} {...module} />
      ))}
    </div>
  )
}

