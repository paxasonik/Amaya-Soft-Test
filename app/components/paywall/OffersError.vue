<script setup lang="ts">
defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="offers-error"
    role="alert"
  >
    <UiIcon
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
</template>

<style scoped>
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
