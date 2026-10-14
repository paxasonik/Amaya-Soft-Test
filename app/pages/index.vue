<script setup lang="ts">
const {
  offers,
  offersView,
  reloadOffers,
  selectedId,
  select,
  phase,
  busy,
  banner,
  ctaState,
  ctaLabel,
  success,
  purchase,
  restore,
  close,
  play,
} = usePaywall()
</script>

<template>
  <div>
    <SuccessView
    v-if="success"
    :info="success"
    @play="play"
  />

  <ScreenLayout v-else>
    <header class="paywall-header">
      <div class="paywall-header__bar">
        <CloseButton @click="close" />
      </div>
      <div class="paywall-hero">
        <HeroIllustration />
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

    <FeatureList />

    <OfferList
      :view="offersView"
      :offers="offers"
      :selected-id="selectedId"
      :disabled="busy"
      @select="select"
      @retry="reloadOffers"
    />

    <template #footer>
      <div class="paywall-actions">
        <StatusBanner
          v-if="banner"
          :type="banner.type"
          :text="banner.text"
        />
        <CtaButton
          :state="ctaState"
          :label="ctaLabel"
          @click="purchase"
        />
      </div>
      <button
        type="button"
        class="paywall-restore t-link"
        :class="{ 'is-dimmed': busy }"
        :disabled="busy"
        @click="restore"
      >
        {{ phase === 'restoring' ? 'Проверяем покупки…' : 'Восстановить покупки' }}
      </button>
      <p class="paywall-legal t-legal text-secondary">
        Тестовая покупка · Отмена в любой момент
      </p>
    </template>
  </ScreenLayout>

  <DevOnly>
    <DesignOverlay />
  </DevOnly>
  </div>
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

.paywall-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.paywall-restore {
  height: 44px;
  padding: 0 12px;
  color: var(--color-primary);
}

.paywall-restore.is-dimmed {
  opacity: 0.5;
}

.paywall-restore:disabled {
  cursor: default;
}

.paywall-legal {
  width: 100%;
  text-align: center;
}
</style>
