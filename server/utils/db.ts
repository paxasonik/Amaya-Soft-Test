import { mkdir } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'
import { sql } from 'drizzle-orm'
import { drizzle as drizzleNeon, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

type Db = NeonHttpDatabase<typeof schema>

let dbPromise: Promise<Db> | undefined

/**
 * DATABASE_URL задан → Neon Postgres (прод и, при желании, локально).
 * Не задан и это dev → PGlite: тот же Postgres в WASM, файл в .data/, без регистрации.
 */
export function useDb(): Promise<Db> {
  dbPromise ??= createDb().catch((error) => {
    dbPromise = undefined
    throw error
  })
  return dbPromise
}

async function createDb(): Promise<Db> {
  const url = process.env.DATABASE_URL
  let db: Db

  if (url) {
    db = drizzleNeon({ client: neon(url), schema })
  }
  else if (import.meta.dev) {
    const { PGlite } = await import('@electric-sql/pglite')
    const { drizzle } = await import('drizzle-orm/pglite')
    await mkdir('.data', { recursive: true })
    // Для наших запросов (insert/select) API драйверов совпадает
    db = drizzle({ client: new PGlite('.data/pglite'), schema }) as unknown as Db
  }
  else {
    throw new Error('DATABASE_URL is not set')
  }

  await ensureSchema(db)
  return db
}

// Схема из одной таблицы, поэтому создаём её идемпотентно при старте вместо миграций.
async function ensureSchema(db: Db) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS purchases (
      id uuid PRIMARY KEY,
      offer_id text NOT NULL,
      device_id text NOT NULL,
      idempotency_key text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS purchases_device_idx ON purchases (device_id)`)
}
