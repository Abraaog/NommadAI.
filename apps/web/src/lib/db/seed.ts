import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const client = postgres(databaseUrl, { prepare: false })
const db = drizzle(client, { schema })

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Clear existing data (optional but good for clean seed)
  // await db.delete(schema.missionTasks)
  // await db.delete(schema.releases)
  // await db.delete(schema.contacts)
  // await db.delete(schema.profiles)

  const testUserId = '00000000-0000-0000-0000-000000000000'

  // 2. Create a test profile
  console.log('Creating profile...')
  await db.insert(schema.profiles).values({
    id: testUserId,
    name: 'Admin User',
    artistName: 'Nommad Artist',
    genre: 'Electronic',
    stage: 'avancado',
    plan: 'pro',
    xp: 1500,
    np: 85,
  }).onConflictDoUpdate({
    target: schema.profiles.id,
    set: { name: 'Admin User', xp: 1500 },
  })

  // 3. Create sample contacts
  console.log('Creating contacts...')
  await db.insert(schema.contacts).values([
    {
      userId: testUserId,
      name: 'John Agent',
      email: 'john@agency.com',
      category: 'agent',
      status: 'negotiation',
      notes: 'Interested in the new album.',
    },
    {
      userId: testUserId,
      name: 'Sarah Press',
      email: 'sarah@magazine.com',
      category: 'press',
      status: 'lead',
      notes: 'Sent the press kit.',
    },
    {
      userId: testUserId,
      name: 'Mike Producer',
      email: 'mike@studio.com',
      category: 'producer',
      status: 'closed',
      notes: 'Working on the next single.',
    },
  ])

  // 4. Create sample releases
  console.log('Creating releases...')
  const releaseDate = new Date()
  releaseDate.setDate(releaseDate.getDate() + 30) // D+30

  await db.insert(schema.releases).values([
    {
      userId: testUserId,
      titulo: 'Neon Nights',
      tipo: 'single',
      releaseDate: releaseDate,
      status: 'planning',
    },
    {
      userId: testUserId,
      titulo: 'Cyber Echoes',
      tipo: 'ep',
      releaseDate: new Date(),
      status: 'released',
    },
  ])

  // 5. Create sample missions and tasks
  console.log('Creating missions and tasks...')
  const missionResult = await db.insert(schema.missions).values({
    userId: testUserId,
    titulo: 'Lançamento Neon Nights',
    descricao: 'Preparação completa para o novo single.',
    status: 'active',
  }).returning({ id: schema.missions.id })

  const missionId = missionResult[0].id

  await db.insert(schema.missionTasks).values([
    {
      missionId: missionId,
      descricao: 'Finalizar Mixagem',
      done: true,
      orderIndex: 0,
    },
    {
      missionId: missionId,
      descricao: 'Preparar Press Kit',
      done: false,
      orderIndex: 1,
    },
    {
      missionId: missionId,
      descricao: 'Agendar Postagens',
      done: false,
      orderIndex: 2,
    },
  ])

  console.log('✅ Seeding complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
