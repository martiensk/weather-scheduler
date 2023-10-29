<template>
  <UCard v-if="weather.lastRun && location && current">
  
    <template #header>
      <span>{{ location.name }}, </span>
      <span v-if="location.region && location.name !== location.region">{{ location.region }}, </span>
      <span>{{ location.country }}</span>
    </template>

    <div class="flex justify-center items-center flex-col">
      <img
        class="max-w-[64px]"
        :src="`https:${current.condition.icon}`"
        :alt="current.condition.text">
      <div class="text-sm">
        {{ current.condition.text }}
      </div>
      <div class="text-4xl font-bold">
        {{ current.temp_c }}°C
      </div>
      <div class="text-sm">
        Feels like {{ current.feelslike_c }}°C
      </div>
    </div>

    <UModal
      v-model="isOpen"
      fullscreen>
      <UCard class="rounded-none divide-y divide-gray-100 dark:divide-gray-800 h-full">
        <template #header>
          <div class="flex justify-between items-center">
            <span>
              {{ location.name }}, 
              <template v-if="location.region && location.name !== location.region">{{ location.region }}, </template>
              {{ location.country }}
            </span>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>
        <UTable
          class="grow"
          :rows="tableData" />
      </UCard>
    </UModal>

    <template #footer>
      <div class="flex justify-between items-center text-xs">
        <UButton @click="isOpen = !isOpen">
          <UIcon name="i-heroicons-information-circle" /> More info...
        </UButton>
        Last updated: {{ new Date(weather.lastRun.updated).toLocaleString() }}
      </div>
    </template>
  </UCard>

</template>
<script setup lang="ts">
/**
 * @file Weather card.
 */
import type { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';

const props = defineProps({
  weather: {
    type: Object as PropType<IScheduledJob>,
    required: true,
  },
});

const location = ref(props.weather.lastRun?.location);
const current = ref(props.weather.lastRun?.current);

const isOpen = ref(false);

const tableData = ref([props.weather].map((item) => ({
  Run: new Date(item.lastRun?.updated).toLocaleString(),
  'Temp °C': item.lastRun?.current.temp_c,
  'Feels like °C': item.lastRun?.current.feelslike_c,
  'Wind km/h': item.lastRun?.current.wind_kph,
  'Wind direction': item.lastRun?.current.wind_dir,
  'Humidity %': item.lastRun?.current.humidity,
  'Cloud %': item.lastRun?.current.cloud,
  UV: item.lastRun?.current.uv,
  'Visibility km': item.lastRun?.current.vis_km,
  Condition: item.lastRun?.current.condition.text
})));
</script>