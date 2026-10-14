<script setup lang="ts">
import type { OffersView } from '~/composables/usePaywall'

defineProps<{
  view: OffersView
  offers: Offer[]
  selectedId: string | null
  disabled?: boolean
}>()

defineEmits<{
  select: [id: string]
  retry: []
}>()
</script>

<template>
  <div
    v-if="view === 'ready'"
    class="offer-list"
    :class="{ 'is-dimmed': disabled }"
    role="radiogroup"
    aria-label="Тариф"
  >
    <OfferCard
      v-for="offer in offers"
      :key="offer.id"
      :offer="offer"
      :selected="offer.id === selectedId"
      :disabled="disabled"
      @select="$emit('select', offer.id)"
    />
  </div>

  <div
    v-else-if="view === 'loading'"
    class="offer-list"
    role="status"
  >
    <span class="visually-hidden">Загружаем тарифы</span>
    <div
      v-for="i in 2"
      :key="i"
      class="offer-list__skeleton"
      aria-hidden="true"
    />
  </div>

  <div
    v-else
    class="offer-list"
  >
    <div
      class="offers-error"
      role="alert"
    >
      <AppIcon
        name="wifi-off"
        class="offers-error__icon"
      />
      <div class="offers-error__texts">
        <p class="t-card-title">
          Не удалось загрузить тарифы
        </p>
        <p class="t-caption text-secondary">
          Проверьте интернет и попробуйте снова
        </p>
      </div>
      <button
        type="button"
        class="offers-error__retry t-link"
        @click="$emit('retry')"
      >
        Повторить
      </button>
    </div>
  </div>
</template>

<style scoped>
.offer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.offer-list.is-dimmed {
  opacity: 0.5;
  pointer-events: none;
}

.offer-list__skeleton {
  height: 76px;
  background: linear-gradient(90deg, var(--color-skeleton) 0%, #F3F0FD 50%, var(--color-skeleton) 100%) 0 0 / 200% 100%;
  border-radius: 20px;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

.offers-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 20px;
  text-align: center;
  background: var(--color-bg-surface);
  border-radius: 20px;
}

.offers-error__icon {
  color: var(--color-error);
}

.offers-error__texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.offers-error__retry {
  height: 44px;
  padding: 0 20px;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: 12px;
}
</style>
