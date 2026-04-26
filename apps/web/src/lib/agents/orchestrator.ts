import { runCleaner } from './cleaner'
import { runAnalyst } from './analyst'
import { runClassifier } from './classifier'
import { runStrategist } from './strategist'
import { runBrainConsolidator, type BrainConsolidated } from './brain'
import { runResponse } from './response'
import { runMission } from './mission'
import { type Mission } from './shared'

export type PipelineOutput = {
  brain: BrainConsolidated
  response: string
  mission: Mission
}

/**
 * Executa o pipeline completo de 8 agentes:
 * 1. Cleaner (Seq)
 * 2. Analyst, Classifier, Strategist (Parallel)
 * 3. Brain Consolidator (Seq)
 * 4. Response & Mission (Parallel)
 */
export async function runFullPipeline(
  sessionId: string,
  rawInput: string,
  artistName?: string
): Promise<PipelineOutput> {
  // 1. Cleaner
  const cleaned = await runCleaner({ sessionId, rawText: rawInput })

  // 2. Parallel Analysis
  const [analysis, classification, strategy] = await Promise.all([
    runAnalyst(cleaned),
    runClassifier(cleaned),
    runStrategist(cleaned)
  ])

  // 3. Brain Consolidation
  const brain = await runBrainConsolidator({
    analysis,
    strategy,
    classification
  })

  // 4. Final Outputs
  const [response, mission] = await Promise.all([
    runResponse(brain as any, classification, artistName),
    runMission(brain as any, classification)
  ])

  return {
    brain,
    response,
    mission
  }
}
