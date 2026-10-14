// Источник правды по тарифам — сервер: клиент присылает только offerId, цену не передаёт.
export const OFFERS: Offer[] = [
  {
    id: 'yearly',
    title: 'Год',
    description: `${formatRub(2990)} в год`,
    price: 2990,
    pricePerMonth: 249,
    period: 'year',
    badge: 'Выгода 50%',
    isDefault: true,
  },
  {
    id: 'monthly',
    title: 'Месяц',
    description: 'Оплата каждый месяц',
    price: 499,
    pricePerMonth: 499,
    period: 'month',
    badge: null,
    isDefault: false,
  },
]

export function findOffer(id: string): Offer | undefined {
  return OFFERS.find(offer => offer.id === id)
}
