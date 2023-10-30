<template>
  <UCard
    v-if="reversedData.length && location && current"
    class="min-w-[300px] max-w-[400px] relative">

    <UIcon
      v-if="isAdmin"
      name="i-heroicons-trash"
      class="absolute top-2 right-2 text-red-400 font-bold cursor-pointer" />
  
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

    <div class="w-full h-full absolute top-0 left-0 bg-white/50 flex items-center justify-center">
      <UIcon
        name="i-heroicons-arrow-path"
        class="text-xl text-gray-800 font-bold animate-spin" />
    </div>

    <template #footer>
      <div class="flex justify-between items-center text-xs">
        <UButton
          class="mr-3"
          @click="isOpen = !isOpen">
          <UIcon name="i-heroicons-information-circle" /> More info...
        </UButton>
        <template v-if="lastUpdated">
          Last updated: {{ new Date(lastUpdated).toLocaleString() }}
        </template>
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
const emit = defineEmits(['delete:weather']);

const isAdmin = useState<boolean>('isAdmin', () => false);
const isOpen = ref(false);

const reversedData = computed(() => {
  if(!props.weather.runs?.length) { return []; }
  return props.weather.runs.slice().reverse();
});

const location = computed(() => {
  if (reversedData.value.length > 0) {
    return reversedData.value[0].location;
  }
  return null;
});

const current = computed(() => {
  if (reversedData.value.length > 0) {
    return reversedData.value[0].current;
  }
  return null;
});

const lastUpdated = computed(() => {
  if (reversedData.value.length > 0) {
    return reversedData.value[0].updated;
  }
  return null;
});

/**
 * This method has some weird type conversion thanks to typing in the UTable component from NuxtUI.
 */
const tableData = computed(() => reversedData.value.map((item) => ({
  Run: new Date(item.updated).toLocaleString(),
  'Temp °C': item.current.temp_c,
  'Feels like °C': item.current.feelslike_c,
  'Wind km/h': item.current.wind_kph,
  'Wind direction': item.current.wind_dir,
  'Humidity %': item.current.humidity,
  'Cloud %': item.current.cloud,
  UV: item.current.uv,
  'Visibility km': item.current.vis_km,
  Condition: item.current.condition.text
})) as unknown as { [key: string]: any }[]);

const deleteJob = async() => {
  const config = useRuntimeConfig();
  const { data } = await useFetch(`${config.public.apiBase}/scheduler/delete-job`, {
    method: 'POST',
    body: JSON.stringify({
      id: props.weather.id
    })
  });
  console.log(data.value);
  if(data) {
    emit('delete:weather', props.weather.id);
  }
};
</script>