<template>
  <UButton
    :icon="isAdmin ? 'i-heroicons-lock-open' : 'i-heroicons-lock-closed'"
    :color="!isAdmin ? 'green' : 'red'"
    aria-label="Admin Mode"
    @click="isAdmin = !isAdmin" />
</template>
  
<script setup lang="ts">
/**
 * @file Colour mode button.
 */
  
/**
 * Nuxt state of whether the user is an admin or not.
 */
const isAdmin = useState<boolean>('isAdmin', () => false);
</script>