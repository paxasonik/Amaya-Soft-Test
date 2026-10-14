<script setup lang="ts">
const features: { icon: IconName, text: string }[] = [
  { icon: 'gamepad-2', text: 'Все 120 уровней и мини-игр' },
  { icon: 'shield-check', text: 'Никакой рекламы' },
  { icon: 'sparkles', text: 'Новые задания каждую неделю' },
]
</script>

<template>
  <ul class="features">
    <li
      v-for="feature in features"
      :key="feature.icon"
      class="features__row"
    >
      <span class="features__icon">
        <UiIcon
          :name="feature.icon"
          :size="16"
        />
      </span>
      <span class="t-feature">{{ feature.text }}</span>
    </li>
  </ul>
</template>

<style scoped>
.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: var(--color-bg-surface);
  border-radius: 20px;
}

.features__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.features__icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 28px;
  height: 28px;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: 8px;
}
</style>
