<template>
  <ClientOnly>

    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark" />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
    
  </ClientOnly>
</template>

<script setup lang="ts">
/**
 * @file Colour mode button.
 */

const colorMode = useColorMode();

/**
 * A computed variable that determines whether the current colour mode is dark or not.
 */
const isDark = computed({
  get() {
    return colorMode.value === 'dark';
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  }
});
</script>