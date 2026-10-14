<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: IconName
  size?: number
  /** Толщина линии в px при итоговом размере — как в макете */
  stroke?: number
}>(), {
  size: 24,
  stroke: 2,
})

const strokeWidth = computed(() => (props.stroke * 24) / props.size)
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- статичные пути из ICONS, не пользовательский ввод -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="ICONS[name]"
  />
</template>
