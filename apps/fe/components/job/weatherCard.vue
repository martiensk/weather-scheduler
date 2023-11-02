<template>
  <UCard
    v-if="reversedData.length && location && current"
    class="min-w-[300px] relative">

    <UIcon
      v-if="isAdmin"
      name="i-heroicons-trash"
      class="absolute top-2 right-2 text-red-400 font-bold cursor-pointer"
      @click="deleteJob" />
  
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

    <div
      v-if="loading"
      class="w-full h-full absolute top-0 left-0 bg-white/50 flex items-center justify-center backdrop-blur-sm">
      <UIcon
        name="i-heroicons-arrow-path"
        class="text-4xl text-gray-800 font-bold animate-spin" />
    </div>

    <template #footer>
      <div class="flex justify-between items-center text-xs">
        <UButton
          class="mr-3"
          @click="isOpen = !isOpen">
          More info...
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
import type { IScheduledJob } from 'shared-lib';

const props = defineProps({
  weather: {
    type: Object as PropType<IScheduledJob>,
    required: true,
  },
});
const emit = defineEmits(['delete:weather']);

//#region Properties
/**
 * Nuxt state to determine if the user is an admin or not.
 */
const isAdmin = useState<boolean>('isAdmin', () => false);
/**
 * Indicates whether the weather card is open or closed.
 */
const isOpen = ref(false);
/**
 * Indicates whether the component is currently loading or not.
 */
const loading = ref(false);
//#endregion

//#region Computed
/**
 * Computed property that returns the reversed array of weather runs.
 */
const reversedData = computed(() => {
  if(!props.weather.runs?.length) { return []; }
  return props.weather.runs.slice().reverse();
});

/**
 * Computed property that returns the location property of the first item in the reversedData array.
 */
const location = computed(() => {
  if (reversedData.value.length > 0) {
    return reversedData.value[0].location;
  }
  return null;
});

/**
 * Computed property that returns the current property of the first item in the reversedData array.
 */
const current = computed(() => {
  if (reversedData.value.length > 0) {
    return reversedData.value[0].current;
  }
  return null;
});

/**
 * Computed property that returns the last updated value of the first item in the reversedData array.
 */
const lastUpdated = computed(() => {
  if (reversedData.value.length > 0) {
    return reversedData.value[0].updated;
  }
  return null;
});

/**
 * This computed property has some weird type conversion thanks to typing in the UTable component from NuxtUI.
 * It returns the table data for the UTable component.
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
//#endregion

/**
 * Deletes a weather job using the API endpoint.
 * @async
 */
const deleteJob = async() => {
  loading.value = true;
  const toast = useToast();

  const token = useCookie<string>('token');

  if(!token.value) {
    toast.add({
      id: 'delete_weather_failed',
      title: 'Error!',
      description: 'You must be logged in to delete a weather job.',
      icon: 'i-heroicons-x-mark',
      timeout: 5000,
      color: 'red',
      actions: []
    });
    loading.value = false;
    return;
  }

  try {
    const config = useRuntimeConfig();
    const { data } = await useFetch(`${config.public.apiBase}/scheduler/delete-job`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        id: props.weather.id
      })
    });
  
    if((data.value as { success: boolean }).success) {
      emit('delete:weather', props.weather.id);

      toast.add({
        id: 'delete_weather_success',
        title: 'Success!',
        description: 'Weather job deleted successfully.',
        icon: 'i-heroicons-check',
        timeout: 2000,
        color: 'green',
        actions: []
      });
      return;
    }

    throw new Error('No data returned from API.');
    
  } catch (error) {

    console.error(error);
    toast.add({
      id: 'delete_weather_failed',
      title: 'Error!',
      description: 'There was a problem deleting the weather job.',
      icon: 'i-heroicons-x-mark',
      timeout: 5000,
      color: 'red',
      actions: []
    });
    
  } finally {
    loading.value = false;
  }
};
</script>