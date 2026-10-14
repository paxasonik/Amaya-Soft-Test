import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { purchases } from '../db/schema'

const bodySchema = z.object({
  offerId: z.string().min(1).max(64),
  deviceId: z.string().min(8).max(128),
  idempotencyKey: z.uuid(),
})

export default defineEventHandler(async (event): Promise<PurchaseResult> => {
  const body = await readValidatedBody(event, bodySchema.parse)

  if (!findOffer(body.offerId)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown offer' })
  }

  await sleep(900)

  if (shouldFail(event, 'purchase')) {
    throw createError({ statusCode: 502, statusMessage: 'Payment failed (simulated)' })
  }

  const db = await useDb()
  const [inserted] = await db
    .insert(purchases)
    .values({ id: randomUUID(), ...body })
    .onConflictDoNothing({ target: purchases.idempotencyKey })
    .returning()

  if (inserted) {
    setResponseStatus(event, 201)
    return toPurchaseResult(inserted)
  }

  // Повторный запрос (ретрай после обрыва сети) — возвращаем уже созданную покупку
  const [existing] = await db
    .select()
    .from(purchases)
    .where(eq(purchases.idempotencyKey, body.idempotencyKey))
    .limit(1)

  if (!existing || existing.offerId !== body.offerId || existing.deviceId !== body.deviceId) {
    throw createError({ statusCode: 409, statusMessage: 'Idempotency key reused with different payload' })
  }
  return toPurchaseResult(existing)
})
