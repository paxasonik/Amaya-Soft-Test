<template>
  <button
    type="button"
    class="close-button"
    aria-label="Закрыть"
  >
    <span class="close-button__circle">
      <AppIcon
        name="x"
        :size="20"
      />
    </span>
  </button>
</template>

<style scoped>
/* 44×44 — зона нажатия, видимый круг 36 */
.close-button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.close-button__circle {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  transition: transform 0.15s;
}

.close-button:active .close-button__circle {
  transform: scale(0.94);
}
</style>
