<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>
<script setup lang="ts">
/**
 * @file App.
 */

// Initialise websocket listener on client only
if(process.client) {
  initWSS();
}
</script>