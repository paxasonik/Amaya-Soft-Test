<script setup lang="ts">
// Dev-инструмент: ?overlay накладывает PNG из Figma поверх страницы (50%) для pixel perfect сверки.
// Вместе с ?state=... показывает нужное состояние, например /?state=purchasing&overlay
const FILES: Record<string, string> = {
  'default': 'Default.png',
  'loading': 'Loading.png',
  'offers-error': 'Offers error.png',
  'purchasing': 'Purchasing.png',
  'purchase-error': 'Purchase error.png',
  'restored': 'Restored.png',
  'success': 'Success.png',
}

const route = useRoute()
const src = computed(() => {
  if (route.query.overlay === undefined) return null
  const state = typeof route.query.state === 'string' ? route.query.state : 'default'
  return `/__design/${encodeURIComponent(FILES[state] ?? FILES.default!)}`
})
</script>

<template>
  <img
    v-if="src"
    :src="src"
    class="design-overlay"
    alt=""
  >
</template>

<style scoped>
.design-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 100;
  width: 390px;
  opacity: 0.5;
  pointer-events: none;
  transform: translateX(-50%);
}
</style>
