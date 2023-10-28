<template>
  <header class="bg-background/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800 py-2 px-3 flex justify-between items-center shadow-md">
    Dashboard
    <UiColourModeButton />
  </header>
  <main class="p-3">
    <slot />
  </main>
</template>
<script setup lang="ts">
/**
 * @file Default layout.
 */
</script>