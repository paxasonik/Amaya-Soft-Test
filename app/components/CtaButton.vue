<script setup lang="ts">
import type { CtaState } from '~/composables/usePaywall'

defineProps<{
  state: CtaState
  label: string
}>()
</script>

<template>
  <button
    type="button"
    class="cta t-button"
    :class="`cta--${state}`"
    :disabled="state !== 'default'"
    :aria-busy="state === 'loading'"
  >
    <svg
      v-if="state === 'loading'"
      class="cta__spinner"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 1.5A8.5 8.5 0 1 1 1.5 10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 56px;
  color: var(--color-text-on-primary);
  background: var(--color-primary);
  border-radius: 16px;
  transition: background-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.cta--default {
  box-shadow: var(--shadow-cta);
}

.cta--default:active {
  background: var(--color-primary-pressed);
  transform: scale(0.98);
}

.cta--disabled {
  background: var(--color-primary-disabled);
}

.cta:disabled {
  cursor: default;
}

.cta__spinner {
  flex: none;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
