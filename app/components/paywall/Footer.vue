<script setup lang="ts">
import type { Banner, CtaState } from '~/composables/usePaywall'

defineProps<{
  banner: Banner | null
  ctaState: CtaState
  ctaLabel: string
  busy: boolean
  restoring: boolean
}>()

defineEmits<{
  purchase: []
  restore: []
}>()
</script>

<template>
  <div class="paywall-actions">
    <UiBanner
      v-if="banner"
      :type="banner.type"
      :text="banner.text"
    />
    <UiButton
      :state="ctaState"
      :label="ctaLabel"
      @click="$emit('purchase')"
    />
  </div>
  <button
    type="button"
    class="paywall-restore t-link"
    :class="{ 'is-dimmed': busy }"
    :disabled="busy"
    @click="$emit('restore')"
  >
    {{ restoring ? 'Проверяем покупки…' : 'Восстановить покупки' }}
  </button>
  <p class="paywall-legal t-legal text-secondary">
    Тестовая покупка · Отмена в любой момент
  </p>
</template>

<style scoped>
.paywall-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.paywall-restore {
  height: 44px;
  padding: 0 12px;
  color: var(--color-primary);
}

.paywall-restore.is-dimmed {
  opacity: 0.5;
}

.paywall-restore:disabled {
  cursor: default;
}

.paywall-legal {
  width: 100%;
  text-align: center;
}
</style>
