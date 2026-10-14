import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { purchases } from '../db/schema'

const bodySchema = z.object({
  deviceId: z.string().min(8).max(128),
})

export default defineEventHandler(async (event): Promise<RestoreResult> => {
  const { deviceId } = await readValidatedBody(event, bodySchema.parse)

  await sleep(600)

  if (shouldFail(event, 'restore')) {
    throw createError({ statusCode: 502, statusMessage: 'Restore failed (simulated)' })
  }

  const db = await useDb()
  const [last] = await db
    .select()
    .from(purchases)
    .where(eq(purchases.deviceId, deviceId))
    .orderBy(desc(purchases.createdAt))
    .limit(1)

  return { purchase: last ? toPurchaseResult(last) : null }
})
