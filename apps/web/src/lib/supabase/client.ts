'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_CONFIGURED, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/env'

/* eslint-disable @typescript-eslint/no-explicit-any */
const previewStub: any = new Proxy({}, {
  get: (_t, prop) => {
    // Methods that are expected to return an object with data/error (like auth)
    if (prop === 'auth') {
      return new Proxy({}, {
        get: (_a, method) => {
          // Most auth methods are async and return { data, error }
          return async () => ({
            data: null,
            error: new Error(`[nommad:preview] Supabase not configured (calling auth.${String(method)})`)
          })
        }
      })
    }

    // Methods like .channel(), .on(), .subscribe(), .from(), .select() etc.
    // We return a function that, when called, returns the proxy itself to allow chaining.
    return (..._args: unknown[]) => previewStub
  }
})
/* eslint-enable @typescript-eslint/no-explicit-any */

let client: any

export function createSupabaseClient() {
  if (!SUPABASE_CONFIGURED) return previewStub
  if (client) return client

  client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return client
}
