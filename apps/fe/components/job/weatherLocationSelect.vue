<template>
  <div class="relative">
    <UInput
      :model-value="countrySearch"
      class="inline-block"
      :loading="countriesLoading"
      placeholder="Search..."
      :color="dirty && !modelValue ? 'red' : 'white'"
      variant="outline"
      @update:model-value="countrySearchInput"
      @focus="countryHasFocus = true"
      @blur="blur" />

    <transition name="fade">
      <ul
        v-if="selectCountryOptions.length && countryHasFocus"
        class="ul absolute left-0 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900">
        <li
          v-for="option in selectCountryOptions"
          :key="option.value"
          class="cursor-pointer hover:bg-primary my-0.5 px-2"
          @click="selectCountry(option.value)">
          {{ option.name }}
        </li>
      </ul>
    </transition>

  </div>
</template>
<script setup lang="ts">
import type { IWeatherLocation } from 'shared-lib/src/interfaces/weather.interfaces';

/**
 * @file A component to look up a country from the weather API.
 */

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
const config = useRuntimeConfig();

const selectCountryOptions: Ref<{ name: string, value: string }[]> = ref([]);
const countrySearch = ref('');
const countryHasFocus = ref(false);
const countriesLoading = ref(false);
const lastCountryInput = ref<number | null>(null);
const dirty = ref(false);

const blur = () => {
  countryHasFocus.value = false;
  dirty.value = true;
};

const countrySearchInput = (input: string) => {
  countrySearch.value = input;
  if(!lastCountryInput.value) {
    lastCountryInput.value = new Date().getTime();
    doInputMonitoring();
    return;
  }
  lastCountryInput.value = new Date().getTime();
};

const doInputMonitoring = () => {
  if(!lastCountryInput.value) { return; }
  // Bit of logic to stop the API being called too often.
  if(lastCountryInput.value && new Date().getTime() > lastCountryInput.value + 800) {
    // No need for an await since this can be synchronous (No one cares)
    getCountries();
    lastCountryInput.value = null;
    return;
  }
  window.requestAnimationFrame(doInputMonitoring);
};

const getCountries = async() => {
  const { data } = await useFetch<IWeatherLocation[]>(`${config.public.apiBase}/weather/search?q=${countrySearch.value}`);
  if(data.value) {
    selectCountryOptions.value = [];
    data.value.forEach((location) => {
      selectCountryOptions.value.push({ 
        name: `${location.name},${location.region && location.region !== location.name ? `${location.region} ,`: ''} ${location.country}`, 
        value: location.url
      });
    });
  }
};

const selectCountry = (id: string) => {
  if(selectCountryOptions.value.length) {
    const country = selectCountryOptions.value.find((c) => c.value === id);
    if(country) {
      countrySearch.value = country.name;
      emit('update:modelValue', country?.value);
    }
  }
};
</script>
<style scoped>
.ul {
  top: calc(100% + 3px)
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s ease-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>