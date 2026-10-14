import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey(),
  offerId: text('offer_id').notNull(),
  deviceId: text('device_id').notNull(),
  // Повтор запроса с тем же ключом не создаёт вторую покупку
  idempotencyKey: text('idempotency_key').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  index('purchases_device_idx').on(table.deviceId),
])

export type PurchaseRow = typeof purchases.$inferSelect
