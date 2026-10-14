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
    <PaywallSuccess
      v-if="success"
      :info="success"
      @play="play"
    />

    <UiScreen v-else>
      <PaywallHeader @close="close" />
      <PaywallFeatures />
      <PaywallOfferList
        :view="offersView"
        :offers="offers"
        :selected-id="selectedId"
        :disabled="busy"
        @select="select"
        @retry="reloadOffers"
      />

      <template #footer>
        <PaywallFooter
          :banner="banner"
          :cta-state="ctaState"
          :cta-label="ctaLabel"
          :busy="busy"
          :restoring="phase === 'restoring'"
          @purchase="purchase"
          @restore="restore"
        />
      </template>
    </UiScreen>

    <DevOnly>
      <DevDesignOverlay />
    </DevOnly>
  </div>
</template>
