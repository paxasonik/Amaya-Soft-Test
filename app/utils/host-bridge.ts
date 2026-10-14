type HostEvent = 'close' | 'purchase' | 'play'

interface HostWindow extends Window {
  webkit?: { messageHandlers?: { paywall?: { postMessage: (message: unknown) => void } } }
  ReactNativeWebView?: { postMessage: (message: string) => void }
}

/**
 * Сообщить нативному приложению о действии на paywall.
 * Канал зависит от хоста: WKWebView, React Native WebView или iframe. Вне webview — no-op.
 */
export function postToHost(event: HostEvent, payload: Record<string, unknown> = {}) {
  const message = { source: 'paywall', event, ...payload }
  const w = window as HostWindow

  if (w.webkit?.messageHandlers?.paywall) {
    w.webkit.messageHandlers.paywall.postMessage(message)
  }
  else if (w.ReactNativeWebView) {
    w.ReactNativeWebView.postMessage(JSON.stringify(message))
  }
  else if (w.parent !== w) {
    w.parent.postMessage(message, '*')
  }
}
