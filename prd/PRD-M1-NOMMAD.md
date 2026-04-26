# PRD - Milestone 1 (M1) - NOMMAD AI: Vertical Slice

## Objetivo
Implementar o "Vertical Slice" do NOMMAD AI, garantindo que o núcleo funcional (Dashboard, Chefões, Timeline, Classificador) esteja operando com dados reais do Supabase e lógica AI integrada.

## Tasks Ralph Loop

### Task 1: Setup inicial do projeto
- [x] Criar estrutura de pastas `apps/web` (Next.js)
- [x] Configurar TypeScript, Tailwind CSS v4, Framer Motion
- [x] Configurar layout base (Glassmorphism, Dark Mode)
- [x] Validar build e lint

### Task 2: Configuração do Banco de Dados
- [x] Setup Supabase (Project ID, Keys)
- [x] Definir Schema no Drizzle (Users, Contacts, Releases, Tasks)
- [x] Executar migrações iniciais
- [x] Seed de dados de exemplo

### Task 3: Dashboard Core (Layout & Navigation)
- [x] Implementar Sidebar dinâmica
- [x] Header com Gamificação (XP, Level, Precision status)
- [x] Grid de módulos interativo
- [x] Responsividade Mobile/Desktop

### Task 4: Módulo "Chefões" (A&R/CRM)
- [x] Listagem de contatos/artistas do Supabase
- [x] Kanban de negociações (Status: Lead, Em Negociação, Fechado)
- [x] CRUD básico de contatos
- [x] Integração com Cérebro AI para insights de contatos

### Task 5: Módulo "Timeline Director"
- [x] Visualização de Timeline de lançamentos
- [x] Lógica de D-30 a D+7
- [x] Automação de tarefas baseada em data de lançamento
- [x] Persistência de datas no banco

### Task 6: Módulo "Classificador AI"
- [x] Upload de arquivos/links para classificação
- [x] Lógica de classificação mockada (inicialmente)
- [x] Persistência de resultados de classificação
- [x] UI de feedback de classificação

### Task 7: Integração Final e QA
- [x] Garantir fluxo entre módulos
- [x] Testes de UX/UI (Fidelity Check)
- [x] Correção de bugs críticos
- [x] Deployment inicial / Build de produção

### Task 8: Analytics & Insights (Bonus)
- [x] Centralizar estatísticas de todos os módulos (Chefões, Timeline, Classificador)
- [x] Implementar visualizações de dados (Gráficos de atividade, progresso de lançamentos)
- [x] Adicionar seção de "Cérebro Global" para insights estratégicos cross-módulo
- [x] UI de Dashboard Executivo (Glassmorphism avançado)

## Regras de Execução
- Uma task por vez.
- Atualizar `prd/progress.txt` ao final de cada iteração.
- Resetar contexto entre tasks.
