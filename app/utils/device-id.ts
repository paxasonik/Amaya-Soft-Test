const STORAGE_KEY = 'paywall:device-id'

/**
 * Условный идентификатор устройства.
 * Нативное приложение может передать свой через ?deviceId=..., иначе генерируем и храним в localStorage.
 */
export function getDeviceId(fromQuery?: string): string {
  if (fromQuery && fromQuery.length >= 8) {
    return fromQuery
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved
    const id = uuid()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  }
  catch {
    // localStorage может быть недоступен (приватный режим, ограничения webview)
    return uuid()
  }
}
