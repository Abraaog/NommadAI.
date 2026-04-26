const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const SUPABASE_URL = url ?? ''
export const SUPABASE_ANON_KEY = key ?? ''
export const SUPABASE_CONFIGURED =
  !!url && !!key &&
  !url.includes('placeholder') && !key.includes('placeholder')
export const PREVIEW_MODE = !SUPABASE_CONFIGURED

const anthropicKey = process.env.ANTHROPIC_API_KEY
export const ANTHROPIC_API_KEY = anthropicKey ?? ''
export const ANTHROPIC_CONFIGURED = !!anthropicKey && anthropicKey !== 'placeholder'

const groqKey = process.env.GROQ_API_KEY
export const GROQ_API_KEY = groqKey ?? ''
export const GROQ_CONFIGURED = !!groqKey && groqKey !== 'placeholder'

export const AI_API_KEY = process.env.AI_API_KEY || GROQ_API_KEY
export const AI_API_URL = process.env.AI_API_URL || ''

// ----- Design module (ComfyUI worker pipeline) -----------------

const workerSecret = process.env.WORKER_SHARED_SECRET
export const WORKER_SHARED_SECRET = workerSecret ?? ''
export const WORKER_CONFIGURED = !!workerSecret && workerSecret.length >= 16

const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
export const SUPABASE_SERVICE_ROLE_KEY = serviceRole ?? ''
export const SUPABASE_SERVICE_CONFIGURED = !!serviceRole && !serviceRole.includes('placeholder')

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// ----- Feature flags -----------------

export const FF_AGENT_DIALOGUE =
  (process.env.FF_AGENT_DIALOGUE ?? 'false').toLowerCase() === 'true'

// AI toggle removed - now controlled via grouter API (/api/config)
// Keep enabled by default, grouter handles the actual toggle
export const AI_ENABLED = true
