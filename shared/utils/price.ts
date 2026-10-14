const NBSP = ' '

/**
 * 2990 → «2 990 ₽» с неразрывными пробелами.
 * Не Intl.NumberFormat: в части движков он ставит узкий пробел (U+202F),
 * который отличается по ширине от макета.
 */
export function formatRub(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) + NBSP + '₽'
}
