export type OfferPeriod = 'month' | 'year'

export interface Offer {
  id: string
  title: string
  description: string
  /** Цена за весь период, ₽ */
  price: number
  /** Цена в пересчёте на месяц, ₽ */
  pricePerMonth: number
  period: OfferPeriod
  badge: string | null
  isDefault: boolean
}

export interface PurchaseResult {
  purchaseId: string
  /** Короткий номер для показа пользователю */
  shortId: string
  offerId: string
  createdAt: string
}

export interface RestoreResult {
  purchase: PurchaseResult | null
}
