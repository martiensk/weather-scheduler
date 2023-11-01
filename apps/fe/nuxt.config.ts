/**
 * @file Nuxt.js configuration file.
 */
import runtimeConfig from './config.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig,
  build: {
    transpile: ['shared-lib']
  }
});
