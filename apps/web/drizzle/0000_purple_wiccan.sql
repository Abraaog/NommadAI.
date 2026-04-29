CREATE TABLE "agent_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"from_agent" text NOT NULL,
	"to_agent" text,
	"turn" integer DEFAULT 0 NOT NULL,
	"kind" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "agent_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"agent_name" text NOT NULL,
	"model" text NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"latency_ms" integer,
	"tokens_in" integer,
	"tokens_out" integer,
	"estimated_cost" numeric DEFAULT '0',
	"status" text DEFAULT 'ok' NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "behavior" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"consistencia_score" integer DEFAULT 0,
	"exec_streak" integer DEFAULT 0,
	"padroes" jsonb,
	"autossabotagens" jsonb,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "boss_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"boss_id" text NOT NULL,
	"status" text DEFAULT 'aberto' NOT NULL,
	"provas" jsonb,
	"result" text,
	"feedback" text,
	"xp_awarded" integer DEFAULT 0,
	"network_data" jsonb,
	"aberto_em" timestamp with time zone DEFAULT now(),
	"atualizado_em" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "classifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source" text NOT NULL,
	"type" text NOT NULL,
	"category" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"justification" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"category" text,
	"status" text DEFAULT 'lead' NOT NULL,
	"notes" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "design_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"worker_id" text,
	"workflow_slug" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"params" jsonb NOT NULL,
	"progress" integer DEFAULT 0,
	"comfy_prompt_id" text,
	"result_url" text,
	"thumbnail_url" text,
	"error" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "design_workers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'worker' NOT NULL,
	"tailnet_url" text NOT NULL,
	"vram_mb" integer,
	"vram_free_mb" integer,
	"status" text DEFAULT 'offline' NOT NULL,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "design_workflows" (
	"slug" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"comfy_json" jsonb NOT NULL,
	"param_schema" jsonb NOT NULL,
	"defaults" jsonb,
	"enabled" boolean DEFAULT true,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "generated_hooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid,
	"texto" text NOT NULL,
	"categoria" text,
	"saved" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "identity" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"essencia" text,
	"teses_centrais" jsonb,
	"teses_secundarias" jsonb,
	"assuntos" jsonb,
	"forca_marca" integer DEFAULT 0,
	"dna" jsonb,
	"posicionamento" jsonb,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kanban_card_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kanban_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"tipo" text NOT NULL,
	"source" text,
	"tag" text,
	"coluna" text NOT NULL,
	"prioridade" integer DEFAULT 0,
	"relacao_missao_id" uuid,
	"insights" text,
	"metricas" jsonb,
	"resultado" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leaderboard_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"score" integer DEFAULT 0,
	"execution_score" integer DEFAULT 0,
	"boss_score" integer DEFAULT 0,
	"impact_score" integer DEFAULT 0,
	"evolution_score" integer DEFAULT 0,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "leaderboard_scores_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid,
	"content" text NOT NULL,
	"embedding" vector(384),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mission_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mission_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"done" boolean DEFAULT false,
	"order_index" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "missions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid,
	"titulo" text NOT NULL,
	"descricao" text,
	"duracao_dias" integer DEFAULT 7,
	"status" text DEFAULT 'active' NOT NULL,
	"confronto_nivel" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"artist_name" text,
	"genre" text,
	"stage" text DEFAULT 'pendente',
	"confronto_level" integer DEFAULT 1,
	"plan" text DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"config_json" jsonb,
	"xp" integer DEFAULT 0,
	"np" integer DEFAULT 0,
	"badges" jsonb,
	"fase_carreira" text,
	"nivel_tecnico" text,
	"arquetipo_estrategico" jsonb,
	"network" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "psycho_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid,
	"arquetipo_crescimento" text,
	"padroes_dominantes" jsonb,
	"autossabotagens" jsonb,
	"alavancas" jsonb,
	"risco_atual" text,
	"proximo_passo" text,
	"observacao_critica" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ranking_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"position" integer NOT NULL,
	"period" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"tipo" text,
	"release_date" timestamp with time zone,
	"status" text DEFAULT 'planning',
	"timeline" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hook_id" uuid,
	"gancho" text,
	"introducao" text,
	"desenvolvimento" text,
	"encerramento" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"input_audio_url" text,
	"input_text" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"stripe_subscription_id" text,
	"plan" text NOT NULL,
	"status" text NOT NULL,
	"current_period_end" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE INDEX "agent_messages_session_turn_idx" ON "agent_messages" USING btree ("session_id","turn");--> statement-breakpoint
CREATE INDEX "agent_runs_session_idx" ON "agent_runs" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "boss_cases_user_idx" ON "boss_cases" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "contacts_user_idx" ON "contacts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "design_jobs_user_idx" ON "design_jobs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "design_jobs_status_idx" ON "design_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "memories_user_idx" ON "memories" USING btree ("user_id");