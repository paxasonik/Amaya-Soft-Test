<script setup lang="ts">
defineEmits<{ close: [] }>()
</script>

<template>
  <header class="paywall-header">
    <div class="paywall-header__bar">
      <UiCloseButton @click="$emit('close')" />
    </div>
    <div class="paywall-hero">
      <PaywallIllustration />
      <div class="paywall-hero__texts">
        <h1 class="t-title">
          Открой все уровни!
        </h1>
        <p class="t-body text-secondary">
          Развивающие игры и задания для детей<br>4–8 лет без рекламы
        </p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.paywall-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.paywall-header__bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 44px;
}

.paywall-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.paywall-hero__texts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  text-align: center;
}
</style>
