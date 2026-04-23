import { pgTable, text, timestamp, uuid, jsonb, integer, boolean, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Schema definition for NommadAI
// ... (trimmed for brevity in this thought block, will push full content)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('artist'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
// ... (the rest of the schema)
