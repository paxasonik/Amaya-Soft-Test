export type OffersView = 'loading' | 'error' | 'ready'
export type CtaState = 'default' | 'disabled' | 'loading'
type Phase = 'idle' | 'purchasing' | 'restoring' | 'success'

export interface Banner {
  type: 'error' | 'info'
  text: string
}

export interface SuccessInfo {
  shortId: string
  offerTitle: string
  restored: boolean
}

export function usePaywall() {
  const route = useRoute()
  const query = (key: string) => {
    const value = route.query[key]
    return typeof value === 'string' ? value : undefined
  }
  const fail = query('fail')

  // Тарифы грузим на клиенте: в реальном приложении цены приходят из стора на устройстве
  const { data: offers, status: offersStatus, refresh: reloadOffers } = useFetch<Offer[]>('/api/offers', {
    query: { fail },
    server: false,
    lazy: true,
    default: () => [],
  })

  const forcedOffersView = ref<OffersView | null>(null)
  const offersView = computed<OffersView>(() => {
    if (forcedOffersView.value) return forcedOffersView.value
    if (offersStatus.value === 'error') return 'error'
    return offersStatus.value === 'success' ? 'ready' : 'loading'
  })

  const selectedId = ref<string | null>(null)
  const selectedOffer = computed(() => offers.value.find(offer => offer.id === selectedId.value) ?? null)

  watch(offers, (list) => {
    if (!selectedId.value && list.length) {
      selectedId.value = (list.find(offer => offer.isDefault) ?? list[0]!).id
    }
  }, { immediate: true })

  const phase = ref<Phase>('idle')
  const banner = ref<Banner | null>(null)
  const purchaseFailed = ref(false)
  const success = ref<SuccessInfo | null>(null)
  const busy = computed(() => phase.value === 'purchasing' || phase.value === 'restoring')

  // Ключ живёт, пока пользователь повторяет ту же покупку: ретрай после обрыва сети не создаст дубль
  let idempotencyKey: string | null = null

  function select(id: string) {
    if (busy.value || id === selectedId.value) return
    selectedId.value = id
    idempotencyKey = null
    purchaseFailed.value = false
    banner.value = null
  }

  const ctaState = computed<CtaState>(() => {
    if (phase.value === 'purchasing') return 'loading'
    if (offersView.value !== 'ready' || phase.value === 'restoring') return 'disabled'
    return 'default'
  })

  const ctaLabel = computed(() => {
    if (phase.value === 'purchasing') return 'Оформляем покупку…'
    if (offersView.value === 'loading') return 'Загружаем тарифы…'
    if (offersView.value === 'error' || !selectedOffer.value) return 'Открыть всё'
    if (purchaseFailed.value) return 'Попробовать снова'
    return `Открыть всё за ${formatRub(selectedOffer.value.price)}`
  })

  async function purchase() {
    const offer = selectedOffer.value
    if (!offer || phase.value !== 'idle') return

    phase.value = 'purchasing'
    banner.value = null
    idempotencyKey ??= uuid()

    try {
      const result = await $fetch<PurchaseResult>('/api/purchase', {
        method: 'POST',
        query: { fail },
        body: { offerId: offer.id, deviceId: getDeviceId(query('deviceId')), idempotencyKey },
      })
      idempotencyKey = null
      purchaseFailed.value = false
      success.value = { shortId: result.shortId, offerTitle: offer.title, restored: false }
      phase.value = 'success'
      postToHost('purchase', { offerId: offer.id, purchaseId: result.purchaseId })
    }
    catch {
      purchaseFailed.value = true
      banner.value = { type: 'error', text: 'Не удалось оформить покупку' }
      phase.value = 'idle'
    }
  }

  async function restore() {
    if (phase.value !== 'idle') return

    phase.value = 'restoring'
    banner.value = null

    try {
      const { purchase: restored } = await $fetch<RestoreResult>('/api/restore', {
        method: 'POST',
        query: { fail },
        body: { deviceId: getDeviceId(query('deviceId')) },
      })
      if (restored) {
        const title = offers.value.find(offer => offer.id === restored.offerId)?.title ?? restored.offerId
        success.value = { shortId: restored.shortId, offerTitle: title, restored: true }
        phase.value = 'success'
        return
      }
      banner.value = { type: 'info', text: 'Покупки не найдены' }
    }
    catch {
      banner.value = { type: 'error', text: 'Не удалось восстановить покупки' }
    }
    phase.value = 'idle'
  }

  // Во webview нативное приложение закрывает paywall и открывает контент.
  // В обычном браузере (демо) хоста нет — возвращаем экран в начало, чтобы сценарий можно было пройти заново.
  function play() {
    if (postToHost('play')) return
    success.value = null
    banner.value = null
    purchaseFailed.value = false
    phase.value = 'idle'
  }

  // Dev: ?state=... фиксирует экран в одном из состояний макета для попиксельной сверки
  if (import.meta.dev) {
    const state = query('state')
    if (state === 'loading') forcedOffersView.value = 'loading'
    if (state === 'offers-error') forcedOffersView.value = 'error'
    if (state === 'purchasing') phase.value = 'purchasing'
    if (state === 'purchase-error') {
      purchaseFailed.value = true
      banner.value = { type: 'error', text: 'Не удалось оформить покупку' }
    }
    if (state === 'restored') banner.value = { type: 'info', text: 'Покупки не найдены' }
    if (state === 'success') {
      success.value = { shortId: '7F3A2C', offerTitle: 'Год', restored: false }
      phase.value = 'success'
    }
  }

  return {
    offers,
    offersView,
    reloadOffers,
    selectedId,
    select,
    phase,
    busy,
    banner,
    ctaState,
    ctaLabel,
    success,
    purchase,
    restore,
    close: () => postToHost('close'),
    play,
  }
}
