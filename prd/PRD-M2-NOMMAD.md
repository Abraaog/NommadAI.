# PRD - Milestone 2 (M2) - NOMMAD AI: Sistema Base

## Objetivo
Transformar o "Vertical Slice" em um produto sólido e comercializável. O foco é em automação, inteligência de memória e monetização.

## Tasks Ralph Loop (Proposta)

### Task 1: Intelig\u00eancia de Mem\u00f3ria (Memory Engine)
- [x] Configurar `pgvector` no Supabase e schema `memories`
- [x] Implementar embeddings para check-ins e sess\u00f5es passadas
- [x] Criar agente de recupera\u00e7\u00e3o de contexto (Memory Agent) e interface de texto

### Task 2: Refinamento do Gerador & Hooks
- [x] Implementar fluxo completo: Gerar Hook -> Salvar -> Criar Roteiro
- [x] Adicionar "Aprofundamento AI" para cada ideia gerada
- [x] UI avan\u00e7ada para edi\u00e7\u00e3o de roteiros

### Task 3: Kanban Editorial 2.0
- [x] Sincroniza\u00e7\u00e3o em tempo real das colunas (Supabase Realtime)
- [x] Modal de detalhes do card com hist\u00f3rico de edi\u00e7\u00f5es
- [x] Integra\u00e7\u00e3o entre Miss\u00f5es e Kanban

### Task 4: Classifier & Check-in Loop
- [x] Implementar lógica real do Classifier (Nível de Carreira + Confronto)
- [x] Criar interface de Check-in diário/semanal
- [x] Feedback visual do "Cérebro" após cada check-in

### Task 5: Monetização (Stripe Integration)
- [ ] Configurar produtos/preços no Stripe
- [ ] Implementar checkout e portal do cliente (Plano Pro)
- [ ] Middlewares de proteção de rotas premium

### Task 6: Landing Page & Onboarding
- [x] Desenvolver Landing Page de alta conversão
- [x] Refinar onboarding por áudio (UX fluida)
- [x] Dashboard de Pricing

### Task 7: Limpeza e Consolidação Multi-Agente
- [x] Exclusão de resquícios de migração (_target_repo)
- [x] Limpeza de arquivos soltos e logs temporários
- [x] Organização da pasta `prd/` com a técnica Ralph Loop
- [x] Validação final do pipeline de 8 agentes

---

## Observações Técnicas Importantes
- **Multi-Agents / Multi-Providers**: Futuramente, o sistema deve ser expandido para suportar múltiplos provedores de IA simultaneamente (Groq, OpenAI, Anthropic, etc.) através de uma arquitetura de multi-agentes.
- **Entrada de Texto**: Atualmente, o sistema prioriza entrada de texto em todas as interfaces (Onboarding, Estratégia, etc.), já que o modelo principal (`gpt-oss-120b`) é otimizado para texto.

---

## Critérios de Sucesso
- Sistema operando com memória persistente de longo prazo.
- Fluxo de pagamento funcional.
- Onboarding capaz de converter usuários sem intervenção manual.

## Regras de Execução
- Uma task por vez.
- Atualizar `prd/progress.txt` ao final de cada iteração.
- Resetar contexto entre tasks.
