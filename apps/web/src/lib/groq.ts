import Groq from 'groq-sdk'

const AI_API_URL = process.env.AI_API_URL || undefined

// Um cliente por agente = rate limits completamente independentes (ou via Grouter)
function client(keyEnv: string | undefined) {
  return new Groq({ 
    apiKey: keyEnv ?? process.env.AI_API_KEY ?? '', 
    baseURL: AI_API_URL 
  })
}

export const groqClients = {
  cleaner:    client(process.env.GROQ_KEY_CLEANER),
  analyst:    client(process.env.GROQ_KEY_ANALYST),
  classifier: client(process.env.GROQ_KEY_CLASSIFIER),
  strategist: client(process.env.GROQ_KEY_STRATEGIST),
  brain:      client(process.env.GROQ_KEY_BRAIN),
  response:   client(process.env.GROQ_KEY_RESPONSE),
  mission:    client(process.env.GROQ_KEY_MISSION),
  checkin:    client(process.env.GROQ_KEY_CHECKIN),
  psycho:     client(process.env.GROQ_KEY_CHECKIN),
} as const

export const MODELS = {
  cleaner:    process.env.MODEL_CLEANER || 'llama-3.1-8b-instant',
  classifier: process.env.MODEL_CLASSIFIER || 'llama-3.1-8b-instant',
  mission:    process.env.MODEL_MISSION || 'llama-3.3-70b-versatile',
  analyst:    process.env.MODEL_ANALYST || 'llama-3.3-70b-versatile',
  strategist: process.env.MODEL_STRATEGIST || 'llama-3.3-70b-versatile',
  response:   process.env.MODEL_RESPONSE || 'llama-3.1-8b-instant',
  checkin:    process.env.MODEL_CHECKIN || 'llama-3.3-70b-versatile',
  psycho:     process.env.MODEL_PSYCHO || 'llama-3.3-70b-versatile',
  brain:      process.env.MODEL_BRAIN || 'llama-3.1-8b-instant',
  identity:   process.env.MODEL_IDENTITY || 'llama-3.3-70b-versatile',
  breakdown:  process.env.MODEL_BREAKDOWN || 'llama-3.1-8b-instant',
} as const

export type AgentName = keyof typeof MODELS

export const GROQ_CONFIGURED = !!(process.env.AI_API_KEY || process.env.GROQ_KEY_CLEANER)
