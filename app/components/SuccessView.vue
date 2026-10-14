<script setup lang="ts">
import type { SuccessInfo } from '~/composables/usePaywall'

defineProps<{ info: SuccessInfo }>()
defineEmits<{ play: [] }>()
</script>

<template>
  <ScreenLayout center>
    <div class="success-icon">
      <AppIcon
        name="check"
        :size="56"
        :stroke="3"
      />
    </div>
    <div
      class="success-texts"
      role="status"
    >
      <h1 class="t-title">
        Готово! Всё открыто
      </h1>
      <p class="t-body text-secondary">
        Тариф «{{ info.offerTitle }}» {{ info.restored ? 'восстановлен' : 'активирован' }}.<br>Приятной игры!
      </p>
    </div>
    <div class="receipt">
      <span class="t-caption text-secondary">Номер покупки</span>
      <span class="t-caption-strong">#{{ info.shortId }}</span>
    </div>

    <template #footer>
      <CtaButton
        state="default"
        label="Начать играть"
        @click="$emit('play')"
      />
    </template>
  </ScreenLayout>
</template>

<style scoped>
.success-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 112px;
  height: 112px;
  color: var(--color-success);
  background: var(--color-success-soft);
  border-radius: 50%;
}

.success-texts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  text-align: center;
}

.receipt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background: var(--color-bg-surface);
  border-radius: 16px;
}
</style>
