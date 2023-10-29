<template>

  <UContainer class="grid grid-cols-3 grid-flow-row gap-4">

    <WeatherCard
      v-for="job in data"
      :key="job.id"
      :weather="job" />
      
  </UContainer>

</template>
<script setup lang="ts">
/**
 * @file Index.
 */
import type { IScheduledJob } from 'shared-lib/src/interfaces/jobs.interfaces';
import { EWSSMessageType } from 'shared-lib/src/enums/wss.enums';
import type { IWeatherCurrent } from 'shared-lib/src/interfaces/weather.interfaces';

const config = useRuntimeConfig();
const { data } = await useFetch<IScheduledJob[]>(`${config.public.apiBase}/scheduler/get-jobs`);

onMounted(() => {
  /*
   * Listens to the event bus for updates on weather jobs and updates the last run time for the corresponding job in the data object.
   */
  eventBus.listen(EWSSMessageType.WEATHER_JOB_UPDATE, (job: { jobId: number, weathers: IWeatherCurrent[]}) => {
    if(data.value) {
  
      data.value = data.value.map((j) => {
        if(j.id === job.jobId){
          j.runs = job.weathers;
        }
        return j;
      });

    }
  });

});
</script>