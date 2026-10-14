<script setup lang="ts">
defineProps<{
  type: 'error' | 'info'
  text: string
}>()
</script>

<template>
  <div
    class="banner"
    :class="`banner--${type}`"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    <UiIcon
      :name="type === 'error' ? 'circle-alert' : 'info'"
      :size="20"
      class="banner__icon"
    />
    <p class="t-banner banner__text">
      {{ text }}
    </p>
  </div>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 14px;
}

.banner__icon {
  flex: none;
}

.banner__text {
  flex: 1;
}

.banner--error {
  color: var(--color-error-text);
  background: var(--color-error-soft);
}

.banner--error .banner__icon {
  color: var(--color-error);
}

.banner--info {
  color: var(--color-text-primary);
  background: var(--color-primary-soft);
}

.banner--info .banner__icon {
  color: var(--color-primary);
}
</style>
