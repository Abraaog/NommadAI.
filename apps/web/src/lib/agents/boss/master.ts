import { generateBossChallenge } from './challenge';
import { interpretProof } from './proof';
import { getBossFeedback } from './feedback';
import { extractNetworkAssets } from './network';

export class BossMasterAgent {
  /**
   * Gera um novo desafio para o usuário
   */
  static async createNewChallenge(identity: any, phase: string, history: string, sessionId?: string) {
    return generateBossChallenge(identity, phase, history, sessionId);
  }

  /**
   * Processa a submissão de uma prova
   */
  static async processSubmission(challenge: any, proofText: string, previousContext?: any, sessionId?: string) {
    // 1. Interpreta a prova usando o contexto prévio
    const analysis = await interpretProof(challenge, proofText, previousContext, sessionId);

    // 2. Extrai ativos de rede se houver sucesso ou parcial
    let network = null;
    if (analysis.resultado !== 'falha') {
      network = await extractNetworkAssets(proofText, sessionId);
    }

    // 3. Gera o feedback em voz do Boss
    const feedback = await getBossFeedback(analysis, sessionId);

    return {
      analysis,
      network,
      feedback,
      newContext: {
        summary: analysis.contexto_atualizado,
        lastUpdate: new Date().toISOString(),
        outcome: analysis.resultado
      }
    };
  }
}
