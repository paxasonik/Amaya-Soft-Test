import type { PurchaseRow } from '../db/schema'

export function toPurchaseResult(row: PurchaseRow): PurchaseResult {
  return {
    purchaseId: row.id,
    shortId: row.id.replace(/-/g, '').slice(0, 6).toUpperCase(),
    offerId: row.offerId,
    createdAt: row.createdAt.toISOString(),
  }
}

/** Имитация задержки «платёжного провайдера», чтобы было видно состояния загрузки */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** ?fail=offers | ?fail=purchase | ?fail=restore — показать состояние ошибки */
export function shouldFail(event: Parameters<typeof getQuery>[0], target: string) {
  return getQuery(event).fail === target
}
