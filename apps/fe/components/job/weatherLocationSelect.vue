<template>
  <div class="relative">

    <UInput
      :model-value="countrySearch"
      class="w-100"
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
        class="ul absolute left-0 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 z-10 w-full">
        <li
          v-for="option in selectCountryOptions"
          :key="option.value"
          :class="[option.value ? 'cursor-pointer hover:bg-primary' : '', 'my-0.5 px-2']"
          @click="selectCountry(option.value)">
          {{ option.name }}
        </li>
      </ul>
    </transition>

  </div>
</template>
<script setup lang="ts">
/**
 * @file A component to look up a country from the weather API.
 */

import type { IWeatherLocation } from 'shared-lib/src/interfaces/weather.interfaces';

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
const config = useRuntimeConfig();

//#region Properties
/**
 * An array of objects representing the available country options.
 */
const selectCountryOptions: Ref<{ name: string, value: string }[]> = ref([]);

/**
 * The search query string.
 */
const countrySearch = ref('');

/**
 * Indicates whether the country input field has focus or not.
 */
const countryHasFocus = ref(false);

/**
 * Indicates whether the countries are currently being loaded in a search.
 */
const countriesLoading = ref(false);

/**
 * A timestamp of the last time the country input was changed.
 */
const lastCountryInput = ref<number | null>(null);

/**
 * Indicates whether the component has been modified. If so it is eligible to display an error state.
 */
const dirty = ref(false);
//#endregion

//#region Methods

/**
 * Function to handle blur event on country input field.
 * Sets countryHasFocus to false and dirty to true.
 */
const blur = () => {
  countryHasFocus.value = false;
  dirty.value = true;
};

/**
 * Updates the country search input and triggers input monitoring.
 * @param {string} input - The input string to update the country search with.
 */
const countrySearchInput = (input: string) => {
  countrySearch.value = input;
  if(!lastCountryInput.value) {
    lastCountryInput.value = new Date().getTime();
    doInputMonitoring();
    return;
  }
  lastCountryInput.value = new Date().getTime();
};

/**
 * Monitors the input field for changes and calls the getCountries function if the input has changed and the time since the last call is greater than 800ms.
 */
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

/**
 * Fetches weather locations based on a search query and populates the select options with the results.
 * @async
 */
const getCountries = async() => {
  if(!countrySearch.value) { return; }
  const { data } = await useFetch<IWeatherLocation[]>(`${config.public.apiBase}/weather/search?q=${countrySearch.value}`);
  if(data.value) {
    selectCountryOptions.value = [];
    if(!data.value.length) {
      selectCountryOptions.value.push({ name: 'No results found.', value: '' });
    }
    data.value.forEach((location) => {
      selectCountryOptions.value.push({ 
        name: `${location.name}, ${location.region && location.region !== location.name ? `${location.region},`: ''} ${location.country}`, 
        value: location.url
      });
    });
  }
};

/**
 * Selects a country based on the provided ID.
 * @param {string} id - The ID of the country to select.
 */
const selectCountry = (id: string) => {
  if(!id) { return; }
  if(selectCountryOptions.value.length) {
    const country = selectCountryOptions.value.find((c) => c.value === id);
    if(country) {
      countrySearch.value = country.name;
      emit('update:modelValue', country?.value);
    }
  }
};
//#endregion

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