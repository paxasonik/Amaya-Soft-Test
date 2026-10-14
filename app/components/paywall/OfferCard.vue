<script setup lang="ts">
defineProps<{
  offer: Offer
  selected: boolean
  disabled?: boolean
}>()

defineEmits<{ select: [] }>()
</script>

<template>
  <label
    class="offer"
    :class="{ 'offer--selected': selected }"
  >
    <input
      type="radio"
      name="offer"
      class="visually-hidden"
      :value="offer.id"
      :checked="selected"
      :disabled="disabled"
      @change="$emit('select')"
    >
    <span
      class="offer__radio"
      aria-hidden="true"
    />
    <span class="offer__info">
      <span class="t-card-title">{{ offer.title }}</span>
      <span class="t-caption text-secondary">{{ offer.description }}</span>
    </span>
    <span class="offer__price">
      <span class="t-price">{{ formatRub(offer.pricePerMonth) }}</span>
      <span class="t-caption text-secondary">в месяц</span>
    </span>
    <span
      v-if="offer.badge"
      class="offer__badge t-badge"
    >{{ offer.badge }}</span>
  </label>
</template>

<style scoped>
/* В Figma stroke 2 учитывается в auto layout (Strokes included in layout): border 2 + padding 16 = высота 80 */
.offer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.offer--selected {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-selected);
}

.offer:active {
  transform: scale(0.98);
}

.offer:has(:focus-visible) {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.offer__radio {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border-radio);
  border-radius: 50%;
}

.offer--selected .offer__radio {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.offer--selected .offer__radio::after {
  width: 10px;
  height: 10px;
  content: '';
  background: var(--color-bg-surface);
  border-radius: 50%;
}

.offer__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.offer__price {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  text-align: right;
}

/* В Figma: 16 от правого края и −10 от верха карточки; в CSS отсчёт от внутренней границы border */
.offer__badge {
  position: absolute;
  top: -12px;
  right: 14px;
  padding: 3px 8px;
  color: var(--color-text-primary);
  background: var(--color-accent-amber);
  border-radius: 10px;
}
</style>
