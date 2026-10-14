<script setup lang="ts">
defineProps<{
  /** Контент по центру по вертикали (экран успеха) */
  center?: boolean
}>()
</script>

<template>
  <div class="screen">
    <main
      class="screen__content"
      :class="{ 'screen__content--center': center }"
    >
      <slot />
    </main>
    <footer class="screen__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  max-width: 430px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
}

/* На коротких экранах контент прокручивается под закреплённым футером */
.screen__content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: calc(8px + env(safe-area-inset-top)) 20px 24px;
}

.screen__content--center {
  justify-content: center;
  padding: env(safe-area-inset-top) 20px 0;
}

.screen__footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
  background: var(--color-bg-surface);
  border-radius: 24px 24px 0 0;
  box-shadow: var(--shadow-footer);
}
</style>
